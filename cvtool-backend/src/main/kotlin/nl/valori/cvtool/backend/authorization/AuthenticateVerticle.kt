package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.reactivex.exceptions.CompositeException
import io.reactivex.schedulers.Schedulers
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.authentication.TokenCredentials
import io.vertx.ext.auth.authentication.UsernamePasswordCredentials
import io.vertx.ext.auth.oauth2.OAuth2Options
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import io.vertx.reactivex.ext.auth.oauth2.providers.OpenIDConnectAuth
import org.slf4j.LoggerFactory
import java.net.URL
import java.util.concurrent.TimeUnit.MILLISECONDS
import java.util.concurrent.atomic.AtomicLong
import java.util.function.BiConsumer

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTHENTICATE_HEALTH_ADDRESS = "authenticate.health"
const val AUTH_DOMAIN = "Valori.nl"

internal class AuthenticateVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)
    private val healthSpanMillis = 3 * 60 * 1000
    private val lastOpenIDConnectionAtMillis = AtomicLong(0L)

    override fun start(startPromise: Promise<Void>) {
        // Environment variable:
        //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val connectionString = config().getString("AUTH_CONNECTION_STRING")
        val openIdSite = connectionString.substringBefore("?")
        val clientIdAndSecret = URL(connectionString).query.split(":")

        // Connect to OpenID Provider.
        OpenIDConnectAuth
            .rxDiscover(
                vertx, OAuth2Options()
                    .setSite(openIdSite)
                    .setClientId(clientIdAndSecret[0])
                    .setClientSecret(clientIdAndSecret[1])
            )
            .observeOn(Schedulers.io())
            .doOnError { log.warn("Cannot start verticle: ${it.message}") }
            .retryWhen { it.delay(5_000, MILLISECONDS) }
            .subscribe(
                {
                    handleVertxEvents(AUTHENTICATE_ADDRESS, ::handleAuthenticationRequest, it)
                    handleVertxEvents(AUTHENTICATE_HEALTH_ADDRESS, ::handleHealthRequest, it)

                    startPromise.complete()
                    log.info("Successfully connected to OpenID Provider")
                },
                {
                    log.error("Vertx error", it)
                    startPromise.fail(it)
                }
            )
    }

    private fun handleVertxEvents(
        eventAddress: String,
        handler: BiConsumer<Message<JsonObject>, OAuth2Auth>,
        oauth2: OAuth2Auth
    ) =
        vertx.eventBus()
            .consumer<JsonObject>(eventAddress)
            .toFlowable()
            .subscribe(
                {
                    handler.accept(it, oauth2)
                },
                {
                    log.error("Vertx error processing authentication request.", it)
                }
            )

    /**
     * Expected message body:
     *   {
     *     "jwt": "###.######.####"
     *   }
     *
     * Response:
     *   {
     *     "email": "P.Puk@valori.nl",
     *     "name": "Pietje Puk",
     *   }
     *
     */
    private fun handleAuthenticationRequest(message: Message<JsonObject>, oauth2: OAuth2Auth) =
        Single
            .just(
                message.body().getString("jwt")
                    ?: error("Cannot obtain 'jwt' from message body.")
            )
            .flatMap { authenticateJwt(it, oauth2) }
            .subscribe(
                {
                    log.debug("Authenticated successfully.")
                    lastOpenIDConnectionAtMillis.set(System.currentTimeMillis())
                    message.reply(it)
                },
                {
                    val errorMsg = "Error authenticating: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )

    private fun authenticateJwt(jwt: String, oauth2: OAuth2Auth) =
        oauth2
            .rxAuthenticate(TokenCredentials(jwt))
            .map {
                val accessToken = it.attributes().getJsonObject("accessToken")
                val email = accessToken.getString("preferred_username", "")
                if (email.isBlank())
                    error("Cannot obtain email from JWT.")
                else if (!email.uppercase().endsWith("@${AUTH_DOMAIN.uppercase()}"))
                    error("Email '$email' is not supported. Please use a '@$AUTH_DOMAIN' account.")
                var name = accessToken.getString("name", "")
                if (name.isBlank())
                    name = email.substringBefore("@")
                JsonObject()
                    .put("email", email)
                    .put("name", name)
            }

    private fun handleHealthRequest(message: Message<JsonObject>, oauth2: OAuth2Auth) {

        // Check if health has been OK during the past few minutes.
        val wasHealthyRecently = lastOpenIDConnectionAtMillis.get() + healthSpanMillis > System.currentTimeMillis()
        if (wasHealthyRecently) {
            message.reply("")
        }

        oauth2
            // Send a dummy authorization request to the OpenID Provider.
            // The OpenID Provider will respond with an error and thus 'prove' that the connection is still OK.
            .rxAuthenticate(UsernamePasswordCredentials("DUMMY", "no-secret"))
            .map { "" }
            .onErrorReturn {
                if (it.message?.contains("invalid_request") != true)
                    throw it
                // The expected error response. Don't propagate the error itself, only the message String.
                it.message
            }
            .subscribe(
                {
                    lastOpenIDConnectionAtMillis.set(System.currentTimeMillis())
                    if (!wasHealthyRecently)
                        message.reply(it)
                },
                {
                    val unhealthyAfterMillis = if (lastOpenIDConnectionAtMillis.get() > 0)
                        System.currentTimeMillis() - lastOpenIDConnectionAtMillis.get() else 0
                    val rootCause = if (it is CompositeException) it.cause.cause ?: it.cause else it
                    log.warn("Became unhealthy after ${unhealthyAfterMillis / 1000} seconds: ${rootCause.message}")
                    if (!wasHealthyRecently)
                        message.fail(RECIPIENT_FAILURE.toInt(), rootCause.message)
                }
            )
    }
}