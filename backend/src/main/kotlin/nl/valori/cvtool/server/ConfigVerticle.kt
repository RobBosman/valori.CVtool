package nl.valori.cvtool.server

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.AbstractVerticle
import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.mongodb.MongoFetchVerticle
import nl.valori.cvtool.server.mongodb.MongoSaveVerticle

internal class ConfigVerticle : AbstractVerticle() {

  private val verticlesToDeploy = listOf(
      HttpServerVerticle::class,
      AuthVerticle::class,
      StorageVerticle::class,
      MongoFetchVerticle::class,
      MongoSaveVerticle::class,
      CvVerticle::class,
      HeartbeatVerticle::class)

  override fun start(future: Future<Void>) {
    ConfigRetriever.create(
        vertx,
        ConfigRetrieverOptions()
            .addStore(ConfigStoreOptions()
                .setType("file")
                .setConfig(JsonObject().put("path", "config.json"))))
        .getConfig { configJson ->
          val deploymentOptions = DeploymentOptions()
              .setConfig(configJson.result())
          verticlesToDeploy
              .forEach { Main.deployVerticle(vertx, it.java.name, deploymentOptions) }
        }
  }
}