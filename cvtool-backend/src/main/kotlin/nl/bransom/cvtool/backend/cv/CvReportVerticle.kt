package nl.bransom.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.ModelUtils.toJsonObject
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.bransom.cvtool.backend.persistence.MONGODB_QUERY_ADDRESS

const val CV_REPORT_ADDRESS = "cv.report"

internal class CvReportVerticle : BasicVerticle(CV_REPORT_ADDRESS) {

    /**
     * Expected message body:
     *   {}
     *
     * Response:
     *   {
     *     ...
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message)
            .flatMap { fetchAllAccounts() }
            .flatMap { allAccounts -> mergeLatestAuditLogs(allAccounts) }
            .subscribe(
                {
                    log.info("Successfully fetched cv report")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching cv report: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchAllAccounts(): Single<JsonObject> =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject("""{ "account": [{}] }"""),
                deliveryOptions
            )
            .map { it.body().getJsonObject("account") }

    private fun mergeLatestAuditLogs(allAccounts: JsonObject): Single<JsonObject> =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_QUERY_ADDRESS,
                JsonObject(
                    $$"""{
                        "aggregate": "audit_log",
                        "pipeline": [
                            {
                                "$group": {
                                    "_id": { "$ifNull": [ "$cvAccountId", "$editorAccountId" ] },
                                    "latestTimestamp": { "$last": "$timestamp" }
                                }
                            }
                        ],
                        "cursor": { }
                    }"""
                ),
                deliveryOptions
            )
            .map { merge(allAccounts, it.body()) }

    private fun merge(allAccounts: JsonObject, auditTimestamps: JsonObject): JsonObject {
        return allAccounts
            .map { (id, account) ->
                JsonObject(
                    """{
                        "$id": {
                            "name": "${toJsonObject(account)?.getString("name")}",
                            "timestamp": "${toJsonObject(auditTimestamps.map[id])?.getString("latestTimestamp")}"
                        }
                    }"""
                )
            }
            .reduce { a, b -> a.mergeIn(b) }
    }
}