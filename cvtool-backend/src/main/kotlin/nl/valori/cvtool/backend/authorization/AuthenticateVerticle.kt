package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.reactivex.exceptions.CompositeException
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
import java.util.concurrent.atomic.AtomicInteger
import java.util.function.BiConsumer

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTHENTICATE_HEALTH_ADDRESS = "authenticate.health"
private val AUTHORIZED_DOMAINS = listOf(
    "Cerios.nl",
    "WeAreCerios.onmicrosoft.com",
    "deAgileTesters.nl",
    "deAgileTesters.be",
    "PerformanceArchitecten.com",
    "QualityAccelerators.nl",
    "SupportBook.nl",
    "TestCrew-it.nl",
    "Valori.nl"
)

internal class AuthenticateVerticle : AbstractVerticle() {

    companion object {
        private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)
        private const val MAX_IGNORED_HEALTH_ERRORS = 5
        private val numIgnoredHealthErrors = AtomicInteger(0)

        fun String.isDomainAuthorized() =
            AUTHORIZED_DOMAINS.any { authorizedDomain ->
                substringAfter("@").equals(authorizedDomain, true)
            }

        fun parseConnectionString(connectionString: String): Map<String, String> {
            val site = connectionString.substringBefore("?")
            val connectionUri = URI(connectionString)
            val tenant = connectionUri.path.split("/")[1]
            val (clientId, secret) = connectionUri.query.split(":")
            return mapOf(
                "site" to site,
                "tenant" to tenant,
                "clientId" to clientId,
                "secret" to secret
            )
        }
    }

    override fun start(startPromise: Promise<Void>) { // NOSONAR - Promise<Void> is defined in AbstractVerticle
        // Configure the connection to the OpenId Provider.
        // Environment variable:
        //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val configParams = parseConnectionString(config().getString("AUTH_CONNECTION_STRING"))
        val oauth2Options = OAuth2Options()
            .setSite(configParams["site"])
            .setClientId(configParams["clientId"])
            .setClientSecret(configParams["secret"])

        // Obtain config settings from the OpenID Provider.
        OpenIDConnectAuth
            .rxDiscover(vertx, oauth2Options)
            .subscribe(
                {
                    // Provide the connection to the vertx handlers.
                    handleVertxEvents(AUTHENTICATE_ADDRESS, ::handleAuthenticationRequest, it)
                    handleVertxEvents(AUTHENTICATE_HEALTH_ADDRESS, ::handleHealthRequest, it)

                    startPromise.complete()
                    log.info("Successfully configured OpenID")
                },
                {
                    log.error("Error configuring OpenID: ${it.message}", it)
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
            .map { user ->
                val accessToken = user.attributes().getJsonObject("accessToken")
                val email = accessToken.getString("preferred_username", "")
                if (email.isBlank())
                    error("Cannot obtain email from JWT.")
                else if (!email.isDomainAuthorized())
                    error("Email '$email' is not supported. Please use a ${AUTHORIZED_DOMAINS.joinToString(" or ") { "@$it" }} account.")
                var name = accessToken.getString("name", "")
                if (name.isBlank())
                    name = email.substringBefore("@")
                JsonObject()
                    .put("email", email)
                    .put("name", name)
            }

    private fun handleHealthRequest(message: Message<JsonObject>, oauth2: OAuth2Auth) =
        oauth2
            // Send an invalid authorization request (expired JWT) to the OpenID Provider.
            // The OpenID Provider will respond with an error and thus 'prove' that the connection is still OK.
            .rxAuthenticate(UsernamePasswordCredentials("DUMMY", "no-secret"))
            .map { "" } // Convert Single<User> to Single<String>.
            // If it's the expected error response, then don't propagate the error itself, only the message String.
            .onErrorReturn { if (isExpectedAuthenticationError(it)) it.message else throw it }
            // Ignore auth errors for a few minutes to prevent the health checker to trigger false positives.
            .doOnSuccess { numIgnoredHealthErrors.set(0) }
            .onErrorReturn { if (shouldIgnoreHealthError()) it.message else throw it }
            .subscribe(
                {
                    message.reply(it)
                },
                {
                    val rootCause = if (it is CompositeException) it.cause.cause ?: it.cause else it
                    log.warn("Unexpected error response: ", it)
                    message.fail(RECIPIENT_FAILURE.toInt(), rootCause.message)
                }
            )

    private fun isExpectedAuthenticationError(throwable: Throwable) =
        throwable.message?.contains("invalid_request") == true

    private fun shouldIgnoreHealthError(): Boolean =
        numIgnoredHealthErrors.getAndIncrement() < MAX_IGNORED_HEALTH_ERRORS
}