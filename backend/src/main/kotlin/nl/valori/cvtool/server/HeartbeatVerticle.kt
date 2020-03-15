package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.rxjava.core.AbstractVerticle
import org.slf4j.LoggerFactory
import rx.Observable
import java.util.concurrent.TimeUnit

const val ADDRESS_SERVER_HEARTBEAT = "server.heartbeat"

internal class HeartbeatVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    Observable
        .interval(1000, TimeUnit.MILLISECONDS)
        .map { if (it % 2 == 0L) "tik" else "tik" }
        .subscribe(
            { vertx.eventBus().publish(ADDRESS_SERVER_HEARTBEAT, it) },
            { log.error("Error: {}", it.message, it) })
  }
}