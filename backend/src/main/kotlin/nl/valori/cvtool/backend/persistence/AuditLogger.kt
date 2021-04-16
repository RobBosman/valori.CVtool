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
    private const val ENABLED = true // TODO: enable audit logging

    /**
     * Log an audit record if the user is about to change something in the database.
     */
    internal fun auditLog(
        vertx: Vertx,
        messageAddress: String,
        messageBody: Any?,
        authInfo: AuthInfo
    ): Single<AuthInfo> {
        // Check if this message intends to change any data.
        if (ENABLED && messageAddress == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
            return vertx.eventBus()
                .rxRequest<JsonObject>(
                    MONGODB_SAVE_ADDRESS,
                    composeAuditLog(messageBody, authInfo.accountId),
                    deliveryOptions
                )
                .map { authInfo }
        }
        return Single.just(authInfo)
    }

    private fun composeAuditLog(messageBody: JsonObject, accountId: String): JsonObject {
        val auditLog = JsonObject()
        messageBody.map.entries
            .forEach { (entityName, instances) ->
                toJsonObject(instances) // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                    ?.map?.values
                    ?.mapNotNull { toJsonObject(it) } // Convert to JsonObject or skip if that's not possible.
                    ?.forEach { instance ->
                        val auditInstance = composeAuditInstance(accountId, entityName, instance)
                        auditLog.put(auditInstance.getString("_id"), auditInstance)
                    }
            }
        return JsonObject().put("audit_log", auditLog)
    }

    private fun composeAuditInstance(accountId: String, entityName: String, instance: JsonObject): JsonObject {
        val auditId = UUID.randomUUID().toString()
        val instanceId = instance.getString("_id", "")
        val cvId = if (entityName == "cv")  instanceId else instance.getString("cvId", "")
        // TODO: 06-03-2021 determine upsert/delete
        return JsonObject(
            """{
                "_id": "$auditId",
                "accountId": "$accountId",
                "timestamp": "${LocalDateTime.now()}",
                "entity": "$entityName",
                "entityId": "$instanceId",
                "cvId": "$cvId",
                "action": "upsert/delete"
            }"""
        )
    }
}