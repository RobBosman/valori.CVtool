package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.ReplaySubject
import io.reactivex.subjects.Subject
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.oauth2.OAuth2FlowType.AUTH_JWT
import io.vertx.ext.auth.oauth2.OAuth2Options
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import io.vertx.reactivex.ext.auth.oauth2.providers.OpenIDConnectAuth
import org.slf4j.LoggerFactory
import java.net.URL

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTH_DOMAIN = "Valori.nl"

internal class AuthenticateVerticle : AbstractVerticle() {

    companion object {

        private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)

        private val oauth2Subject: Subject<OAuth2Auth> = ReplaySubject.create()

        fun checkOpenIdConnection(): Single<String> =
            // Use any available OAuth2 connection.
            oauth2Subject
                .observeOn(Schedulers.io())
                .take(1)
                .singleOrError()
                .flatMap { oauth2 ->
                    // Send a dummy authorization request to the OpenID Provider.
                    // The OpenID Provider will respond an error and thus 'prove' that the connection is still OK.
                    oauth2
                        .rxAuthenticate(
                            JsonObject()
                                .put("code", AUTH_JWT.grantType)
                                .put("redirect_uri", "http://example.com/")
                        )
                        .map { "" }
                        .onErrorReturn {
                            if (it.message?.contains("Bad Request") != true)
                                throw it
                            // The expected error response. Don't propagate the error, only the message String.
                            it.message
                        }
                }
    }

    private fun connectToOpenID(): Single<OAuth2Auth> {
        // Environment variable:
        //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val connectionString = config().getString("AUTH_CONNECTION_STRING")
        val openIdSite = connectionString.substringBefore("?")
        val clientIdAndSecret = URL(connectionString).query.split(":")

        // Connect to OpenID Provider.
        return OpenIDConnectAuth
            .rxDiscover(
                vertx, OAuth2Options()
                    .setSite(openIdSite)
                    .setClientID(clientIdAndSecret[0])
                    .setClientSecret(clientIdAndSecret[1])
            )
            .observeOn(Schedulers.io())
            .doOnSuccess {
                log.info("Successfully connected to OpenID Provider")
                oauth2Subject.onNext(it) // Keep track of oauth2 to use it for health checking.
            }
    }

    override fun start(startPromise: Promise<Void>) {
        connectToOpenID()
            .subscribe(
                { oauth2 ->
                    startPromise.complete()

                    vertx.eventBus()
                        .consumer<JsonObject>(AUTHENTICATE_ADDRESS)
                        .toFlowable()
                        .subscribe(
                            {
                                handleRequest(it, oauth2)
                            },
                            {
                                log.error("Vertx error processing authentication request: ${it.message}")
                            }
                        )
                },
                {
                    log.error("Vertx error: ${it.message}")
                    startPromise.tryFail(it)
                }
            )
    }

    /**
     * Expects jwt in message body: <pre>
     *   { "jwt": "###.######.####" }
     * </pre>
     */
    private fun handleRequest(message: Message<JsonObject>, oauth2: OAuth2Auth) =
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
                    log.warn("Error authenticating: ${it.message}")
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )

    private fun authenticateJwt(jwt: String, oauth2: OAuth2Auth) =
        oauth2
            .rxAuthenticate(JsonObject().put("access_token", jwt))
            .map {
                val accessToken = it.attributes().getJsonObject("accessToken")
                val email = accessToken.getString("preferred_username", "")
                if (email.isBlank())
                    error("Cannot obtain email from JWT.")
                else if (!email.toUpperCase().endsWith("@${AUTH_DOMAIN.toUpperCase()}"))
                    error("Email '$email' is not supported. Please use a '@$AUTH_DOMAIN' account.")
                var name = accessToken.getString("name", "")
                if (name.isBlank())
                    name = email.substringBefore("@")
                JsonObject()
                    .put("email", email)
                    .put("name", name)
            }
}