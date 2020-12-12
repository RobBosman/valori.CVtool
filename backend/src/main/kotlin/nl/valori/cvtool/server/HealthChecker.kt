package nl.valori.cvtool.server

import io.vertx.core.json.JsonObject
import io.vertx.ext.healthchecks.Status
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.healthchecks.HealthCheckHandler
import nl.valori.cvtool.server.authorization.AuthenticateVerticle
import nl.valori.cvtool.server.persistence.MongoConnection

internal object HealthChecker {

  fun getHandler(vertx: Vertx): HealthCheckHandler =
      HealthCheckHandler.create(vertx)
          .register("health-check", 2000) { healthStatus ->
            val verticlesNotUp = Main.verticleDeploymentStates
                .filter { (_, state) -> state != "UP" }
            if (verticlesNotUp.isEmpty()) {
              healthStatus.complete(Status.OK())
            } else {
              // Not all verticles are properly started.
              val details = JsonObject()
              verticlesNotUp.forEach { (verticleClass, state) -> details.put(verticleClass.simpleName, state) }
              healthStatus.complete(Status.KO(details))
            }
          }

  // TODO: activate improved health-check.
  fun getHandler(vertx: Vertx, config: JsonObject): HealthCheckHandler =
      HealthCheckHandler.create(vertx)

          // Check if all verticles are running.
          .register("Verticles", 2000) { healthStatus ->
            val verticlesNotUp = Main.verticleDeploymentStates
                .filter { (_, state) -> state != "UP" }
            if (verticlesNotUp.isEmpty()) {
              healthStatus.complete(Status.OK())
            } else {
              // Not all verticles are properly started.
              val details = JsonObject()
              verticlesNotUp.forEach { (verticleClass, state) -> details.put(verticleClass.simpleName, state) }
              healthStatus.complete(Status.KO(details))
            }
          }

          // Check if the OpenId provider is up and running.
          .register("OpenID", 2000) { healthStatus ->
            AuthenticateVerticle.checkConnection(vertx, config)
                .subscribe(
                    { healthStatus.tryComplete(Status.OK()) },
                    { healthStatus.tryComplete(Status.KO(JsonObject().put("error", it.message))) })
          }

          // Chek if MongoDB is up and running.
          .register("MongoDB", 2000) { healthStatus ->
            MongoConnection.checkConnection(config)
                .subscribe(
                    { healthStatus.tryComplete(Status.OK()) },
                    { healthStatus.tryComplete(Status.KO(JsonObject().put("error", it.message))) })
          }
}