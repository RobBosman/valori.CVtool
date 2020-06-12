package nl.valori.cvtool.server

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.mongodb.MongoFetchVerticle
import nl.valori.cvtool.server.mongodb.MongoSaveVerticle
import org.slf4j.LoggerFactory

fun main() = Main.run()

object Main {

  private val log = LoggerFactory.getLogger(javaClass)
  private val verticlesToDeploy = listOf(
      HttpServerVerticle::class,
      AuthVerticle::class,
      CvVerticle::class,
      HeartbeatVerticle::class,
      MongoFetchVerticle::class,
      MongoSaveVerticle::class)

  fun run() {
    val options = VertxOptions()
    // allow blocking threads for max 10 minutes (for debugging)
    if (log.isDebugEnabled)
      options.blockedThreadCheckInterval = 1_000 * 60 * 10

    val vertx = Vertx.vertx(options)
    ConfigRetriever.create(
        vertx,
        ConfigRetrieverOptions()
            .addStore(ConfigStoreOptions()
                .setType("env")
                .setConfig(JsonObject())))
        .getConfig { config ->
          val deploymentOptions = DeploymentOptions().setConfig(config.result())
          verticlesToDeploy
              .forEach { deployVerticle(vertx, it.java.name, deploymentOptions) }
        }

    // run server for max 10 minutes
//    if (log.isDebugEnabled)
//      vertx.setTimer(1_000 * 60 * 10) {
//        vertx.close()
//        log.info("And... it's gone!")
//      }
  }

  private fun deployVerticle(vertx: Vertx, verticleClassName: String, deploymentOptions: DeploymentOptions) =
      vertx.deployVerticle(verticleClassName, deploymentOptions) { deploymentResult ->
        if (deploymentResult.failed())
          log.error("Error deploying $verticleClassName", deploymentResult.cause())
      }
}