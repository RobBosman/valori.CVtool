package nl.valori.cvtool.server

import io.reactivex.Completable
import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.oauth2.AccessToken
import io.vertx.ext.auth.oauth2.OAuth2ClientOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import io.vertx.reactivex.ext.auth.oauth2.providers.OpenIDConnectAuth
import nl.valori.cvtool.server.Model.composeAccountInstance
import nl.valori.cvtool.server.Model.composeEntity
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.util.*

const val AUTHENTICATE_ADDRESS = "authenticate"

internal class AuthVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun rxStart(): Completable {
    // https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663/v2.0?57e3b5d5-d7d6-40db-850b-5947ea1f2209:==22Af-PkYQ8og.hsxh09A?q0UCWm_8E
    val connectionString = config().getString("authConnectionString")
    val site = connectionString.substringBefore("?")
    val clientId = connectionString.substringAfter("?").substringBefore(":")
    val clientSecret = connectionString.substringAfterLast(":")

    return OpenIDConnectAuth
        .rxDiscover(vertx, OAuth2ClientOptions()
            .setSite(site)
            .setClientID(clientId)
            .setClientSecret(clientSecret)
        )
        .doOnSuccess { oauth2 ->
          vertx.eventBus()
              .consumer<JsonObject>(AUTHENTICATE_ADDRESS)
              .toObservable()
              .subscribe(
                  { handleRequest(it, oauth2) },
                  { log.error("Vertx error", it) }
              )
        }
        .ignoreElement()
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
          val accessToken = it.delegate
          if (accessToken !is AccessToken) {
            throw UnsupportedOperationException("Expected class AccessToken here, not ${accessToken.javaClass}.")
          }
          val email = accessToken.accessToken().getString("preferred_username", "")
          if (email.isBlank()) {
            throw IllegalArgumentException("Cannot obtain email from JWT.")
          } else if (!email.toLowerCase().endsWith("@valori.nl")) {
            throw IllegalArgumentException("Email '$email' is not supported. Please use a '@Valori.nl' account.")
          }
          log.debug("Authorization successful")
          email to accessToken.accessToken().getString("name", "")
        }
  }

  private fun fetchAccountInfo(email: String, name: String): Single<JsonObject> =
      vertx.eventBus()
          .rxRequest<JsonObject>(FETCH_ADDRESS, composeAccountCriteria(email), deliveryOptions)
          .map { it.body().getJsonObject("account")?.map ?: emptyMap() }
          .flatMap { accountMap ->
            when {
              accountMap.size == 1 -> Single.just(accountMap.values.iterator().next())
              accountMap.isEmpty() -> {
                // Create and save a new Account if necessary.
                val accountInstance = composeAccountInstance(UUID.randomUUID().toString(), email, name)
                vertx.eventBus()
                    .rxRequest<JsonObject>(SAVE_ADDRESS, composeEntity("account", accountInstance), deliveryOptions)
                    .map { accountInstance }
              }
              else -> throw IllegalStateException("Found ${accountMap.size} accountInfo records for $email.")
            }
          }
          .map { JsonObject().put("accountInfo", it) }

  private fun composeAccountCriteria(email: String) =
      JsonObject("""{ "account": [{ "email": "$email" }] }""")
}