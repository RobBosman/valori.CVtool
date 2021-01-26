package nl.valori.cvtool.backend.system

import io.reactivex.Single
import io.vertx.core.json.JsonObject
import io.vertx.ext.healthchecks.Status
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.healthchecks.HealthCheckHandler
import nl.valori.cvtool.backend.Main
import nl.valori.cvtool.backend.authorization.AuthenticateVerticle
import nl.valori.cvtool.backend.persistence.MongoConnection
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.ZoneOffset.UTC
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeUnit.MILLISECONDS
import java.util.concurrent.TimeUnit.SECONDS
import java.util.concurrent.atomic.AtomicLong

internal object HealthChecker {

    private val log = LoggerFactory.getLogger(javaClass)
    private val lastSuccessEpochSecond = AtomicLong(getCurrentEpochSecond())

    private fun getCurrentEpochSecond() =
        LocalDateTime.now().toEpochSecond(UTC)

    private fun Single<String>.debounceErrors(maxErrorsOnlyTimeUnits: Long, timeUnit: TimeUnit) =
        this
            .doOnSuccess { lastSuccessEpochSecond.set(getCurrentEpochSecond()) }
            .onErrorReturn {
                val currentEpochSecond = getCurrentEpochSecond()
                val lastSuccessEpochSecond = lastSuccessEpochSecond.get()

                if (currentEpochSecond - lastSuccessEpochSecond > timeUnit.toSeconds(maxErrorsOnlyTimeUnits))
                    throw it

                val message = "This error is ignored for now: ${it.message}"
                log.warn(message)
                message
            }

    fun getHandler(vertx: Vertx, config: JsonObject): HealthCheckHandler =
        HealthCheckHandler
            .create(vertx)

            // Check if all verticles are running.
            .register("Verticles", 2_000) { healthStatus ->
                val verticlesNotUp = Main.verticleDeploymentStates
                    .filter { (_, state) -> state != "UP" }
                if (verticlesNotUp.isEmpty()) {
                    healthStatus.complete(Status.OK())
                } else {
                    // Not all verticles are properly started.
                    val details = JsonObject()
                    verticlesNotUp
                        .forEach { (verticleClass, state) ->
                            details.put(verticleClass.simpleName, state)
                        }
                    log.warn("Not all verticles are up-and-running. ${details.encode()}")
                    healthStatus.complete(Status.KO(details))
                }
            }

            // Chek if MongoDB is up and running.
            .register("MongoDB", 5_000) { healthStatus ->
                MongoConnection
                    .connectToDatabase(config)
                    .timeout(2_000, MILLISECONDS)
                    .subscribe(
                        {
                            healthStatus.complete(Status.OK())
                        },
                        {
                            log.warn("MongoDB is not available.", it)
                            healthStatus.complete(Status.KO(JsonObject().put("error", it.message)))
                        })
            }

            // Check if the OpenID provider is up and running.
            .register("OpenID", 5_000) { healthStatus ->
                AuthenticateVerticle
                    .checkOpenIdConnection()
                    .timeout(2_000, MILLISECONDS)
                    .debounceErrors(90, SECONDS)
                    .subscribe(
                        {
                            healthStatus.complete(Status.OK())
                        },
                        {
                            log.warn("OpenID provider is not available.", it)
                            healthStatus.complete(Status.KO(JsonObject().put("error", it.message)))
                        })
            }
}