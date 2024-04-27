package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.ModelUtils.hasInstances
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import java.util.UUID

const val CV_FETCH_ADDRESS = "cv.fetch"

internal class CvFetchVerticle : BasicVerticle(CV_FETCH_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "accountId": "id-of-account-to-generate-cv-for"
     *   }
     *
     * Response:
     *   {
     *     "account": {
     *       "id-of-account": {
     *         "_id": "id-of-account"
     *         ...
     *       }
     *     },
     *     "skill": {
     *       "id-of-skill": {
     *         "_id": "id-of-skill"
     *         "accountId": "id-of-account"
     *         ...
     *       }
     *     }
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message.body())
            .map { it.getString("accountId", "") }
            .doOnSuccess { if (it === "") error("'accountId' is not specified.") }
            .flatMap { accountId -> fetchOrCreateCvData(accountId) }
            .subscribe(
                {
                    log.debug("Successfully fetched cv data")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching cv data: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchOrCreateCvData(accountId: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, composeCvDataCriteria(accountId), deliveryOptions)
            .map { it.body() }
            .doOnSuccess { if (!it.hasInstances("account")) error("AccountId '$accountId' is unknown") }
            .flatMap {
                if (it.hasInstances("characteristics")) {
                    Single.just(it)
                } else {
                    createAndAddCharacteristics(accountId, it)
                }
            }
            .flatMap { cvData ->
                val criteria = cvData.getInstances("businessUnit")
                    .firstOrNull()
                    ?.getString("brandId", null)
                    ?.let { brandId -> """{ "brand": [{ "_id": "$brandId" }] }""" }
                    ?: """{ "brand": [{ "docxTemplate": "VALORI" }] }""" // Default to docxTemplate VALORI.
                fetchBrand(JsonObject(criteria))
                    .map { brandJson ->
                        cvData.put("brand", brandJson.getJsonObject("brand"))
                    }
            }

    private fun composeCvDataCriteria(accountId: String) =
        JsonObject(
            """{
                "account": [{ "_id": "$accountId" }],
                "characteristics": [{ "accountId": "$accountId" }],
                "education": [{ "accountId": "$accountId" }],
                "training": [{ "accountId": "$accountId" }],
                "skill": [{ "accountId": "$accountId" }],
                "publication": [{ "accountId": "$accountId" }],
                "reference": [{ "accountId": "$accountId" }],
                "experience": [{ "accountId": "$accountId" }],
                "businessUnit": [{ "accountIds": "$accountId" }]
            }"""
        )

    private fun fetchBrand(jsonCriteria: JsonObject) =
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, jsonCriteria, deliveryOptions)
            .map { it.body() }

    private fun createAndAddCharacteristics(accountId: String, cvData: JsonObject): Single<JsonObject> {
        val id = UUID.randomUUID().toString()
        val characteristicsInstances = JsonObject().put(id, composeCharacteristicsInstance(id, accountId))
        val characteristicsEntity = JsonObject().put("characteristics", characteristicsInstances)
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, characteristicsEntity, deliveryOptions)
            .map { cvData.put("characteristics", characteristicsInstances) }
    }

    private fun composeCharacteristicsInstance(id: String, accountId: String) =
        JsonObject(
            """{
                "_id": "$id",
                "accountId": "$accountId",
                "role": {},
                "profile": {},
                "interests": {},
                "includeInCv": true
            }"""
        )
}