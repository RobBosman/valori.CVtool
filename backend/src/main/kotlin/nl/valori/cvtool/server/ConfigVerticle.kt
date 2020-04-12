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

const val ADDRESS_FETCH = "fetch"
const val ADDRESS_SAVE = "save"

internal class ConfigVerticle : AbstractVerticle() {

  private val verticlesToDeploy = listOf(
      HttpServerVerticle::class,
      AuthVerticle::class,
      CvVerticle::class,
      HeartbeatVerticle::class)

  private val storageVerticles = mapOf(
      "mongodb" to listOf(MongoFetchVerticle::class, MongoSaveVerticle::class))

  override fun start(future: Future<Void>) {
    ConfigRetriever.create(
        vertx,
        ConfigRetrieverOptions()
            .addStore(ConfigStoreOptions()
                .setType("file")
                .setConfig(JsonObject().put("path", "config.json"))))
        .getConfig { config ->
          val configJson = config.result()

          val deploymentOptions = DeploymentOptions()
              .setConfig(configJson)
          verticlesToDeploy
              .forEach { Main.deployVerticle(vertx, it.java.name, deploymentOptions) }

          deployStorageVerticles(configJson)
        }
  }

  private fun deployStorageVerticles(configJson: JsonObject) {
    val dataSource = configJson.getString("dataSource")

    val verticlesToDeploy = storageVerticles[dataSource]
    if (verticlesToDeploy === null)
      throw UnsupportedOperationException("Unknown database configured '$dataSource'")

    configJson
        .getJsonObject(dataSource)
        .put("fetchAddress", ADDRESS_FETCH)
        .put("saveAddress", ADDRESS_SAVE)
    val deploymentOptions = DeploymentOptions().setConfig(configJson)

    verticlesToDeploy
        .forEach { Main.deployVerticle(vertx, it.java.name, deploymentOptions) }
  }
}