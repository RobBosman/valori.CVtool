package nl.valori.cvtool.server

import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import org.slf4j.LoggerFactory

const val ACCOUNTS_FETCH_ADDRESS = "accounts.fetch"

internal class AccountsFetchVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(startPromise: Promise<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(ACCOUNTS_FETCH_ADDRESS)
        .toObservable()
        .subscribe(
            {
              startPromise.tryComplete()
              handleRequest(it)
            },
            {
              log.error("Vertx error in AccountsFetchVerticle")
              startPromise.fail(it)
            }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) =
      vertx.eventBus()
          .rxRequest<JsonObject>(FETCH_ADDRESS,
              JsonObject("""{ "account": [{}] }"""),
              deliveryOptions)
          .map { it.body() }
          .subscribe(
              {
                log.debug("Successfully fetched accounts")
                message.reply(it)
              },
              {
                val errorMsg = "Error fetching accounts: ${it.message}"
                log.warn(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              }
          )
}