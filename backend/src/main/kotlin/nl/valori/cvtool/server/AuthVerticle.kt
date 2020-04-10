package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import org.slf4j.LoggerFactory

const val ADDRESS_LOGIN = "login"

internal class AuthVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_LOGIN)
        .toObservable()
        .doOnNext { loginMessage ->
          val authCode = loginMessage.body().getString("authenticationCode")
          log.info("Someone logs in with authCode '$authCode'")
          val accountId = "uuid-account-1" // TODO: determine accountId
          fetchAccount(accountId, loginMessage)
        }
        .subscribe(
            {},
            { log.error("Vertx error", it) })
  }

  private fun fetchAccount(accountId: String, loginMessage: Message<JsonObject>) {
    vertx.eventBus()
        .rxRequest<JsonObject>(
            ADDRESS_FETCH,
            JsonObject("""{ "account": [{ "_id": "$accountId" }] }"""),
            DeliveryOptions().setSendTimeout(2000))
        .subscribe(
            { fetchResponse ->
              log.debug("Successfully fetched account")
              loginMessage.reply(fetchResponse.body())
            },
            {
              log.warn("Error fetching account", it)
              loginMessage.fail(RECIPIENT_FAILURE.toInt(), it.message)
            })
  }
}