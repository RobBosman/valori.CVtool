package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.oauth2.OAuth2Options
import io.vertx.ext.web.client.WebClientOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.core.eventbus.Message
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import io.vertx.reactivex.ext.auth.oauth2.providers.OpenIDConnectAuth
import io.vertx.reactivex.ext.web.client.WebClient
import org.slf4j.LoggerFactory
import java.net.URL
import java.util.concurrent.TimeUnit.MILLISECONDS

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTH_DOMAIN = "Valori.nl"

internal class AuthenticateVerticle : AbstractVerticle() {

    companion object {

        private val log = LoggerFactory.getLogger(AuthenticateVerticle::class.java)

        private class Config(val site: String, val clientID: String, val clientSecret: String)

        private fun parseConfig(config: JsonObject): Config {
            // Environment variable:
            //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
            val connectionString = config.getString("AUTH_CONNECTION_STRING")
            val clientIdSecret = URL(connectionString).query.split(":")
            return Config(connectionString.substringBefore("?"), clientIdSecret[0], clientIdSecret[1])
        }

        fun checkConnection(vertx: Vertx, config: JsonObject): Single<Int> {
            val url = URL(parseConfig(config).site)
            val port = if (url.port >= 0) url.port else url.defaultPort
            return WebClient.create(vertx, WebClientOptions().setSsl(true))
                .get(port, url.host, "/")
                .rxSend()
                .map { it.statusCode() }
                .doOnSuccess {
                    if (it != 200)
                        error("Received HTTP status code: $it from ${url.protocol}://${url.authority}/")
                }
                .timeout(1000, MILLISECONDS)
                .retry(2)
                .timeout(3000, MILLISECONDS)
        }
    }

    override fun start(startPromise: Promise<Void>) {
        val config = parseConfig(config())
        OpenIDConnectAuth
            .rxDiscover(
                vertx, OAuth2Options()
                    .setSite(config.site)
                    .setClientID(config.clientID)
                    .setClientSecret(config.clientSecret)
            )
            .retry(2)
            .doOnSuccess { startPromise.complete() }
            .flatMapObservable { oauth2 ->
                vertx.eventBus()
                    .consumer<JsonObject>(AUTHENTICATE_ADDRESS)
                    .toObservable()
                    .map { it to oauth2 }
            }
            .subscribe(
                { (message, oauth2) ->
                    handleRequest(message, oauth2)
                },
                {
                    log.error("Vertx error: ${it.message}")
                    startPromise.fail(it)
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
                JsonObject()
                    .put("email", email)
                    .put("name", accessToken.getString("name", ""))
            }
}