package nl.valori.cvtool.server

import io.vertx.ext.healthchecks.Status
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.healthchecks.HealthCheckHandler

internal object HealthChecker {

  fun getHandler(vertx: Vertx): HealthCheckHandler =
      HealthCheckHandler.create(vertx)
          .register("health-check", 2000) {
            it.complete(Status.OK())
          }
}