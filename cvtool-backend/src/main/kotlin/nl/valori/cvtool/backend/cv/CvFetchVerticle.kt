package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.composeCharacteristicsInstance
import nl.valori.cvtool.backend.ModelUtils.composeCvDataCriteria
import nl.valori.cvtool.backend.ModelUtils.hasInstances
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import java.util.*

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
     *     "cv": {
     *       "id-of-cv": {
     *         "_id": "id-of-cv"
     *         ...
     *       }
     *     },
     *     "skill": {
     *       "id-of-skill": {
     *         "_id": "id-of-skill"
     *         "cvId": "id-of-cv"
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
            .flatMap {
                if (it.hasInstances("characteristics")) {
                    Single.just(it)
                } else {
                    createAndAddCharacteristics(accountId, it)
                }
            }

    private fun createAndAddCharacteristics(accountId: String, cvData: JsonObject): Single<JsonObject> {
        val id = UUID.randomUUID().toString()
        val characteristicsInstances = JsonObject().put(id, composeCharacteristicsInstance(id, accountId))
        val characteristicsEntity = JsonObject().put("characteristics", characteristicsInstances)
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, characteristicsEntity, deliveryOptions)
            .map { cvData.put("characteristics", characteristicsInstances) }
    }
}