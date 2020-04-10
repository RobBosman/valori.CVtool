package nl.valori.cvtool.server

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.AbstractVerticle
import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.Vertx
import io.vertx.core.json.JsonObject
import org.slf4j.LoggerFactory

internal class ConfigVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val verticlesToDeploy = listOf(
      HttpServerVerticle::class,
      AuthVerticle::class,
      StorageVerticle::class,
      CvVerticle::class,
      HeartbeatVerticle::class)

  override fun start(future: Future<Void>) {
    ConfigRetriever.create(
        vertx,
        ConfigRetrieverOptions()
            .addStore(ConfigStoreOptions()
                .setType("file")
                .setConfig(JsonObject().put("path", "config.json"))))
        .getConfig { json ->
          val deploymentOptions = DeploymentOptions()
              .setConfig(json.result())
          verticlesToDeploy
              .forEach { deployVerticle(vertx, it.java.name, deploymentOptions) }
        }
  }

  private fun deployVerticle(vertx: Vertx, verticleClassName: String, deploymentOptions: DeploymentOptions) =
      vertx.deployVerticle(verticleClassName, deploymentOptions) { deploymentResult ->
        if (deploymentResult.failed())
          log.error("Error deploying {}", verticleClassName, deploymentResult.cause())
      }
}