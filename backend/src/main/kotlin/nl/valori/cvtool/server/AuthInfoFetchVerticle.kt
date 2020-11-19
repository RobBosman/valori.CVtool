package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.Model.composeAccountInstance
import nl.valori.cvtool.server.Model.composeEntity
import nl.valori.cvtool.server.Model.getInstanceMap
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
   * Expects message header
   *   {
   *     "email": "PietjePuk@Valori.nl",
   *     "name": "Pietje Puk"
   *   }
   *   or message body
   *   {
   *     "email": "PietjePuk@Valori.nl"
   *   }
   *
   * Response:
   *   {
   *     "_id": ""1111-2222-5555-7777,
   *     "name": "Pietje Puk",
   *     "email": "PietjePuk@Valori.nl",
   *     ...
   *   }
   */
  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map(AuthInfo::getAuthInfo)
          .flatMap(::fetchOrCreateAccount)
          .flatMap(::fetchCvIds)
          .map(AuthInfo::asJson)
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

  private fun fetchOrCreateAccount(authInfo: AuthInfo) =
      vertx.eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS,
              JsonObject("""{ "account": [{ "email": "${authInfo.email.toUpperCase()}" }] }"""),
              deliveryOptions)
          .flatMap {
            val accounts = it.body().getInstanceMap("account").values
            when (accounts.size) {
              0 -> createAccount(authInfo)
              1 -> Single.just(accounts.iterator().next())
              else -> error("Found ${accounts.size} accounts for ${authInfo.email}.")
            }
          }
          .map { account ->
            authInfo.accountId = account.getString("_id")
            authInfo.setRoles(account.getJsonArray("privileges"))
            authInfo
          }

  private fun createAccount(authInfo: AuthInfo): Single<JsonObject> {
    val accountInstance = composeAccountInstance(UUID.randomUUID().toString(), authInfo.email, authInfo.name)
    return vertx.eventBus()
        .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, composeEntity("account", accountInstance), deliveryOptions)
        .map { accountInstance }
  }

  private fun fetchCvIds(authInfo: AuthInfo) =
      vertx.eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS,
              JsonObject("""{ "cv": [{ "accountId": "${authInfo.accountId}" }] }"""),
              deliveryOptions)
          .map {
            authInfo.cvIds = it.body().getInstanceMap("cv").keys
            authInfo
          }
}