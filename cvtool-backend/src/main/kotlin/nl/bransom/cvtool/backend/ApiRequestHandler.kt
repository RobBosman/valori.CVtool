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
import nl.bransom.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.bransom.cvtool.backend.authorization.AuthInfo.Companion.toAuthInfo
import nl.bransom.cvtool.backend.authorization.AuthorizationLevel.ADMIN
import org.slf4j.LoggerFactory.getLogger
import java.net.HttpURLConnection.HTTP_NOT_FOUND
import java.net.HttpURLConnection.HTTP_OK
import kotlin.io.encoding.Base64
import kotlin.io.encoding.Base64.PaddingOption.ABSENT_OPTIONAL
import kotlin.text.Charsets.UTF_8

internal object ApiRequestHandler {

    private val log = getLogger(ApiRequestHandler::class.java)
    private const val ROLES_CLAIM = "roles"
    private const val ROLE_API_ACCESS = "Api.Access"
    private const val ROLE_BULK_READ_SKILLS = "ROLE_BULK_READ_SKILLS"

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
                .flatMap { authorize(vertx, it) }
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
                // Log the JWT payload.
                val jwtPayload = jwt.split(".")[1]
                    .let(Base64.withPadding(ABSENT_OPTIONAL)::decode)
                    .let { it.toString(UTF_8) }
                log.info("API-JWT: $jwtPayload")

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
        vertx: Vertx,
        jwtPayload: JsonObject
    ): Single<Unit> =
        (jwtPayload.getJsonArray(ROLES_CLAIM)
            ?.let { Single.just(it) }
            ?: allowApiAccessForAdminUser(vertx, jwtPayload))

            .map { roles ->
                require(ROLE_API_ACCESS in roles) {
                    "JWT does not contain role '$ROLE_API_ACCESS'."
                }
                require(ROLE_BULK_READ_SKILLS in roles) {
                    "JWT does not contain role '$ROLE_BULK_READ_SKILLS'."
                }
            }

    /**
     * Allow admin users to use their JWT to invoke the API.
     */
    private fun allowApiAccessForAdminUser(vertx: Vertx, jwtPayload: JsonObject): Single<JsonArray> =
        Single
            .just(jwtPayload)
            .map {
                JsonObject()
                    .put("email", it.getString("preferred_username", ""))
                    .put("name", it.getString("name", ""))
            }
            .flatMap { authInfoJson ->
                vertx
                    .eventBus()
                    .rxRequest<JsonObject>(AUTH_INFO_FETCH_ADDRESS, authInfoJson, deliveryOptions)
            }
            .map { it.body().toAuthInfo() }
            .map { authInfo ->
                if (authInfo.isAuthorized(ADMIN)) {
                    log.warn("Bypassing API authorization for ADMIN user ${authInfo.email}.")
                    JsonArray("""[ "$ROLE_API_ACCESS", "$ROLE_BULK_READ_SKILLS" ]""")
                } else {
                    error("JWT does not contain '$ROLES_CLAIM' claim.")
                }
            }
}
