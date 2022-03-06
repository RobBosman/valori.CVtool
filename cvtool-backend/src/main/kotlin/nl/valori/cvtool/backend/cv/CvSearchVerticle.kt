package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

const val CV_SEARCH_ADDRESS = "cv.search"
const val DOLLAR = "$"

internal class CvSearchVerticle : BasicVerticle(CV_SEARCH_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "searchText": "abc"
     *   }
     *
     * Response:
     *   {
     *     "experience": {
     *       "id-of-experience": {
     *         "_id": "id-of-experience"
     *         "accountId": "id-of-account"
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
            .map { it.getString("searchText", "") }
            .flatMap { searchText -> searchCvData(searchText) }
            .subscribe(
                {
                    log.debug("Successfully searched cv data")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error searching cv data: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun searchCvData(searchText: String): Single<JsonObject> {
        val keywords = searchText
            .replace("\\\"", "") // Remove (escaped) double quotes.
            .split("\\s+".toRegex())
            .filter { it.length >= 2 }
            .joinToString(" ") { "\\\"$it\\\"" } // Add double quotes around keywords to handle 'C#' correctly.
        val searchCriteria = JsonObject("""
            {
                "experience": [ {"${DOLLAR}text": {"${DOLLAR}search": "$keywords"} } ],
                "skill": [ {"${DOLLAR}text": {"${DOLLAR}search": "$keywords"} } ]
            }
        """)
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, searchCriteria, deliveryOptions)
            .map { it.body() }
    }
}