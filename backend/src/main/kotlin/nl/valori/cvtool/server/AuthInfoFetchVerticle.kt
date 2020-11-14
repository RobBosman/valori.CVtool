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
          .flatMap {
            val authInfo = getAuthInfo(message)
            val email = authInfo["email"] ?: error("Email is not defined in Auth header.")
            val name = authInfo["name"] ?: error("Name is not defined in Auth header.")
            fetchAccountByEmail(email)
                .flatMap { accountOptional ->
                  if (accountOptional.isPresent)
                    Single.just(accountOptional.get())
                  else
                    createAccount(email, name)
                }
          }
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

  private fun getAuthInfo(message: Message<JsonObject>): Map<String, String> {
    val headers = message.headers() ?: error("Error fetching accountInfo: cannot get message headers.")
    val authHeader = headers["Auth"] ?: error("Error fetching accountInfo: cannot get 'Auth' message header.")
    val auth = JsonObject(authHeader)
    return mapOf(
        "email" to auth.getString("email"),
        "name" to auth.getString("name"),
        "privileges" to auth.getString("privileges"))
  }

  private fun fetchAccountByEmail(email: String) =
      fetchAccount(JsonObject("""{ "account": [{ "email": "${email.toUpperCase()}" }] }"""))

  private fun fetchAccount(criteria: JsonObject): Single<Optional<JsonObject>> =
      vertx.eventBus()
        .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, criteria, deliveryOptions)
        .map {
          val accounts = it.body().getInstanceMap("account").values
          when (accounts.size) {
            0 -> Optional.empty()
            1 -> Optional.of(accounts.iterator().next())
            else -> error("Error fetching accountInfo: found ${accounts.size} accounts.")
          }
        }

  private fun createAccount(email: String, name: String): Single<JsonObject> {
    val accountInstance = composeAccountInstance(UUID.randomUUID().toString(), email, name)
    return vertx.eventBus()
        .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, composeEntity("account", accountInstance), deliveryOptions)
        .map { accountInstance }
  }
}