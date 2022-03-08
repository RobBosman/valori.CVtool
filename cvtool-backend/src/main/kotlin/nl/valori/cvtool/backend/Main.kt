package nl.valori.cvtool.backend

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import nl.valori.cvtool.backend.authorization.AuthInfoFetchVerticle
import nl.valori.cvtool.backend.authorization.AuthenticateVerticle
import nl.valori.cvtool.backend.cv.CvBackupVerticle
import nl.valori.cvtool.backend.cv.CvFetchVerticle
import nl.valori.cvtool.backend.cv.CvGenerateVerticle
import nl.valori.cvtool.backend.cv.CvHistoryVerticle
import nl.valori.cvtool.backend.cv.CvSearchVerticle
import nl.valori.cvtool.backend.persistence.AccountDeleteVerticle
import nl.valori.cvtool.backend.persistence.MongodbFetchVerticle
import nl.valori.cvtool.backend.persistence.MongodbSaveVerticle
import nl.valori.cvtool.backend.system.ControlVerticle
import org.slf4j.LoggerFactory
import kotlin.reflect.KClass

fun main() = Main.run()

object Main {

    private val log = LoggerFactory.getLogger(javaClass)
    private val verticlesToDeploy = listOf(
        CvGenerateVerticle::class, // Start with this one because it takes some time to initialize all XSL-stuff.
        ControlVerticle::class,
        HttpServerVerticle::class,
        AuthenticateVerticle::class,
        MongodbFetchVerticle::class,
        MongodbSaveVerticle::class,
        AuthInfoFetchVerticle::class,
        AccountDeleteVerticle::class,
        CvFetchVerticle::class,
        CvSearchVerticle::class,
        CvBackupVerticle::class,
        CvHistoryVerticle::class
    )
    val verticleDeploymentStates = verticlesToDeploy
        .associateWith { "not started" }
        .toMutableMap()

    fun run() {
        val options = VertxOptions()
        if (log.isDebugEnabled) {
            // Allow blocking threads for max 10 minutes for debugging.
            options.blockedThreadCheckInterval = 600_000L
        }
        val vertx = Vertx.vertx(options)

        ConfigRetriever
            .create(
                vertx, ConfigRetrieverOptions()
                    .addStore(
                        ConfigStoreOptions()
                            .setType("env")
                            .setConfig(JsonObject())
                    )
            )
            .getConfig { config ->
                val deploymentOptions = DeploymentOptions()
                    .setConfig(config.result())
                    .setWorker(true)
                verticlesToDeploy
                    .forEach {
                        deployVerticle(vertx, it, deploymentOptions)
                    }
            }
    }

    private fun deployVerticle(
        vertx: Vertx,
        verticleClass: KClass<out AbstractVerticle>,
        deploymentOptions: DeploymentOptions
    ) =
        vertx.deployVerticle(verticleClass.java.name, deploymentOptions) { deploymentResult ->
            if (deploymentResult.succeeded()) {
                verticleDeploymentStates[verticleClass] = "UP"
                if (verticleDeploymentStates.filterValues { it != "UP" }.isEmpty()) {
                    log.info("Successfully started all verticles")
                }
            } else {
                verticleDeploymentStates[verticleClass] = deploymentResult.cause().message ?: "UNKNOWN ERROR"
                log.error("Error deploying ${verticleClass.simpleName}", deploymentResult.cause())
            }
        }
}