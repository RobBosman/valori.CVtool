package nl.valori.cvtool.server

import io.vertx.core.AsyncResult
import io.vertx.core.Future
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
        .map { loginMessage ->
          val fetchCriteria = JsonObject("""{ "account": [ "uuid-account-1" ] }""") // TODO: determine accountId
          vertx.eventBus().request(ADDRESS_FETCH, fetchCriteria) { fetchResponse: AsyncResult<Message<JsonObject>> ->
            if (fetchResponse.failed()) {
              log.error("Error fetching account", fetchResponse.cause())
            } else {
              log.debug("Successfully fetched account")
              loginMessage.reply(fetchResponse.result().body())
            }
          }
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }
}