package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

const val CV_HISTORY_ADDRESS = "cv.history"

internal class CvHistoryVerticle : BasicVerticle(CV_HISTORY_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "cvId": "id-of-cv-to-fetch-history-for"
     *   }
     *
     * Response:
     *   {
     *     ...
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message.body())
            .map { it.getString("accountId", "") }
            .doOnSuccess { if (it === "") error("'accountId' is not specified.") }
            .flatMap { accountId ->
                fetchCvId(accountId)
                    .flatMap { cvId -> fetchAuditLogs(cvId) }
                    .flatMap { auditLogs -> addAccountNames(accountId, auditLogs) }
            }
            .subscribe(
                {
                    log.debug("Successfully fetched cv history")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching cv history: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchCvId(accountId: String): Single<String> {
        val searchCriteria = JsonObject(
            """{
                "cv": [ { "accountId": "$accountId" } ]
            }"""
        )
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, searchCriteria, deliveryOptions)
            .map { it.body().getInstanceIds("cv") }
            .map { cvIds ->
                cvIds.elementAtOrElse(0)
                { error("Found ${cvIds.size} cv records with accountId $accountId.") }
            }
    }

    private fun fetchAuditLogs(cvId: String): Single<JsonObject> {
        // {
        //     "audit_log": [
        //         { "cvId": $cvId }
        //     ]
        // }
        val searchCriteria = JsonObject()
            .put("audit_log", JsonArray().add(
                JsonObject().put("cvId", cvId)))
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, searchCriteria, deliveryOptions)
            .map { it.body() }
    }

    private fun addAccountNames(accountId: String, entities: JsonObject): Single<JsonObject> {
        val accountIds = entities.getInstances("audit_log")
            .map { auditLog -> auditLog.getString("accountId") }
            .filter { it != accountId }
        return if (accountIds.isEmpty())
            Single.just(entities)
        else fetchAccounts(accountIds)
            .map { accounts -> entities.put("account", accounts) }
    }

    private fun fetchAccounts(accountIds: List<String>): Single<JsonObject> {
        // {
        //     "account": [
        //         { "_id": { "$in": [ $accountIds ] } }
        //     ]
        // }
        val searchCriteria = JsonObject()
            .put("account", JsonArray().add(JsonObject()
                .put("_id", JsonObject().put("\$in", accountIds))))
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, searchCriteria, deliveryOptions)
            .map { it.body() }
    }
}