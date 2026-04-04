package nl.bransom.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.ModelUtils.toJsonObject
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo
import nl.bransom.cvtool.backend.authorization.AuthorizationLevel.ADMIN
import nl.bransom.cvtool.backend.authorization.AuthorizationLevel.UNIT_LEAD
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
     *       "$accountId": {
     *           "businessUnit": "name",
     *           "accountName": "name",
     *           "latestTimestamp": "timestamp"
     *       }
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message)
            .map { JsonObject(it.headers()["authInfo"] ?: "{}").toAuthInfo() }
            .flatMap(::fetchRequiredEntities)
            .flatMap(::withLatestAuditLogs)
            .map { (allEntities, auditLogs) -> merge(allEntities, auditLogs) }
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

    private fun fetchRequiredEntities(authInfo: AuthInfo): Single<JsonObject> {
        val businessUnitCriteria = when {
            authInfo.isAuthorized(ADMIN) -> "{}"
            authInfo.isAuthorized(UNIT_LEAD) -> """{ "accountIds": "${authInfo.accountId}" }"""
            else -> return Single.just(JsonObject())
        }
        return vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    """{
                        "account": [{}],
                        "businessUnit": [$businessUnitCriteria]
                    }"""
                ),
                deliveryOptions
            )
            .map { it.body() }
    }

    private fun withLatestAuditLogs(allEntities: JsonObject): Single<Pair<JsonObject, JsonObject>> =
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
            .map { allEntities to it.body() }

    private fun merge(allEntities: JsonObject, auditTimestamps: JsonObject): JsonObject {
        return allEntities.getInstances("businessUnit")
            .flatMap { businessUnit ->
                val accountIds = businessUnit.getJsonArray("accountIds")
                val accounts = allEntities.getInstances("account")
                    .filter { it.getString("_id") in accountIds }
                accounts
                    .map { account ->
                        val accountId = account.getString("_id")
                        val latestTimestamp = toJsonObject(auditTimestamps.map[accountId])
                            ?.getString("latestTimestamp")
                        JsonObject(
                            """{
                                "$accountId": {
                                    "businessUnit": "${businessUnit.getString("name")}",
                                    "accountName": "${account.getString("name")}",
                                    "latestTimestamp": "$latestTimestamp"
                                }
                            }"""
                        )
                    }
            }
            .reduce { a, b -> a.mergeIn(b) }
    }
}