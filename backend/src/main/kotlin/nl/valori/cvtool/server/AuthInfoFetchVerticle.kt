package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.Model.composeAccountInstance
import nl.valori.cvtool.server.Model.composeEntity
import nl.valori.cvtool.server.Model.getInstanceIds
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.util.*

const val AUTH_INFO_FETCH_ADDRESS = "authInfo.fetch"

internal class AuthInfoFetchVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(startPromise: Promise<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(AUTH_INFO_FETCH_ADDRESS)
        .toObservable()
        .doOnSubscribe { startPromise.complete() }
        .subscribe(
            {
              handleRequest(it)
            },
            {
              log.error("Vertx error: ${it.message}")
              startPromise.fail(it)
            }
        )
  }

  /**
   * Expects message body
   *   {
   *     "email": "PietjePuk@Valori.nl",
   *     "name": "Pietje Puk"
   *   }
   *
   * Response:
   *   {
   *     "email": "PietjePuk@Valori.nl",
   *     "name": "Pietje Puk",
   *     "roles": ["SALES"],
   *     "accountId": "1111-2222-5555-7777",
   *     "cvIds": ["2222-7777-5555-1111"]
   *   }
   */
  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message.body())
          .map(::createAuthInfo)
          .flatMap(::addAccountInfo)
          .flatMap(::addCvIds)
          .map(AuthInfo::toJson)
          .subscribe(
              {
                log.debug("Successfully fetched accountInfo")
                message.reply(it)
              },
              {
                log.warn(it.message)
                message.fail(RECIPIENT_FAILURE.toInt(), it.message)
              }
          )

  private fun createAuthInfo(json: JsonObject) =
      AuthInfo(
          json.map["email"]?.toString() ?: error("Error creating AuthInfo: email not found."),
          json.map["name"]?.toString() ?: error("Error creating AuthInfo: name not found."))

  private fun addAccountInfo(authInfo: AuthInfo) =
      fetchOrCreateAccount(authInfo.email, authInfo.name)
          .map { account ->
            authInfo
                .withAccountId(account.getString("_id", ""))
                .withRoles(account.map["privileges"] as JsonArray? ?: JsonArray())
          }

  private fun fetchOrCreateAccount(email: String, name: String) =
      vertx.eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS,
              JsonObject("""{ "account": [{ "email": "${email.toUpperCase()}" }] }"""),
              deliveryOptions)
          .flatMap {
            val accounts = it.body().getJsonObject("account", JsonObject()).map.values

            when (accounts.size) {
              0 -> createAccount(email, name)
              1 -> Single.just(accounts.iterator().next() as JsonObject)
              else -> error("Found ${accounts.size} accounts for $email.")
            }
          }

  private fun createAccount(email: String, name: String): Single<JsonObject> {
    val accountInstance = composeAccountInstance(UUID.randomUUID().toString(), email, name)
    return vertx.eventBus()
        .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, composeEntity("account", accountInstance), deliveryOptions)
        .map { accountInstance }
  }

  private fun addCvIds(authInfo: AuthInfo) =
      vertx.eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS,
              JsonObject("""{ "cv": [{ "accountId": "${authInfo.accountId}" }] }"""),
              deliveryOptions)
          .map {
            authInfo.cvIds = it.body().getInstanceIds("cv")
            authInfo
          }
}