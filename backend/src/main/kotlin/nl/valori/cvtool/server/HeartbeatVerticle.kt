package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.rxjava.core.AbstractVerticle
import org.slf4j.LoggerFactory
import rx.Observable
import java.util.concurrent.TimeUnit

const val ADDRESS_CV_HEARTBEAT = "cv.heartbeat"

internal class HeartbeatVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    Observable
        .interval(30000, TimeUnit.MILLISECONDS)
        .map { if (it % 2 == 0L) "bim " else "bam" }
        .subscribe(
            { vertx.eventBus().publish(ADDRESS_CV_HEARTBEAT, it) },
            { log.error("Error: {}", it.message, it) })
  }
}