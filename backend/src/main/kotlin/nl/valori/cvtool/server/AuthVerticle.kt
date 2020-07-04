package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import nl.valori.cvtool.server.mongodb.ADDRESS_FETCH
import org.slf4j.LoggerFactory
import rx.Single

const val ADDRESS_LOGIN = "login"

internal class AuthVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_LOGIN)
        .toObservable()
        .subscribe(
            { message ->
              fetchAccount(message)
                  .subscribe(
                      {
                        log.debug("Successfully fetched account")
                        message.reply(it)
                      },
                      {
                        log.warn("Error fetching account", it)
                        message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                      })
            },
            {
              log.error("Vertx error", it)
            })
  }

  private fun fetchAccount(message: Message<JsonObject>): Single<JsonObject> {
    val authCode = message.body().getString("authenticationCode")
    log.info("Someone logs in with authCode '$authCode'")
    val accountId = "uuid-account-1" // TODO: determine accountId,
    return vertx.eventBus()
        .rxRequest<JsonObject>(
            ADDRESS_FETCH,
            JsonObject("""{ "account": [{ "_id": "$accountId" }] }"""),
            DeliveryOptions().setSendTimeout(2000))
        .map { it.body() }
  }
}