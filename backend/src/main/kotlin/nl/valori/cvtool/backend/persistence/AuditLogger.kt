package nl.valori.cvtool.backend.persistence

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.Vertx
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
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
    ): Single<Unit> {
        // Check if this message intends to change any data.
        if (messageAddress == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
            return vertx.eventBus()
                .rxRequest<JsonObject>(
                    MONGODB_SAVE_ADDRESS,
                    composeAuditLog(messageBody, oldData, authInfo.accountId),
                    deliveryOptions
                )
                .map { }
        }
        return Single.just(Unit)
    }

    private fun composeAuditLog(messageBody: JsonObject, oldData: JsonObject, accountId: String): JsonObject {
        val auditLog = JsonObject()
        messageBody.map.entries
            .forEach { (entityName, newInstances) ->
                toJsonObject(newInstances) // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                    ?.map?.entries
                    ?.map { (instanceId, newInstance) -> instanceId to toJsonObject(newInstance) }
                    ?.forEach { (instanceId, newInstance) ->
                        if (newInstance != null) {
                            val oldInstanceNullable = oldData.getJsonObject(entityName).getJsonObject(instanceId)
                            val newInstanceNullable = if (newInstance.isEmpty) null else newInstance
                            // Skip audit logging if both old and new instance are equal, e.g. when you create
                            // an instance and immediately delete it, or when changing an instance and immediately
                            // undo your changes.
                            if (newInstanceNullable != oldInstanceNullable) {
                                val auditInstance = composeAuditInstance(
                                    accountId,
                                    entityName,
                                    instanceId,
                                    oldInstanceNullable,
                                    newInstanceNullable
                                )
                                auditLog.put(auditInstance.getString("_id"), auditInstance)
                            }
                        }
                    }
            }
        return JsonObject().put("audit_log", auditLog)
    }

    private fun composeAuditInstance(
        accountId: String,
        entityName: String,
        instanceId: String,
        oldInstance: JsonObject?,
        newInstance: JsonObject?
    ) = JsonObject()
        .put("_id", UUID.randomUUID().toString())
        .put("accountId", accountId)
        .put("timestamp", LocalDateTime.now().toString())
        .put("entity", entityName)
        .put("instanceId", instanceId)
        .put("oldInstance", oldInstance)
        .put("newInstance", newInstance)
        .put("action", if (oldInstance == null) "insert" else if (newInstance == null) "delete" else "update")
        .put(
            "cvId",
            if (entityName == "cv") instanceId
            else (oldInstance ?: newInstance ?: JsonObject()).getString("cvId", "")
        )
}