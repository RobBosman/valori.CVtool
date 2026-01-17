package nl.bransom.cvtool.backend

import io.vertx.config.ConfigRetriever
import io.vertx.config.ConfigRetrieverOptions
import io.vertx.config.ConfigStoreOptions
import io.vertx.core.DeploymentOptions
import io.vertx.core.ThreadingModel.WORKER
import io.vertx.core.Vertx
import io.vertx.core.VertxOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import org.slf4j.LoggerFactory
import java.util.concurrent.TimeUnit.MILLISECONDS
import kotlin.reflect.KClass

fun main() {
    System.setProperty("slf4j.internal.verbosity", "WARN")
    _root_ide_package_.nl.bransom.cvtool.backend.Main.run()
}

object Main {

    private val log = LoggerFactory.getLogger(javaClass)
    private val verticlesToDeploy = listOf(
        _root_ide_package_.nl.bransom.cvtool.backend.cv.CvGenerateVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.system.ControlVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.HttpServerVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.authorization.AuthenticateVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.persistence.MongodbFetchVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.persistence.MongodbSaveVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.authorization.AuthInfoFetchVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.persistence.AccountDeleteVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.persistence.BrandDeleteVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.cv.CvFetchVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.cv.CvSearchVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.cv.CvBackupVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.cv.CvHistoryVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.cv.CvDownloadDemoVerticle::class,
        _root_ide_package_.nl.bransom.cvtool.backend.system.DataConverterVerticle::class
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