package nl.bransom.cvtool.backend.system

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.bransom.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

const val DATA_RETENTION_ADDRESS = "data.retention"

class DataRetentionVerticle : BasicVerticle(DATA_RETENTION_ADDRESS) {

    companion object {
        private val EMPTY_JSON = JsonObject()
    }

    override fun handleRequest(message: Message<JsonObject>) {
        val retentionDate = message.body().getString("retentionDate")
        fetchToBeDeletedAuditLogs(retentionDate)
            .deleteAuditLogs()
            .subscribe(
                { numDeletedAuditLogs ->
                    val msg = when (numDeletedAuditLogs) {
                        0 -> "No audit_logs were deleted due to data retention ($retentionDate)."
                            .also(log::debug)

                        else -> "Successfully deleted $numDeletedAuditLogs audit_logs due to data retention ($retentionDate)."
                            .also(log::info)
                    }
                    message.reply(JsonObject().put("result", msg))
                },
                {
                    val errorMsg = "Error applying data retention: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchToBeDeletedAuditLogs(retentionDate: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject($$"""{ "audit_log": [ { "timestamp": { "$lt": "$$retentionDate" } } ] }"""),
                DeliveryOptions().setSendTimeout(5_000)
            )

    private fun Single<Message<JsonObject>>.deleteAuditLogs() =
        map { it.body().getJsonObject("audit_log").map.keys }
            .map { ids -> JsonObject().apply { ids.forEach { id -> put(id, EMPTY_JSON) } } }
            .flatMap { idsJson ->
                vertx.eventBus()
                    .rxRequest<JsonObject>(
                        MONGODB_SAVE_ADDRESS,
                        JsonObject().put("audit_log", idsJson),
                        DeliveryOptions().setSendTimeout(5_000)
                    )
                    .map { idsJson.map.size }
            }
}