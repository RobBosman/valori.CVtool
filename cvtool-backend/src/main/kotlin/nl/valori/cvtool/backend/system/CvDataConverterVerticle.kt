package nl.valori.cvtool.backend.system

import io.reactivex.BackpressureStrategy.ERROR
import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.subjects.BehaviorSubject
import io.vertx.core.eventbus.ReplyFailure
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

const val CONVERT_CV_DATA_ADDRESS = "convert.cv.data"

class CvDataConverterVerticle : BasicVerticle(CONVERT_CV_DATA_ADDRESS) {

    // Ensure that cv conversion is throttled to reduce the amount of db-connections.
    private val permitSubject = BehaviorSubject.createDefault(1)

    override fun handleRequest(message: Message<JsonObject>) {
        fetchAllCvInstances()
            .zipWith(permitSubject.toFlowable(ERROR)) { job, _ -> job }
            .flatMap { cvInstance ->
                fetchCvData(cvInstance)
                    .map { cvData -> convertCvData(cvData) }
                    .doOnSuccess { permitSubject.onNext(1) }
                    .toFlowable()
            }
            .reduceWith(
                { JsonObject() },
                { entitiesJson, convertedCvJson -> mergeConvertedCvEntities(entitiesJson, convertedCvJson) }
            )
            .flatMap { saveAllCvInstances(it) }
            .subscribe(
                { resultJson ->
                    log.info("Successfully converted cv data of all accounts.")
                    message.reply(resultJson)
                },
                {
                    val errorMsg = "Error converting cv data: ${it.message}"
                    log.error(errorMsg, it)
                    message.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchAllCvInstances() =
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, JsonObject("""{ "cv": [{}] }"""), deliveryOptions)
            .map { it.body() }
            .toFlowable()
            .flatMap { allCvs -> Flowable.fromIterable(allCvs.getInstances("cv")) }

    private fun fetchCvData(cvInstance: JsonObject) =
        Single
            .just(cvInstance)
            .map { composeCvDataCriteria(it.getString("_id")) }
            .flatMap { vertx.eventBus().rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, it, deliveryOptions) }
            .map { it.body() }

    private fun composeCvDataCriteria(cvId: String) =
        JsonObject(
            """{
                "cv": [{ "_id": "$cvId" }],
                "education": [{ "cvId": "$cvId" }],
                "training": [{ "cvId": "$cvId" }],
                "skill": [{ "cvId": "$cvId" }],
                "publication": [{ "cvId": "$cvId" }],
                "reference": [{ "cvId": "$cvId" }],
                "experience": [{ "cvId": "$cvId" }],
                "audit_log": [{ "cvId": "$cvId" }]
            }"""
        )

    /**
     * @param cvData
     * {
     *   "cv": {
     *     "uuid-cv-1": {
     *       "_id": "uuid-cv-1",
     *       "accountId": "uuid-account-1",
     *       ...
     *     }
     *   },
     *   "education": {
     *     "uuid-education-1": {
     *       "_id": "uuid-education-1",
     *       "cvId": "uuid-cv-1",
     *       ...
     *     }
     *   },
     *   "audit_log": {
     *     "uuid-auit-log-1": {
     *       "_id": "uuid-audit-log-1",
     *       "accountId": "uuid-account-2",
     *       "cvId": "uuid-cv-1",
     *       ...
     *     }
     *   },
     *   ...
     * }
     * @return
     * {
     *   "characteristics": {
     *     "uuid-cv-1": {
     *       "_id": "uuid-cv-1",
     *       "accountId": "uuid-account-1",
     *       ...
     *     }
     *   },
     *   "education": {
     *     "uuid-education-1": {
     *       "_id": "uuid-education-1",
     *       "accountId": "uuid-account-1",
     *       ...
     *     }
     *   },
     *   "audit_log": {
     *     "uuid-auit-log-1": {
     *       "_id": "uuid-audit-log-1",
     *       "editorAccountId": "uuid-account-2",
     *       "cvAccountId": "uuid-account-1",
     *       ...
     *     }
     *   },
     *   ...
     * }
     */
    private fun convertCvData(cvData: JsonObject): JsonObject {
        // Add accountId to all instances belonging to the cv.
        val accountId = cvData.getInstances("cv").first().getString("accountId")
        listOf(
            "education",
            "training",
            "skill",
            "publication",
            "reference",
            "experience")
            .forEach { entityName ->
                cvData
                    .getInstances(entityName)
                    .forEach { instance ->
                        instance
                            .put("accountId", accountId)
                            .remove("cvId")
                    }
            }

        // Copy entity 'cv' to 'characteristics'.
        cvData.put("characteristics", cvData.getJsonObject("cv"))
        cvData.getInstances("characteristics")
            .forEach { it.put("includeInCv", true) }

        // Delete cv instances.
        val cvEntity = JsonObject()
        cvData.getInstanceIds("cv")
            .map { cvId -> cvEntity.put(cvId, JsonObject()) }
        cvData.put("cv", cvEntity)

        // Convert audit_logs.
        cvData
            .getInstances("audit_log")
            .forEach { instance ->
                instance
                    .put("editorAccountId", instance.getString("accountId"))
                    .put("cvAccountId", accountId)
                instance.remove("accountId")
                instance.remove("cvId")
            }
        return cvData
    }

    private fun mergeConvertedCvEntities(entities: JsonObject, cvData: JsonObject): JsonObject {
        listOf(
            "cv",
            "characteristics",
            "education",
            "training",
            "skill",
            "publication",
            "reference",
            "experience",
            "audit_log")
            .forEach { entityName ->
                if (!entities.map.containsKey(entityName)) {
                    entities.put(entityName, JsonObject())
                }
                val entity = entities.getJsonObject(entityName)

                cvData.getJsonObject(entityName)
                    .forEach { (instanceId, instance) ->
                        entity.put(instanceId, instance)
                    }
            }
        return entities
    }

    private fun saveAllCvInstances(convertedEntitiesJson: JsonObject) =
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, convertedEntitiesJson, deliveryOptions.setSendTimeout(30_000))
            .map { convertedEntitiesJson }
}