package nl.valori.cvtool.server

import io.reactivex.Flowable
import io.vertx.core.Promise
import io.vertx.reactivex.core.AbstractVerticle
import org.slf4j.LoggerFactory
import java.util.concurrent.TimeUnit

const val SERVER_HEARTBEAT_ADDRESS = "server.heartbeat"

internal class HeartbeatVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    Flowable
        .interval(1000, TimeUnit.MILLISECONDS)
        .map { if (it % 2 == 0L) "tik" else "tik" }
        .doOnSubscribe { startPromise.complete() }
        .subscribe(
            {
              vertx.eventBus().publish(SERVER_HEARTBEAT_ADDRESS, it)
            },
            {
              log.error("Error starting HeartbeatVerticle")
              startPromise.fail(it)
            }
        )
  }
}