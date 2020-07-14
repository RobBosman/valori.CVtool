package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.mongodb.ADDRESS_FETCH
import org.slf4j.LoggerFactory

const val ADDRESS_LOGIN = "login"

internal class AuthVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_LOGIN)
        .toObservable()
        .subscribe(
            { handleRequest(it) },
            { log.error("Vertx error", it) }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map { it.body().getString("authorizationCode", "") }
          .doOnSuccess {
            if (it === "")
              throw IllegalArgumentException("Error fetching accountInfo; 'authorizationCode' is not specified.")
          }
          .flatMap { authorizationCode -> fetchAccountInfo(authorizationCode) }
          .subscribe(
              {
                log.debug("Successfully fetched accountInfo")
                message.reply(it)
              },
              {
                log.warn("Error fetching accountInfo: $it")
                message.fail(RECIPIENT_FAILURE.toInt(), it.message)
              }
          )

  private fun fetchAccountInfo(authorizationCode: String): Single<JsonObject> {
    log.info("Someone logs in with authorizationCode '$authorizationCode'")
    val accountId = "uuid-account-1" // TODO: determine accountId,
    return vertx.eventBus()
        .rxRequest<JsonObject>(
            ADDRESS_FETCH,
            JsonObject("""{ "account": [{ "_id": "$accountId" }] }"""),
            DeliveryOptions().setSendTimeout(2000))
        .map { it.body() }
  }
}