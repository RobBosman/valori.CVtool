package nl.valori.cvtool.backend.system

import io.vertx.core.json.JsonObject
import io.vertx.ext.healthchecks.Status
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.healthchecks.HealthCheckHandler
import nl.valori.cvtool.backend.Main
import nl.valori.cvtool.backend.authorization.AuthenticateVerticle
import nl.valori.cvtool.backend.persistence.MongoConnection
import org.slf4j.LoggerFactory

internal object HealthChecker {

    private val log = LoggerFactory.getLogger(javaClass)

    fun getHandler(vertx: Vertx, config: JsonObject): HealthCheckHandler =
        HealthCheckHandler
            .create(vertx)

            // Check if all verticles are running.
            .register("Verticles", 500) { healthStatus ->
                val verticlesNotUp = Main.verticleDeploymentStates.filter { (_, state) -> state != "UP" }
                if (verticlesNotUp.isEmpty()) {
                    healthStatus.complete(Status.OK())
                } else {
                    // Not all verticles are properly started.
                    val details = JsonObject()
                    verticlesNotUp.forEach { (verticleClass, state) -> details.put(verticleClass.simpleName, state) }
                    log.warn("Not all verticles are properly started. ${details.encode()}")
                    healthStatus.complete(Status.KO(details))
                }
            }

            // Check if the OpenId provider is up and running.
            .register("OpenID") { healthStatus ->
                AuthenticateVerticle
                    .checkConnection(vertx, config)
                    .subscribe(
                        { healthStatus.complete(Status.OK()) },
                        {
                            log.warn("OpenID provider is not available.", it)
                            healthStatus.complete(Status.KO(JsonObject().put("error", it.message)))
                        })
            }

            // Chek if MongoDB is up and running.
            .register("MongoDB") { healthStatus ->
                MongoConnection
                    .connectToDatabase(config)
                    .subscribe(
                        { healthStatus.complete(Status.OK()) },
                        {
                            log.warn("MongoDB is not available.", it)
                            healthStatus.tryComplete(Status.KO(JsonObject().put("error", it.message)))
                        })
            }
}