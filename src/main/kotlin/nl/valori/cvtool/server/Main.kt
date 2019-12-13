package nl.valori.cvtool.server

import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import org.slf4j.LoggerFactory

fun main() = Main.run()

object Main {

  private val LOG = LoggerFactory.getLogger(javaClass)

  fun run() {
    val options = VertxOptions()
    if (LOG.isDebugEnabled)
      options.blockedThreadCheckInterval = 1_000 * 60 * 60
    val vertx = Vertx.vertx(options)

    vertx.setTimer(1_000 * 60) {
      // run for max 1 minute
      vertx.close()
      LOG.info("And... it's gone!")
    }

    deployVerticle(vertx, HttpServer::class.java.name)
  }

  private fun deployVerticle(vertx: Vertx, verticleClassName: String) =
      vertx.deployVerticle(verticleClassName) { deployResult ->
        if (deployResult.failed())
          LOG.error("Error deploying {}", verticleClassName, deployResult.cause())
      }
}