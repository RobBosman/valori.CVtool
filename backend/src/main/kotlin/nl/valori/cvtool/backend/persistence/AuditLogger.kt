package nl.valori.cvtool.backend.persistence

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.Vertx
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.cv.ACCOUNT_DELETE_ADDRESS
import java.time.LocalDateTime
import java.util.*

internal object AuditLogger {

    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    /**
     * Log an audit record if the user is about to change something in the database.
     */
    internal fun auditLog(
        vertx: Vertx,
        messageAddress: String,
        messageBody: Any?,
        authInfo: AuthInfo,
        oldData: JsonObject
    ) =
        // Check if this message intends to change any data.
        if (messageBody is JsonObject && (messageAddress == MONGODB_SAVE_ADDRESS || messageAddress == ACCOUNT_DELETE_ADDRESS))
            vertx.eventBus()
                .rxRequest<JsonObject>(
                    MONGODB_SAVE_ADDRESS,
                    composeAuditLog(messageBody, oldData, authInfo.accountId),
                    deliveryOptions
                )
                .map { }
        else
            Single.just(Unit)

    private fun composeAuditLog(messageBody: JsonObject, oldData: JsonObject, accountId: String): JsonObject {
        val auditLog = JsonObject()
        messageBody.map.entries
            .forEach { (entityName, newInstances) ->
                toJsonObject(newInstances) // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                    ?.map?.entries
                    ?.map { (instanceId, newInstance) -> instanceId to toJsonObject(newInstance) }
                    ?.forEach { (instanceId, newInstance) ->
                        if (newInstance != null) {
                            val oldInstanceOrNull = oldData.getJsonObject(entityName).getJsonObject(instanceId)
                            val newInstanceOrNull = if (newInstance.isEmpty) null else newInstance
                            // Skip audit logging if both old and new instance are equal, e.g. when you create
                            // an instance and immediately delete it, or when changing an instance and immediately
                            // undo your changes.
                            if (newInstanceOrNull != oldInstanceOrNull) {
                                val id = UUID.randomUUID().toString()
                                val auditInstance = composeAuditInstance(
                                    id,
                                    accountId,
                                    entityName,
                                    oldInstanceOrNull,
                                    newInstanceOrNull
                                )
                                auditLog.put(id, auditInstance)
                            }
                        }
                    }
            }
        return JsonObject().put("audit_log", auditLog)
    }

    private fun composeAuditInstance(
        id: String,
        accountId: String,
        entityName: String,
        oldInstance: JsonObject?,
        newInstance: JsonObject?
    ) = JsonObject()
        .put("_id", id)
        .put("accountId", accountId)
        .put("timestamp", LocalDateTime.now().toString())
        .put("entity", entityName)
        .put("oldInstance", oldInstance)
        .put("newInstance", newInstance)
}