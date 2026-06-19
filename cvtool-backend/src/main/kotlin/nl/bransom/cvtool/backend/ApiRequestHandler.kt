package nl.bransom.cvtool.backend

import io.netty.handler.codec.http.HttpHeaderNames
import io.netty.handler.codec.http.HttpHeaderValues
import io.reactivex.Single
import io.vertx.core.Handler
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.core.http.HttpServerRequest
import io.vertx.reactivex.ext.web.RoutingContext
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.api.API_MATCHFLOW_ADDRESS
import nl.bransom.cvtool.backend.api.API_MATCHFLOW_URL
import nl.bransom.cvtool.backend.authorization.AUTHENTICATE_ADDRESS
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo
import nl.bransom.cvtool.backend.authorization.AuthenticateVerticle.Companion.getUsername
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import java.net.HttpURLConnection

internal object ApiRequestHandler {

    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    fun getHandler(vertx: Vertx): Handler<RoutingContext> =
        Handler<RoutingContext> { routingContext ->
            val eventAddress = when (routingContext.normalizedPath()) {
                API_MATCHFLOW_URL -> API_MATCHFLOW_ADDRESS
                else -> {
                    routingContext.response()
                        .setStatusCode(HttpURLConnection.HTTP_NOT_FOUND)
                        .end()
                    return@Handler
                }
            }

            authenticate(vertx, routingContext.request())
                .flatMap { authorize(vertx, it.toAuthInfo()) }
                .flatMap { fetchedEntities ->
                    val accountId = fetchedEntities.getInstances("account")
                        .first()
                        .getString("_id")
                    vertx
                        .eventBus()
                        .rxRequest<JsonObject>(
                            eventAddress,
                            JsonObject().put("accountId", accountId),
                            deliveryOptions
                        )
                        .map { it.body() }
                }
                .subscribe(
                    { response ->
                        routingContext.response()
                            .putHeader(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON)
                            .setStatusCode(HttpURLConnection.HTTP_OK)
                            .end(response.encode())
                    },
                    { routingContext.fail(it) }
                )
        }

    /**
     * When successfully authenticated, an 'authInfo' message header is added containing the user's AuthInfo data.
     */
    private fun authenticate(
        vertx: Vertx,
        request: HttpServerRequest
    ): Single<JsonObject> =
        Single
            .just(request)
            .map {
                it.getHeader(HttpHeaderNames.AUTHORIZATION)?.substringAfter("Bearer ")
                    ?: error("Missing ${HttpHeaderNames.AUTHORIZATION} header.")
            }
            .flatMap { jwt ->
                vertx
                    .eventBus()
                    .rxRequest<JsonObject>(AUTHENTICATE_ADDRESS, JsonObject().put("jwt", jwt), deliveryOptions)
            }
            .map { it.body() }

    // Return a single account object.
    private fun authorize(
        vertx: Vertx,
        authInfo: AuthInfo
    ): Single<JsonObject> =
        Single
            .just(authInfo)
            .flatMap {
                val username = it.email.getUsername()
                vertx
                    .eventBus()
                    .rxRequest<JsonObject>(
                        MONGODB_FETCH_ADDRESS,
                        JsonObject(
                            """{
                                "account": [{ "username": "$username" }]
                            }"""
                        ),
                        deliveryOptions
                    )
            }
            .map { it.body() }
}
