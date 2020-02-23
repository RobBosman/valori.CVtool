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

  override fun start(future: Future<Void>) {
    ConfigRetriever.create(vertx,
        ConfigRetrieverOptions()
            .addStore(ConfigStoreOptions()
                .setType("file")
                .setConfig(JsonObject().put("path", "config.json"))))
        .getConfig { json ->
          val options = DeploymentOptions()
              .setConfig(json.result())

          deployVerticle(vertx, StorageVerticle::class.java.name, options)
          deployVerticle(vertx, HttpServerVerticle::class.java.name, options)
          deployVerticle(vertx, HeartbeatVerticle::class.java.name, options)
        }
  }

  private fun deployVerticle(vertx: Vertx, verticleClassName: String, options: DeploymentOptions) =
      vertx.deployVerticle(verticleClassName, options) { deployResult ->
        if (deployResult.failed())
          log.error("Error deploying {}", verticleClassName, deployResult.cause())
      }
}