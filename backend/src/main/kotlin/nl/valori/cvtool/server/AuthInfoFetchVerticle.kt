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
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
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
        .subscribe(
            {
              startPromise.tryComplete()
              handleRequest(it)
            },
            {
              log.error("Vertx error: ${it.message}")
              startPromise.fail(it)
            }
        )
  }

  /**
   * Expects message header <pre>
   *   {
   *     "email": "PietjePuk@Valori.nl",
   *     "name": "Pietje Puk
   *   }
   * </pre>
   */
  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map(::getEmailAndName)
          .flatMap { (email, name) -> fetchAccountInfo(email, name) }
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

  private fun getEmailAndName(message: Message<JsonObject>): Pair<String, String> {
    val email = message.headers()["email"]
        ?: throw IllegalArgumentException("Error fetching accountInfo: cannot get 'email' from message headers.")
    val name = message.headers()["name"]
        ?: throw IllegalArgumentException("Error fetching accountInfo: cannot get 'name' from message headers.")
    return email to name
  }

  private fun fetchAccountInfo(email: String, name: String) =
      vertx.eventBus()
          .rxRequest<JsonObject>(FETCH_ADDRESS, composeAccountCriteria(email), deliveryOptions)
          .flatMap { obtainOrCreateAccount(it.body(), email, name) }
          .map { JsonObject().put("accountInfo", it) }

  private fun composeAccountCriteria(email: String) =
      JsonObject("""{ "account": [{ "email": "${email.toUpperCase()}" }] }""")

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
      else -> throw IllegalStateException("Error fetching accountInfo: found ${accountInstanceMap.size} records for $email.")
    }
  }
}