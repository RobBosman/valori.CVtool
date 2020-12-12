package nl.valori.cvtool.server

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import nl.valori.cvtool.server.authorization.AuthInfoFetchVerticle
import nl.valori.cvtool.server.authorization.AuthenticateVerticle
import nl.valori.cvtool.server.cv.AccountDeleteVerticle
import nl.valori.cvtool.server.cv.CvFetchVerticle
import nl.valori.cvtool.server.cv.CvGenerateVerticle
import nl.valori.cvtool.server.persistence.MongodbFetchVerticle
import nl.valori.cvtool.server.persistence.MongodbSaveVerticle
import org.slf4j.LoggerFactory
import kotlin.reflect.KClass

fun main() = Main.run()

object Main {

  private val log = LoggerFactory.getLogger(javaClass)
  private val verticlesToDeploy = listOf(
      HttpRedirectVerticle::class,
      HttpsServerVerticle::class,
      AuthenticateVerticle::class,
      MongodbFetchVerticle::class,
      MongodbSaveVerticle::class,
      AuthInfoFetchVerticle::class,
      CvFetchVerticle::class,
      CvGenerateVerticle::class,
      AccountDeleteVerticle::class)
  val verticleDeploymentStates = verticlesToDeploy
      .map { it to "not started" }
      .toMap()
      .toMutableMap()

  fun run() {
    val options = VertxOptions()
    if (log.isDebugEnabled)
      options.blockedThreadCheckInterval = 1_000 * 60 * 10 // allow blocking threads for max 10 minutes (for debugging)

    val vertx = Vertx.vertx(options)
    ConfigRetriever
        .create(
            vertx,
            ConfigRetrieverOptions()
                .addStore(ConfigStoreOptions()
                    .setType("env")
                    .setConfig(JsonObject())
                )
        )
        .getConfig { config ->
          val deploymentOptions = DeploymentOptions().setConfig(config.result())
          verticlesToDeploy
              .forEach { deployVerticle(vertx, it, deploymentOptions) }
        }
  }

  private fun deployVerticle(vertx: Vertx, verticleClass: KClass<out AbstractVerticle>, deploymentOptions: DeploymentOptions) =
      vertx.deployVerticle(verticleClass.java.name, deploymentOptions) { deploymentResult ->
        if (deploymentResult.succeeded()) {
          verticleDeploymentStates[verticleClass] = "UP"
        } else {
          verticleDeploymentStates[verticleClass] = deploymentResult.cause().message ?: "UNKNOWN ERROR"
          log.error("Error deploying ${verticleClass.simpleName}", deploymentResult.cause())
        }
      }
}