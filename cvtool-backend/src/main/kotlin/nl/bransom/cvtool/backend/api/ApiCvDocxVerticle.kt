package nl.bransom.cvtool.backend.api

import io.reactivex.Flowable
import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.cv.CV_GENERATE_ADDRESS
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import java.util.Base64

const val API_CV_DOCX_ADDRESS = "api.cvDocx"

internal class ApiCvDocxVerticle : BasicVerticle(API_CV_DOCX_ADDRESS) {

    /**
     * Request:
     *
     *    {
     *      "emails": [
     *        "john.doe@cerios.nl",
     *        "jane.smith@cerios.nl"
     *      ]
     *    }
     *
     * Response:
     *
     *    {
     *      "data": [
     *        {
     *          "name": "John Doe",
     *          "email": "john.doe@cerios.nl",
     *          "docxB64": "Tm9uZSBvZiB...0aGUgYWJvdmU="
     *        },
     *        {
     *          "name": "Jane Smith",
     *          "email": "jane.smith@cerios.nl",
     *          "docxB64": "Tm9uZSBvZiB...0aGUgYWJvdmU="
     *        }
     *      ]
     *    }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single.just(message)
            .map { it.body().getJsonArray("emails") }
            .flatMap { emails ->
                vertx.eventBus()
                    .rxRequest<JsonObject>(
                        MONGODB_FETCH_ADDRESS,
                        JsonObject($$"""{ "account": [{ "email": { "$in": $${emails.encode()} } }] }"""),
                        DELIVERY_OPTIONS
                    )
            }
            .map { it.body() }
            .flatMap(::toApiResponse)
            .subscribe(
                {
                    log.debug("Successfully fetched 'cv docx' API response")
                    message.reply(it)
                },
                {
                    log.warn("Error fetching 'cv docx' API response: ${it.message}")
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )
    }

    private fun toApiResponse(fetchedEntities: JsonObject) =
        Flowable
            .fromIterable(fetchedEntities.getInstances("account"))
            .flatMap { account ->
                generateCv(account, "nl_NL")
                    .map { cvJson ->
                        JsonObject()
                            .put("email", account.getString("email"))
                            .put("fileName", cvJson.getString("fileName"))
                            .put("docxB64", cvJson.getString("docxB64"))
                    }
                    .toFlowable()
            }
            .collectInto(JsonArray()) { jsonArray, cvJson -> jsonArray.add(cvJson) }
            .map { JsonObject().put("data", it) }

    private fun generateCv(account: JsonObject, locale: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                CV_GENERATE_ADDRESS,
                JsonObject("""{ "accountId": "${account.getString("_id")}", "locale": "$locale" }"""),
                DELIVERY_OPTIONS_4
            )
            .map { it.body() }
            .onErrorReturn { createErrorCv(account.getString("_id"), locale, it) }

    private fun createErrorCv(accountId: String, locale: String, t: Throwable) =
        JsonObject()
            .put("fileName", "ERROR-CV_${locale.substring(3)}_$accountId.txt")
            .put("docxB64", String(Base64.getEncoder().encode("Error generating $locale cv:\n$t".encodeToByteArray())))
}