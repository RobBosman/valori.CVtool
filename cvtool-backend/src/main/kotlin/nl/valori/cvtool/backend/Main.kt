package nl.valori.cvtool.backend

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.DeploymentOptions
import io.vertx.core.ThreadingModel.WORKER
import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import nl.valori.cvtool.backend.authorization.AuthInfoFetchVerticle
import nl.valori.cvtool.backend.authorization.AuthenticateVerticle
import nl.valori.cvtool.backend.cv.CvBackupVerticle
import nl.valori.cvtool.backend.cv.CvDownloadDemoVerticle
import nl.valori.cvtool.backend.cv.CvFetchVerticle
import nl.valori.cvtool.backend.cv.CvGenerateVerticle
import nl.valori.cvtool.backend.cv.CvHistoryVerticle
import nl.valori.cvtool.backend.cv.CvSearchVerticle
import nl.valori.cvtool.backend.persistence.AccountDeleteVerticle
import nl.valori.cvtool.backend.persistence.BrandDeleteVerticle
import nl.valori.cvtool.backend.persistence.MongodbFetchVerticle
import nl.valori.cvtool.backend.persistence.MongodbSaveVerticle
import nl.valori.cvtool.backend.system.ControlVerticle
import org.slf4j.LoggerFactory
import java.util.concurrent.TimeUnit.MILLISECONDS
import kotlin.reflect.KClass

fun main() {
    System.setProperty("slf4j.internal.verbosity", "WARN")
    Main.run()
}

object Main {

    private val log = LoggerFactory.getLogger(javaClass)
    private val verticlesToDeploy = listOf(
        CvGenerateVerticle::class,
        ControlVerticle::class,
        HttpServerVerticle::class,
        AuthenticateVerticle::class,
        MongodbFetchVerticle::class,
        MongodbSaveVerticle::class,
        AuthInfoFetchVerticle::class,
        AccountDeleteVerticle::class,
        BrandDeleteVerticle::class,
        CvFetchVerticle::class,
        CvSearchVerticle::class,
        CvBackupVerticle::class,
        CvHistoryVerticle::class,
        CvDownloadDemoVerticle::class
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
            .config
            .await(5_000, MILLISECONDS)
            .let { jsonConfig ->
                val deploymentOptions = DeploymentOptions()
                    .setConfig(jsonConfig)
                    .setThreadingModel(WORKER)
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
        vertx
            .deployVerticle(verticleClass.java.name, deploymentOptions)
            .onComplete { deploymentResult ->
                if (deploymentResult.succeeded()) {
                    verticleDeploymentStates[verticleClass] = "UP"
                    if (verticleDeploymentStates.filterValues { it != "UP" }.isEmpty()) {
                        log.info("Successfully started all verticles")
                    }
                } else {
                    verticleDeploymentStates[verticleClass] = deploymentResult.cause().message ?: "UNKNOWN ERROR"
                    log.error("Error deploying ${verticleClass.simpleName}: ${deploymentResult.cause().message}")
                }
            }
}