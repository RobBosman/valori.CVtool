package nl.valori.cvtool.backend.system

import io.vertx.core.json.JsonObject
import io.vertx.ext.healthchecks.Status
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.healthchecks.HealthCheckHandler
import nl.valori.cvtool.backend.Main
import nl.valori.cvtool.backend.authorization.AUTHENTICATE_HEALTH_ADDRESS
import nl.valori.cvtool.backend.persistence.MongoConnection
import org.slf4j.LoggerFactory
import java.util.concurrent.atomic.AtomicLong

internal object HealthChecker {

    private val log = LoggerFactory.getLogger(javaClass)
    private val openIDUnhealthyStreak = AtomicLong(0)

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

            // Check if MongoDB is up and running.
            .register("MongoDB", 5_000) { healthStatus ->
                MongoConnection
                    .connectToDatabase(config)
                    .subscribe(
                        {
                            healthStatus.tryComplete(Status.OK())
                        },
                        {
                            log.warn("MongoDB is not available: ${it.message}")
                            healthStatus.tryComplete(Status.KO(JsonObject().put("error", it.message)))
                        })
            }

            // Check if the OpenID provider is up and running.
            .register("OpenID", 5_000) { healthStatus ->
                vertx.eventBus()
                    .rxRequest<JsonObject>(AUTHENTICATE_HEALTH_ADDRESS, null)
                    .map { "" } // Convert Single<User> to Single<String>.
                    .doOnSuccess { openIDUnhealthyStreak.set(0) }
                    .onErrorReturn {
                        // Suppress the first 30 errors (=30 minutes), to give the system time to recover.
                        if (openIDUnhealthyStreak.addAndGet(1) < 30) {
                            log.info("Suppressing OpenID error #${openIDUnhealthyStreak.get()}")
                            it.message
                        } else
                            throw it
                    }
                    .subscribe(
                        {
                            healthStatus.tryComplete(Status.OK())
                        },
                        {
                            log.warn("OpenID provider is not available: ${it.message}", it)
                            healthStatus.tryComplete(Status.KO(JsonObject().put("error", it.message)))
                        })
            }
}