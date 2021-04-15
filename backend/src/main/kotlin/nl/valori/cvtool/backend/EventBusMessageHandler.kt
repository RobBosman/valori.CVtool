package nl.valori.cvtool.backend

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.ext.bridge.BridgeEventType.PUBLISH
import io.vertx.ext.bridge.BridgeEventType.SEND
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.backend.MessageUtils.getMessageHeader
import nl.valori.cvtool.backend.MessageUtils.setMessageHeader
import nl.valori.cvtool.backend.authorization.AUTHENTICATE_ADDRESS
import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo
import nl.valori.cvtool.backend.authorization.Authorizer
import nl.valori.cvtool.backend.cv.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.backend.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.backend.cv.CV_GENERATE_ADDRESS
import nl.valori.cvtool.backend.cv.CV_SEARCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory

internal object EventBusMessageHandler {

    private val log = LoggerFactory.getLogger(EventBusMessageHandler::class.java)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    internal fun create(vertx: Vertx) =
        SockJSHandler.create(vertx).bridge(createBridgeOptions()) { bridgeEventHandler(vertx, it) }

    private fun createBridgeOptions() =
        SockJSBridgeOptions()
            .addInboundPermitted(PermittedOptions().setAddress(AUTH_INFO_FETCH_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(CV_FETCH_ADDRESS))
            .addInboundPermitted(PermittedOptions().setAddress(CV_GENERATE_ADDRESS))
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
                    .flatMap { authorize(vertx, it) }
                    .subscribe(
                        {
                            bridgeEvent.complete(true)
                        },
                        {
                            log.warn("Event bridge message was not authenticated: ${it.message}")
                            bridgeEvent.complete(false)
                        }
                    )
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

    private fun authorize(vertx: Vertx, bridgeEvent: BridgeEvent) =
        Authorizer
            .authorize(
                vertx,
                bridgeEvent.rawMessage.getString("address"),
                bridgeEvent.rawMessage.getValue("body"),
                JsonObject(bridgeEvent.getMessageHeader("authInfo")).toAuthInfo()
            )
            .map { bridgeEvent.setMessageHeader("authInfo", it.toJson().encode()) }
}