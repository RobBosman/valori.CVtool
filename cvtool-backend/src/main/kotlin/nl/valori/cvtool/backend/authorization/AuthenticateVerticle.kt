package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.reactivex.exceptions.CompositeException
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.ReplaySubject
import io.reactivex.subjects.Subject
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.http.HttpClientOptions
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
import java.util.function.Consumer

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTHENTICATE_HEALTH_ADDRESS = "authenticate.health"
const val AUTH_DOMAIN = "Valori.nl"

internal class AuthenticateVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)
    private val oauth2Subject: Subject<OAuth2Auth> = ReplaySubject.create(1)
    private val oauth2SslTimeoutMillis = 30_000L
    private val oauth2RetryAfterMillis = 5_000L

    override fun start(startPromise: Promise<Void>) { //NOSONAR - Promise<Void> is defined in AbstractVerticle
        // Configure the connection to the OpenId Provider.
        configureOauth2Connection(config())

        // Wait for Oauth2 to connect and then finalize startup.
        oauth2Single()
            .subscribe(
                {
                    // Provide the connection to the vertx handlers.
                    handleVertxEvents(AUTHENTICATE_ADDRESS, ::handleAuthenticationRequest)
                    handleVertxEvents(AUTHENTICATE_HEALTH_ADDRESS, ::handleHealthRequest)

                    startPromise.tryComplete()
                    log.info("Successfully configured the connection to OpenID Provider")
                },
                {
                    log.error("Cannot start verticle: ${it.message}", it)
                    startPromise.tryFail(it)
                }
            )
    }

    private fun configureOauth2Connection(config: JsonObject) {
        // Environment variable:
        //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val connectionString = config.getString("AUTH_CONNECTION_STRING")
        val clientIdAndSecret = URI(connectionString).query.split(":")
        val oauth2Options = OAuth2Options()
            .setSite(connectionString.substringBefore("?"))
            .setClientId(clientIdAndSecret[0])
            .setClientSecret(clientIdAndSecret[1])
            .setHttpClientOptions(HttpClientOptions()
                .setSslHandshakeTimeout(oauth2SslTimeoutMillis)
                .setSslHandshakeTimeoutUnit(MILLISECONDS)
                .setReadIdleTimeout(oauth2SslTimeoutMillis.toInt())
                .setWriteIdleTimeout(oauth2SslTimeoutMillis.toInt())
                .setIdleTimeoutUnit(MILLISECONDS))

        // Obtain a connection to the OpenID Provider.
        OpenIDConnectAuth
            .rxDiscover(vertx, oauth2Options)
            .subscribeOn(Schedulers.io())
            .doOnError { log.warn("Error connecting to OpenID Provider: ${it.message}", it) }
            .retryWhen { it.delay(oauth2RetryAfterMillis, MILLISECONDS) } // Keep retrying on error.
            .subscribe(
                {
                    oauth2Subject.onNext(it)
                    log.info("Successfully refreshed connection to OpenID Provider")
                },
                {
                    log.error("Cannot connect to OpenID Provider: ${it.message}", it)
                }
            )
    }

    private fun oauth2Single() =
        oauth2Subject
            .take(1)
            .singleOrError()
            .observeOn(Schedulers.io())

    private fun handleVertxEvents(
        eventAddress: String,
        handler: Consumer<Message<JsonObject>>
    ) =
        vertx.eventBus()
            .consumer<JsonObject>(eventAddress)
            .toFlowable()
            .subscribe(
                {
                    handler.accept(it)
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
    private fun handleAuthenticationRequest(message: Message<JsonObject>) =
        Single
            .just(
                message.body().getString("jwt")
                    ?: error("Cannot obtain 'jwt' from message body.")
            )
            .flatMap { authenticateJwt(it) }
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

    private fun authenticateJwt(jwt: String) =
        oauth2Single()
            .flatMap { it.rxAuthenticate(TokenCredentials(jwt)) }
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

    private fun handleHealthRequest(message: Message<JsonObject>) =
        oauth2Single()
            // Send an invalid authorization request (expired JWT) to the OpenID Provider.
            // The OpenID Provider will respond with an error and thus 'prove' that the connection is still OK.
            .flatMap { it.rxAuthenticate(UsernamePasswordCredentials("DUMMY", "no-secret")) }
            .map { "" } // Convert Single<User> to Single<String>.
            .onErrorReturn {
                if (it.message?.contains("invalid_request") != true)
                    throw it
                // It's the expected error response. Don't propagate the error itself, only the message String.
                log.info("Expected error response: ", it)
                it.message
            }
            .subscribe(
                {
                    message.reply(it)
                },
                {
                    val rootCause = if (it is CompositeException) it.cause.cause ?: it.cause else it
                    log.info("Unexpected error response: ", it)
                    message.fail(RECIPIENT_FAILURE.toInt(), rootCause.message)
                }
            )
}