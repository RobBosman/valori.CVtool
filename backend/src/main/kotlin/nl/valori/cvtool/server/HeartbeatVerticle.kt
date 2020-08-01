package nl.valori.cvtool.server

import io.reactivex.Flowable
import io.vertx.core.Future
import io.vertx.reactivex.core.AbstractVerticle
import org.slf4j.LoggerFactory
import java.util.concurrent.TimeUnit

const val SERVER_HEARTBEAT_ADDRESS = "server.heartbeat"

internal class HeartbeatVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    Flowable
        .interval(1000, TimeUnit.MILLISECONDS)
        .map { if (it % 2 == 0L) "tik" else "tik" }
        .subscribe(
            { vertx.eventBus().publish(SERVER_HEARTBEAT_ADDRESS, it) },
            { log.error("Error: {}", it.message, it) }
        )
  }
}