package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.oauth2.OAuth2Options
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import io.vertx.reactivex.ext.auth.oauth2.providers.OpenIDConnectAuth
import nl.valori.cvtool.server.Model.composeAccountInstance
import nl.valori.cvtool.server.Model.composeEntity
import nl.valori.cvtool.server.Model.getInstanceMap
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.net.URL
import java.util.*

const val AUTHENTICATE_ADDRESS = "authenticate"
const val AUTH_DOMAIN = "valori.nl"

internal class AuthVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   AUTH_CONNECTION_STRING=<OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<APP_ID>:<CLIENT_SECRET>
    val connectionString = config().getString("AUTH_CONNECTION_STRING")
    val connectionURL = URL(connectionString)
    val clientIdSecret = connectionURL.query.split(":")

    OpenIDConnectAuth
        .rxDiscover(vertx, OAuth2Options()
            .setSite(connectionString.substringBefore("?"))
            .setClientID(clientIdSecret[0])
            .setClientSecret(clientIdSecret[1])
        )
        .subscribe(
            { oauth2 ->
              vertx.eventBus()
                  .consumer<JsonObject>(AUTHENTICATE_ADDRESS)
                  .toObservable()
                  .subscribe(
                      {
                        startPromise.tryComplete()
                        handleRequest(it, oauth2)
                      },
                      {
                        log.error("Vertx error: ${it.message}")
                        startPromise.fail(it)
                      }
                  )
            },
            {
              log.error("Error connecting to OpenIDConnect provider: ${it.message}")
              startPromise.fail(it)
            }
        )
  }

  private fun handleRequest(message: Message<JsonObject>, oauth2: OAuth2Auth) =
      Single.just(message)
          .flatMap { authenticate(it, oauth2) }
          .flatMap { fetchAccountInfo(it.first, it.second) }
          .subscribe(
              {
                log.debug("Successfully fetched accountInfo")
                message.reply(it)
              },
              {
                log.warn("Error fetching accountInfo: ${it.message}")
                message.fail(RECIPIENT_FAILURE.toInt(), it.message)
              }
          )

  private fun authenticate(message: Message<JsonObject>, oauth2: OAuth2Auth): Single<Pair<String, String>> {
    val jwt = message
        .headers()["Authorization"]
        ?.substringAfter("Bearer ")
    if (jwt === null)
      throw IllegalArgumentException("Cannot obtain Bearer token from message Authorization header.")
    return oauth2
        .rxAuthenticate(JsonObject().put("access_token", jwt))
        .map {
          val accessToken = it.attributes().getJsonObject("accessToken")
          val email = accessToken.getString("preferred_username", "")
          if (email.isBlank()) {
            throw IllegalArgumentException("Cannot obtain email from JWT.")
          } else if (!email.toLowerCase().endsWith("@$AUTH_DOMAIN")) {
            throw IllegalArgumentException("Email '$email' is not supported. Please use a '@$AUTH_DOMAIN' account.")
          }
          log.debug("Authorization successful")
          email to accessToken.getString("name", "")
        }
  }

  private fun fetchAccountInfo(email: String, name: String): Single<JsonObject> =
      vertx.eventBus()
          .rxRequest<JsonObject>(FETCH_ADDRESS, composeAccountCriteria(email), deliveryOptions)
          .flatMap { obtainOrCreateAccount(it.body(), email, name) }
          .map { JsonObject().put("accountInfo", it) }

  private fun composeAccountCriteria(email: String) =
      JsonObject("""{ "account": [{ "email": "$email" }] }""")

  private fun obtainOrCreateAccount(accountEntity: JsonObject, email: String, name: String): Single<JsonObject> {
    val accountInstanceMap = accountEntity.getInstanceMap("account")
    return when (accountInstanceMap.size) {
      0 -> {
        val accountInstance = composeAccountInstance(UUID.randomUUID().toString(), email, name)
        vertx.eventBus()
            .rxRequest<JsonObject>(SAVE_ADDRESS, composeEntity("account", accountInstance), deliveryOptions)
            .map { accountInstance }
      }
      1 -> Single.just(accountInstanceMap.values.first())
      else -> throw IllegalStateException("Found ${accountInstanceMap.size} accountInfo records for $email.")
    }
  }
}