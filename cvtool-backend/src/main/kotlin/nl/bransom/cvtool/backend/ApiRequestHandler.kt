package nl.bransom.cvtool.backend

import io.netty.handler.codec.http.HttpHeaderNames.AUTHORIZATION
import io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE
import io.netty.handler.codec.http.HttpHeaderValues.APPLICATION_JSON
import io.reactivex.Single
import io.vertx.core.Handler
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.core.http.HttpServerRequest
import io.vertx.reactivex.ext.web.RoutingContext
import nl.bransom.cvtool.backend.api.API_MATCHFLOW_ADDRESS
import nl.bransom.cvtool.backend.api.API_MATCHFLOW_URL
import nl.bransom.cvtool.backend.authorization.AUTHENTICATE_API_ADDRESS
import org.slf4j.LoggerFactory.getLogger
import java.net.HttpURLConnection.HTTP_NOT_FOUND
import java.net.HttpURLConnection.HTTP_OK

internal object ApiRequestHandler {

    private val log = getLogger(ApiRequestHandler::class.java)
    private const val ROLES_CLAIM = "roles"
    private const val ROLE_API_ACCESS = "Api.Access"
    private const val ROLE_BULK_READ_SKILLS = "ROLE_BULK_READ_SKILLS"

    private val API_TESTER_EMAILS = setOf("rob.bosman@cerios.nl", "john.van.arkelen@cerios.nl")

    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    fun getHandler(vertx: Vertx): Handler<RoutingContext> =
        Handler<RoutingContext> { routingContext ->

            val targetEventAddress = when (routingContext.normalizedPath()) {
                API_MATCHFLOW_URL -> API_MATCHFLOW_ADDRESS
                else -> {
                    routingContext.response()
                        .setStatusCode(HTTP_NOT_FOUND)
                        .end()
                    return@Handler
                }
            }

            authenticate(vertx, routingContext.request())
                .map { authorize(it) }
                .flatMap {
                    vertx
                        .eventBus()
                        .rxRequest<JsonObject>(targetEventAddress, JsonObject(), deliveryOptions)
                        .map { it.body() }
                }
                .subscribe(
                    { response ->
                        routingContext.response()
                            .putHeader(CONTENT_TYPE, APPLICATION_JSON)
                            .setStatusCode(HTTP_OK)
                            .end(response.encode())
                    },
                    { routingContext.fail(it) }
                )
        }

    /**
     * Return the 'roles' claim of the JWT upon successful authentication:
     *
     *    {
     *      "roles": [
     *        "Api.Access",
     *        "ROLE_BULK_READ_SKILLS"
     *      ]
     *    }
     */
    private fun authenticate(
        vertx: Vertx,
        request: HttpServerRequest
    ): Single<JsonObject> =
        Single
            .just(request)
            .map {
                it.getHeader(AUTHORIZATION)?.substringAfter("Bearer ")
                    ?: error("Missing AUTHORIZATION header.")
            }
            .flatMap { jwt ->
                vertx
                    .eventBus()
                    // Verify the JWT and obtain its payload.
                    .rxRequest<JsonObject>(AUTHENTICATE_API_ADDRESS, JsonObject().put("jwt", jwt), deliveryOptions)
            }
            .map { it.body() }

    /**
     * Verify if the JWT has a 'roles' claim with "Api.Access" and "ROLE_BULK_READ_SKILLS".
     */
    private fun authorize(
        jwtPayload: JsonObject
    ) {
        log.info("API-JWT: ${jwtPayload.encode()}")
        val roles = jwtPayload.getJsonArray(ROLES_CLAIM)
            ?: bypassApiAccessForUser(jwtPayload.getString("preferred_username"))
            ?: error("JWT does not contain '$ROLES_CLAIM' claim.")
        require(ROLE_API_ACCESS in roles) {
            "JWT does not contain role '$ROLE_API_ACCESS'."
        }
        require(ROLE_BULK_READ_SKILLS in roles) {
            "JWT does not contain role '$ROLE_BULK_READ_SKILLS'."
        }
    }

    // TODO: remove this code; it's FOR TEST PURPOSES ONLY
    private fun bypassApiAccessForUser(userName: String?) =
        if (userName in API_TESTER_EMAILS) {
            log.warn("Bypassing API authorization for $userName")
            JsonArray("""[ "$ROLE_API_ACCESS", "$ROLE_BULK_READ_SKILLS" ]""")
        } else {
            null
        }
}
