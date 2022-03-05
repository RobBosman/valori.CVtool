package nl.valori.cvtool.backend.system

import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.subjects.BehaviorSubject
import io.vertx.core.eventbus.ReplyFailure
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils
import nl.valori.cvtool.backend.ModelUtils.CV_RELATED_ENTITY_NAMES
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
            .toFlowable()
            .flatMap { allCvs -> Flowable.fromIterable(allCvs.getInstances("cv")) }
            .zipWith(permitSubject.toFlowable(BackpressureStrategy.ERROR)) { job, _ -> job }
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
                    message.reply(JsonObject().put("result", resultJson))
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

    private fun fetchCvData(cvInstance: JsonObject) =
        Single
            .just(cvInstance)
            .map { ModelUtils.composeCvDataCriteria(it.getString("accountId"), it.getString("_id")) }
            .flatMap { vertx.eventBus().rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, it, deliveryOptions) }
            .map { it.body() }

    /**
     * @param cvData
     * {
     *   "account": {
     *   "uuid-account-1": {
     *     "_id": "uuid-account-1",
     *     ...
     *     }
     *   },
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
     *   ...
     * }
     * @return
     * {
     *   "account": {
     *   "uuid-account-1": {
     *     "_id": "uuid-account-1",
     *     ...
     *     }
     *   },
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
     *       "accountId": "uuid-account-1",
     *       ...
     *     }
     *   },
     *   ...
     * }
     */
    private fun convertCvData(cvData: JsonObject): JsonObject {
        val accountId = cvData.getInstanceIds("account").first()
        CV_RELATED_ENTITY_NAMES
            .forEach { entityName ->
                cvData
                    .getInstances(entityName)
                    .forEach { instance -> instance.put("accountId", accountId) }
            }
        return cvData
    }

    private fun mergeConvertedCvEntities(entities: JsonObject, cvData: JsonObject): JsonObject {
        CV_RELATED_ENTITY_NAMES
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
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, convertedEntitiesJson, deliveryOptions)
            .map { convertedEntitiesJson }
}