package nl.bransom.cvtool.backend.api

import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

const val API_MATCHFLOW_URL = "/api/matchflow"
const val API_MATCHFLOW_ADDRESS = "api.matchflow"

internal class ApiMatchflowVerticle : BasicVerticle(API_MATCHFLOW_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "accountId": "id-of-account-of-api-request"
     *   }
     *
     * Response:
     *   {
     *     ...
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    $$"""{
                        "education": [{ "result": "DIPLOMA" }],
                        "training": [{ "result": "DIPLOMA" }],
                        "skill": [
                            { "$or": [
                                { "category": "BRANCHES" },
                                { "category": "EXPERTISE" },
                                { "category": "LANGUAGES" },
                                { "category": "TOOLS" }
                            ] }
                        ]
                    }"""
                ),
// LANGUAGES
// BRANCHES
// DATABASES
// EXPERTISE
// PROGRAMMING
// TOOLS
// APPLICATIONS
// METHODS
// OS_NETWORKS
                deliveryOptions
            )
            .map { it.body() }
            .subscribe(
                {
                    log.debug("Successfully fetched API response")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching API response: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )
    }
}