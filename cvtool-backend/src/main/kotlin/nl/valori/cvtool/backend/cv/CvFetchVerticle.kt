package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.addEntity
import nl.valori.cvtool.backend.ModelUtils.composeCvDataCriteria
import nl.valori.cvtool.backend.ModelUtils.composeCvInstance
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
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
            .flatMap { accountId -> fetchCvData(accountId) }
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

    private fun fetchCvData(accountId: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject("""{ "cv": [{ "accountId": "$accountId" }] }"""),
                deliveryOptions
            )
            .flatMap { obtainOrCreateCvId(it.body(), accountId) }
            .map { composeCvDataCriteria(accountId, it) }
            .flatMap { vertx.eventBus().rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, it, deliveryOptions) }
            .map { it.body() }

    private fun obtainOrCreateCvId(cvEntity: JsonObject, accountId: String): Single<String> {
        val cvIds = cvEntity.getInstanceIds("cv")
        return when (cvIds.size) {
            0 -> {
                val cvId = UUID.randomUUID().toString()
                val saveRequest = JsonObject().addEntity("cv", composeCvInstance(cvId, accountId))
                vertx.eventBus()
                    .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, saveRequest, deliveryOptions)
                    .map { cvId }
            }
            1 -> Single.just(cvIds.first())
            else -> error("Found ${cvIds.size} cv records with accountId $accountId.")
        }
    }
}