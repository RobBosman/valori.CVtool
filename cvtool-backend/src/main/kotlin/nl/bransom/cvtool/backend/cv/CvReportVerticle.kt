package nl.bransom.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.DebouncingVerticle
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.ModelUtils.toJsonObject
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo
import nl.bransom.cvtool.backend.authorization.AuthorizationLevel.ADMIN
import nl.bransom.cvtool.backend.authorization.AuthorizationLevel.UNIT_LEAD
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.bransom.cvtool.backend.persistence.MONGODB_QUERY_ADDRESS
import java.time.LocalDate

const val CV_REPORT_ADDRESS = "cv.report"

internal class CvReportVerticle : DebouncingVerticle(CV_REPORT_ADDRESS) {

    companion object {
        private const val CSV_FIELD_SEPARATOR = ";"
        private const val CSV_ROW_SEPARATOR = "\n"
        private val CSV_HEADER = listOf("label", "unit", "account naam", "laatst gewijzigd")
            .joinToString(CSV_FIELD_SEPARATOR)
        private const val GT_ONE_YEAR = "> 1 jaar geleden"
        private const val UTF8_BOM = "\uFEFF"
    }

    override fun getMessageFingerprint(message: Message<JsonObject>): String? =
        message.headers()["authInfo"]
            ?.let { authInfo: String -> JsonObject(authInfo).getString("accountId") }

    /**
     * Expected message body:
     *   {}
     *
     * Response:
     *   {
     *       "filename": "report.csv",
     *       "csvReport": "\"label\";"\"unit\";\"account naam\";\"laatst gewijzigd\"
     *              \"label.name\";\"unit.name\";\"account.name\";\"last-changed-date\"
     *              ...
     *              ...",
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
                    log.debug("Successfully fetched cv report")
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
                        "brand": [{}],
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
                                    "_id": { "$ifNull": [ "$cvAccountId", "$instanceId" ] },
                                    "latestTimestamp": { "$last": "$timestamp" }
                                }
                            }
                        ],
                        "cursor": { "batchSize": $${allEntities.getInstances("accounts").size} }
                    }"""
                ),
                deliveryOptions
            )
            .map { allEntities to it.body() }

    private fun merge(allEntities: JsonObject, auditTimestamps: JsonObject): JsonObject =
        allEntities.getInstances("brand")
            .sortedBy { it.getString("name") }
            .flatMap { brand ->
                val brandId = brand.getString("_id")
                val brandName = brand.getString("name")
                allEntities
                    .getInstances("businessUnit")
                    .filter { it.getString("brandId") == brandId }
                    .sortedBy { it.getString("name") }
                    .flatMap { businessUnit ->
                        val businessUnitName = businessUnit.getString("name")
                        val accountIds = businessUnit.getJsonArray("accountIds")
                        allEntities
                            .getInstances("account")
                            .filter { it.getString("_id") in accountIds }
                            .sortedBy { it.getString("name") }
                            .map { account ->
                                val accountId = account.getString("_id")
                                val accountName = account.getString("name")
                                val lastChanged = toJsonObject(auditTimestamps.map[accountId])
                                    ?.getString("latestTimestamp")
                                    ?.substringBefore("T")
                                    ?: GT_ONE_YEAR
                                listOf(brandName, businessUnitName, accountName, lastChanged)
                                    .map { it.replace("\"", "\"\"") }
                                    .joinToString(CSV_FIELD_SEPARATOR) { "\"$it\"" }
                            }
                    }
            }
            .joinToString(CSV_ROW_SEPARATOR)
            .let {
                JsonObject()
                    .put("fileName", "cv_status_rapport_${LocalDate.now()}.csv")
                    .put("csvReport", "$UTF8_BOM$CSV_HEADER$CSV_ROW_SEPARATOR$it")
            }
}