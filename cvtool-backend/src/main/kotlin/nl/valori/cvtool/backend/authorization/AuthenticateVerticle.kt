package nl.valori.cvtool.backend.authorization

//import io.vertx.ext.auth.oauth2.OAuth2Auth
import io.reactivex.Single
import io.reactivex.exceptions.CompositeException
import io.reactivex.schedulers.Schedulers
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.authentication.TokenCredentials
import io.vertx.ext.auth.authentication.UsernamePasswordCredentials
import io.vertx.ext.auth.oauth2.OAuth2Options
import io.vertx.ext.auth.oauth2.providers.AzureADAuth
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import org.slf4j.LoggerFactory
import java.net.URI
import java.util.function.BiConsumer

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTHENTICATE_HEALTH_ADDRESS = "authenticate.health"
const val AUTH_DOMAIN = "Valori.nl"

internal class AuthenticateVerticle : AbstractVerticle() {

    companion object {
        private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)

        fun parseConnectionString(connectionString: String): Map<String, String> {
            val connectionUri = URI(connectionString)
            val tenant = connectionUri.path.split("/")[1]
            val clientIdAndSecret = connectionUri.query.split(":")
            return mapOf(
                "tenant" to tenant,
                "clientId" to clientIdAndSecret[0],
                "secret" to clientIdAndSecret[1]
            )
        }
    }

    override fun start(startPromise: Promise<Void>) { //NOSONAR - Promise<Void> is defined in AbstractVerticle
        // Configure the connection to the OpenId Provider.
        // Environment variable:
        //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val configParams = parseConnectionString(config().getString("AUTH_CONNECTION_STRING"))
        val oauth2Options = OAuth2Options()
            .setTenant(configParams["tenant"])
            .setClientId(configParams["clientId"])
            .setClientSecret(configParams["secret"])

        Thread.sleep(5_000)

        AzureADAuth
            .discover(vertx.delegate, oauth2Options)
            .onSuccess {
                log.info("Joepie!")

                val rxOath2 = OAuth2Auth(it)
                // Provide the connection to the vertx handlers.
                handleVertxEvents(AUTHENTICATE_ADDRESS, ::handleAuthenticationRequest, rxOath2)
                handleVertxEvents(AUTHENTICATE_HEALTH_ADDRESS, ::handleHealthRequest, rxOath2)

                startPromise.complete()
                log.info("Successfully configured the connection to OpenID Provider")
            }
            .onFailure {
                log.warn("Oeps!", it)
                startPromise.fail(it)
            }


//        // Obtain a connection to the OpenID Provider.
//        AzureADAuth
//            .rxDiscover(vertx, oauth2Options)
//            .subscribeOn(Schedulers.io())
//            .doOnError { log.warn("Error connecting to OpenID Provider: ${it.message}", it) }
//            .subscribe(
//                {
//                    // Provide the connection to the vertx handlers.
//                    handleVertxEvents(AUTHENTICATE_ADDRESS, ::handleAuthenticationRequest, it)
//                    handleVertxEvents(AUTHENTICATE_HEALTH_ADDRESS, ::handleHealthRequest, it)
//
//                    startPromise.tryComplete()
//                    log.info("Successfully configured the connection to OpenID Provider")
//                },
//                {
//                    log.error("Cannot start verticle: ${it.message}", it)
//                    startPromise.tryFail(it)
//                }
//            )
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
            .subscribeOn(Schedulers.io())
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
            // Send an invalid authorization request (expired JWT) to the OpenID Provider.
            // The OpenID Provider will respond with an error and thus 'prove' that the connection is still OK.
            .rxAuthenticate(UsernamePasswordCredentials("DUMMY", "no-secret"))
            .subscribeOn(Schedulers.io())
            .map { "" } // Convert Single<User> to Single<String>.
            // If it's the expected error response, then don't propagate the error itself, only the message String.
            .onErrorReturn { if (it.message?.contains("invalid_request") == true) it.message else throw it }
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
}