package nl.valori.cvtool.backend

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.ext.bridge.BridgeEventType.PUBLISH
import io.vertx.ext.bridge.BridgeEventType.SEND
import io.vertx.ext.bridge.BridgeEventType.SOCKET_ERROR
import io.vertx.ext.bridge.BridgeEventType.SOCKET_IDLE
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.backend.MessageUtils.getMessageHeader
import nl.valori.cvtool.backend.MessageUtils.setMessageHeader
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.authorization.AUTHENTICATE_ADDRESS
import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo
import nl.valori.cvtool.backend.authorization.Authorizer
import nl.valori.cvtool.backend.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.backend.cv.CV_GENERATE_ADDRESS
import nl.valori.cvtool.backend.cv.CV_HISTORY_ADDRESS
import nl.valori.cvtool.backend.cv.CV_SEARCH_ADDRESS
import nl.valori.cvtool.backend.persistence.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.backend.persistence.AuditLogger
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory

internal object EventBusMessageHandler {

    private val log = LoggerFactory.getLogger(EventBusMessageHandler::class.java)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    internal fun create(vertx: Vertx) =
        SockJSHandler.create(vertx)
            .bridge(createBridgeOptions()) { bridgeEventHandler(vertx, it) }
            .errorHandler(500) { log.info("errorHandler -- $it") }

    private fun createBridgeOptions() =
        SockJSBridgeOptions()
            .setPingTimeout(10_000) // 10 seconds
            .addInboundPermitted(PermittedOptions().setAddress(AUTH_INFO_FETCH_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(CV_FETCH_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(CV_GENERATE_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(CV_HISTORY_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(CV_SEARCH_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(ACCOUNT_DELETE_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(MONGODB_FETCH_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(MONGODB_SAVE_ADDRESS))

    private fun bridgeEventHandler(vertx: Vertx, bridgeEvent: BridgeEvent) {
        when (bridgeEvent.type()) {
            SEND, PUBLISH -> {
                Single
                    .just(bridgeEvent)
                    .flatMap { authenticate(vertx, it) }
                    .flatMap { fetchOldData(vertx, it) }
                    .flatMap { authorize(it) }
                    .flatMap { auditLog(vertx, it) }
                    .subscribe(
                        {
                            bridgeEvent.complete(true)
                        },
                        {
                            log.warn("Error handling BridgeEvent: ${it.message}")
                            bridgeEvent.complete(false)
                        }
                    )
            }
            SOCKET_IDLE -> {
                bridgeEvent.socket().close()
                bridgeEvent.complete(true)
            }
            SOCKET_ERROR -> {
                log.error("Socket error. Remote IP ${bridgeEvent.socket().headers()["X-Forwarded-For"]}")
                bridgeEvent.complete(false)
            }
            else -> bridgeEvent.complete(true)
        }
    }

    /**
     * When successfully authenticated, an 'authInfo' message header is added containing the user's AuthInfo data.
     */
    private fun authenticate(vertx: Vertx, bridgeEvent: BridgeEvent): Single<BridgeEvent> {
        val jwt = bridgeEvent
            .getMessageHeader("Authorization")
            .substringAfter("Bearer ")
        return vertx
            .eventBus()
            .rxRequest<JsonObject>(AUTHENTICATE_ADDRESS, JsonObject().put("jwt", jwt), deliveryOptions)
            .flatMap { authenticationResponse ->
                vertx
                    .eventBus()
                    .rxRequest<JsonObject>(AUTH_INFO_FETCH_ADDRESS, authenticationResponse.body(), deliveryOptions)
                    .map { authInfoResponse -> authInfoResponse.body() }
            }
            .map { bridgeEvent.setMessageHeader("authInfo", it.encode()) }
    }

    /**
     * Input:
     *   {
     *     "entity-A": {
     *       "id-of-instance-S-1": {
     *         "_id": "id-of-instance-A-1",
     *         "key": "new-value"
     *       },
     *       "id-of-instance-A-2": {}
     *     },
     *     "entity-B: {
     *       "id-of-instance-B-1": {
     *         "_id": "id-of-instance-B-1",
     *         "key": "new-value"
     *       }
     *     }
     *   }
     *
     * Response:
     *   {
     *     "entity-A": {
     *       "id-of-instance-A-1": {
     *         "_id": "id-of-instance-A-1",
     *         "key": "old-value"
     *       },
     *       "id-of-instance-A-2": {
     *         "_id": "id-of-instance-A-2",
     *         "key": "value"
     *       }
     *     },
     *     "entity-B: {
     *       "id-of-instance-B-1": {
     *         "_id": "id-of-instance-B-1",
     *         "key": "old-value"
     *       }
     *     }
     *   }
     */
    private fun fetchOldData(vertx: Vertx, bridgeEvent: BridgeEvent): Single<BridgeEvent> {
        val bodyJson = ModelUtils.toJsonObject(bridgeEvent.rawMessage.getValue("body"))
            ?: return Single.just(bridgeEvent.setMessageHeader("oldData", "{}"))

        val searchCriteria = JsonObject()
        bodyJson.map.keys
            .forEach { entityName ->
                val instanceIds = bodyJson.getInstanceIds(entityName)
                if (instanceIds.isNotEmpty()) {
                    // { "entity": [{ "_id": "id-1" }, { "_id": "id-2"}] } }
                    searchCriteria.put(entityName, JsonArray(instanceIds.map { JsonObject().put("_id", it) }))
                }
            }

        return if (searchCriteria.isEmpty)
            Single.just(bridgeEvent.setMessageHeader("oldData", "{}"))
        else
            vertx
                .eventBus()
                .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, searchCriteria, deliveryOptions)
                .map { bridgeEvent.setMessageHeader("oldData", it.body().encode()) }
    }

    private fun authorize(bridgeEvent: BridgeEvent): Single<BridgeEvent> =
        Single
            .just(bridgeEvent)
            .doOnSuccess {
                Authorizer.authorize(
                    it.rawMessage.getString("address"),
                    it.rawMessage.getValue("body"),
                    JsonObject(it.getMessageHeader("authInfo")).toAuthInfo(),
                    JsonObject(it.getMessageHeader("oldData"))
                )
            }
            .doOnError {
                log.warn("Authentication error: ${it.message}\n\t-- ${bridgeEvent.getMessageHeader("authInfo")}")
            }

    private fun auditLog(vertx: Vertx, bridgeEvent: BridgeEvent): Single<BridgeEvent> =
        AuditLogger
            .auditLog(
                vertx,
                bridgeEvent.rawMessage.getString("address"),
                bridgeEvent.rawMessage.getValue("body"),
                JsonObject(bridgeEvent.getMessageHeader("authInfo")).toAuthInfo(),
                JsonObject(bridgeEvent.getMessageHeader("oldData"))
            )
            .map { bridgeEvent }
}