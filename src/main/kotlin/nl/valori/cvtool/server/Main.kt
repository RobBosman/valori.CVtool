package nl.valori.cvtool.server

import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import org.slf4j.LoggerFactory

fun main() = Main.run()

object Main {

  private val log = LoggerFactory.getLogger(javaClass)

  fun run() {
    val options = VertxOptions()
    if (log.isDebugEnabled)
      options.blockedThreadCheckInterval = 1_000 * 60 * 10 // debug for max 10 minutes
    val vertx = Vertx.vertx(options)

    val verticleClassName = ConfigVerticle::class.java.name
    vertx.deployVerticle(verticleClassName) { deployResult ->
      if (deployResult.failed())
        log.error("Error deploying {}", verticleClassName, deployResult.cause())
    }

    // run for max 1 minute
    vertx.setTimer(1_000 * 60) {
      vertx.close()
      log.info("And... it's gone!")
    }
  }
}