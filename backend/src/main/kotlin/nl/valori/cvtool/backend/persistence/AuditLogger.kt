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
        originalData: JsonObject
    ): Single<Unit> {
        // Check if this message intends to change any data.
        if (messageAddress == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
            return vertx.eventBus()
                .rxRequest<JsonObject>(
                    MONGODB_SAVE_ADDRESS,
                    composeAuditLog(messageBody, originalData, authInfo.accountId),
                    deliveryOptions
                )
                .map { }
        }
        return Single.just(Unit)
    }

    private fun composeAuditLog(messageBody: JsonObject, originalData: JsonObject, accountId: String): JsonObject {
        val auditLog = JsonObject()
        messageBody.map.entries
            .forEach { (entityName, newInstances) ->
                toJsonObject(newInstances) // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                    ?.map?.entries
                    ?.map { (instanceId, newInstance) -> instanceId to toJsonObject(newInstance) }
                    ?.forEach { (instanceId, newInstance) ->
                        if (newInstance != null) {
                            val orgInstance = originalData.getJsonObject(entityName).getJsonObject(instanceId)
                            val auditInstance = composeAuditInstance(accountId, entityName, instanceId, orgInstance, newInstance)
                            auditLog.put(auditInstance.getString("_id"), auditInstance)
                        }
                    }
            }
        return JsonObject().put("audit_log", auditLog)
    }

    private fun composeAuditInstance(
        accountId: String,
        entityName: String,
        instanceId: String,
        orgInstance: JsonObject,
        newInstance: JsonObject
    ): JsonObject {
        val auditId = UUID.randomUUID().toString()
        val cvId = if (entityName == "cv") instanceId else orgInstance.getString("cvId", "")
        val action = if (newInstance.isEmpty) "delete" else "upsert"
        return JsonObject()
            .put("_id", auditId)
            .put("accountId", accountId)
            .put("timestamp", LocalDateTime.now().toString())
            .put("entity", entityName)
            .put("instanceId", instanceId)
            .put("orgInstance", orgInstance)
            .put("cvId", cvId)
            .put("action", action)
    }
}