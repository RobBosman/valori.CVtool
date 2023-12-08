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
import java.net.URI
import java.util.concurrent.TimeUnit.MILLISECONDS
import java.util.function.BiConsumer

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTHENTICATE_HEALTH_ADDRESS = "authenticate.health"
const val AUTH_DOMAIN = "Valori.nl"

internal class AuthenticateVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)

    override fun start(startPromise: Promise<Void>) { //NOSONAR - Promise<Void> is defined in AbstractVerticle
        // Configure the connection to the OpenId Provider and refresh it regularly.
        // Environment variable:
        //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val connectionString = config().getString("AUTH_CONNECTION_STRING")
        val clientIdAndSecret = URI(connectionString).query.split(":")
        val oauth2Options = OAuth2Options()
            .setSite(connectionString.substringBefore("?"))
            .setClientId(clientIdAndSecret[0])
            .setClientSecret(clientIdAndSecret[1])
        // Prevent SSL handshake timeouts. Especially when establishing remote connections from virtual environments.
        oauth2Options.httpClientOptions
            .setSslHandshakeTimeoutUnit(MILLISECONDS)
            .setSslHandshakeTimeout(5_000)

        // Obtain a connection to the OpenID Provider.
        OpenIDConnectAuth
            .rxDiscover(vertx, oauth2Options)
            .observeOn(Schedulers.io())
            .doOnError { log.warn("Error connecting to OpenID Provider: ${it.message}", it) }
            .retryWhen { it.delay(5_000, MILLISECONDS) }
            .subscribe(
                {
                    // Provide the connection to the vertx handlers.
                    handleVertxEvents(AUTHENTICATE_ADDRESS, ::handleAuthenticationRequest, it)
                    handleVertxEvents(AUTHENTICATE_HEALTH_ADDRESS, ::handleHealthRequest, it)

                    startPromise.tryComplete()
                    log.info("Successfully configured the connection to OpenID Provider")
                },
                {
                    log.error("Cannot start verticle: ${it.message}", it)
                    startPromise.tryFail(it)
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

    private fun handleHealthRequest(message: Message<JsonObject>, oauth2: OAuth2Auth) =
        oauth2
            // Send an invalid authorization request to the OpenID Provider.
            // The OpenID Provider will respond with an error and thus 'prove' that the connection is still OK.
            .rxAuthenticate(UsernamePasswordCredentials("DUMMY", "no-secret"))
            .map { "" }
            .onErrorReturn {
                if (it.message?.contains("invalid_request") != true)
                    throw it
                // It's the expected error response. Don't propagate the error itself, only the message String.
                it.message
            }
            .subscribe(
                {
                    message.reply(it)
                },
                {
                    val rootCause = if (it is CompositeException) it.cause.cause ?: it.cause else it
                    message.fail(RECIPIENT_FAILURE.toInt(), rootCause.message)
                }
            )
}