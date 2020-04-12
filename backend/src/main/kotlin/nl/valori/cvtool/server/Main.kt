package nl.valori.cvtool.server

import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import org.slf4j.LoggerFactory

fun main() = Main.run()

object Main {

  private val log = LoggerFactory.getLogger(javaClass)

  fun run() {
    val options = VertxOptions()
    // allow blocking threads for max 10 minutes (for debugging)
    if (log.isDebugEnabled)
      options.blockedThreadCheckInterval = 1_000 * 60 * 10

    deployVerticle(Vertx.vertx(options), ConfigVerticle::class.java.name, DeploymentOptions())

    // run server for max 10 minutes
//    if (log.isDebugEnabled)
//      vertx.setTimer(1_000 * 60 * 10) {
//        vertx.close()
//        log.info("And... it's gone!")
//      }


//    vertx.setTimer(1_000 * 5) {
//      log.info("Insert a test message into MongoDB...")
//      val dataJson = JsonObject()
//          .put("dummy", JsonObject()
//              .put("content", "gibberish"))
//      vertx.eventBus()
//          .request<JsonObject>(ADDRESS_SAFE_SET, dataJson) { response ->
//            if (response.failed())
//              throw response.cause()
//
//            val idJson = response.result().body()
//            vertx.eventBus()
//                .request<JsonObject>(ADDRESS_SAFE_GET, idJson) { response2 ->
//                  if (response2.failed())
//                    throw response2.cause()
//                  log.info("Got something from MongoDB: {}", response2.result().body())
//                }
//          }
//    }
  }

  fun deployVerticle(vertx: Vertx, verticleClassName: String, deploymentOptions: DeploymentOptions) =
      vertx.deployVerticle(verticleClassName, deploymentOptions) { deploymentResult ->
        if (deploymentResult.failed())
          log.error("Error deploying $verticleClassName", deploymentResult.cause())
      }
}