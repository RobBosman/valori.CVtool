package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.buffer.Buffer.buffer
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.http.HttpServerOptions
import io.vertx.core.json.JsonObject
import io.vertx.core.net.PemKeyCertOptions
import io.vertx.ext.bridge.BridgeEventType.PUBLISH
import io.vertx.ext.bridge.BridgeEventType.SEND
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.handler.StaticHandler
import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.authorization.AUTHENTICATE_ADDRESS
import nl.valori.cvtool.server.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.server.authorization.AuthInfo
import nl.valori.cvtool.server.authorization.Authorizer
import nl.valori.cvtool.server.authorization.Authorizer.createQueryForDataToBeDeleted
import nl.valori.cvtool.server.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.server.cv.CV_GENERATE_ADDRESS
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.net.URL

internal class HttpsServerVerticle : AbstractVerticle() {

  companion object {
    private fun loadCert(resourceName: String) =
        buffer(HttpsServerVerticle::class.java.getResource(resourceName).readText())

    internal val sslCert = loadCert("/ssl/localhost-fullchain.pem")
    internal val sslKey = loadCert("/ssl/localhost-privkey.pem")

    private val log = LoggerFactory.getLogger(HttpsServerVerticle::class.java)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)
  }

  override fun start(startPromise: Promise<Void>) {
    // Environment variable:
    //   HTTPS_CONNECTION_STRING=https://<HOST_NAME>:443/?<SSL_KEY_PATH>:<SSL_CERT_PATH>
    //   HTTPS_CONNECTION_STRING=https://www.example.com:443/?/ssl_certs/privkey1.pem:/ssl_certs/fullchain1.pem
    val connectionString = config().getString("HTTPS_CONNECTION_STRING")
    val httpsConfig = URL(connectionString)
    if (httpsConfig.protocol != "https")
      throw IllegalArgumentException("Invalid protocol: expected 'https' but found '${httpsConfig.protocol}'.")
    val httpsPort = if (httpsConfig.port > 0) httpsConfig.port else httpsConfig.defaultPort

    getPemKeyCertOptions(httpsConfig)
        .subscribe(
            { pemKeyCertOptions ->
              vertx
                  .createHttpServer(HttpServerOptions()
                      .setCompressionSupported(true)
                      .setPort(httpsPort)
                      .setSsl(true)
                      .setPemKeyCertOptions(pemKeyCertOptions)
                  )
                  .requestHandler(createRouter())
                  .listen { result ->
                    if (result.succeeded()) {
                      startPromise.complete()
                      log.info("Listening on https://${httpsConfig.authority}/")
                    } else {
                      log.error("Error starting server on https://${httpsConfig.authority}/")
                      startPromise.fail(result.cause())
                    }
                  }
            },
            {
              log.error("Error loading SSL certificates")
              startPromise.fail(it)
            }
        )
  }

  private fun getPemKeyCertOptions(httpsConfig: URL): Single<PemKeyCertOptions> {
    val pemSslPaths = (httpsConfig.query ?: ":").split(":")
    val keyPath = pemSslPaths[0]
    val certPath = pemSslPaths[1]

    return vertx.fileSystem().rxReadFile(keyPath)
        .zipWith(vertx.fileSystem().rxReadFile(certPath)) { key, cert ->
          PemKeyCertOptions()
              .setKeyValue(key.delegate)
              .setCertValue(cert.delegate)
        }
        .onErrorReturn {
          log.warn("Error loading SSL certificates (${it.message}). Using fallback SSL certificates.")
          PemKeyCertOptions()
              .setKeyValue(sslKey)
              .setCertValue(sslCert)
        }
  }

  private fun createRouter(): Router {
    val router = Router.router(vertx)
    router
        .get("/health*")
        .handler(HealthChecker.getHandler(vertx))
    router
        .get("/.well-known/acme-challenge/*") // Used by letsencrypt to renew SSL certificates.
        .handler(StaticHandler.create()
            .setAllowRootFileSystemAccess(true)
            .setWebRoot("/webroot/.well-known/acme-challenge")
        )
    router
        .mountSubRouter("/eventbus",
            SockJSHandler.create(vertx).bridge(createBridgeOptions(), ::authHandler)
        )
    router
        .route("/*")
        .handler(StaticHandler.create()
            .setWebRoot("frontend/dist")
        )
    return router
  }

  private fun createBridgeOptions() =
      SockJSBridgeOptions()
          .addInboundPermitted(PermittedOptions().setAddress(AUTH_INFO_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_GENERATE_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(MONGODB_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(MONGODB_SAVE_ADDRESS))

  private fun authHandler(bridgeEvent: BridgeEvent) {
    when (bridgeEvent.type()) {
      SEND, PUBLISH -> {
        Single
            .just(bridgeEvent)
            .flatMap(::authenticate)
            .flatMap(::addAuthInfo)
            .flatMap { authorize(bridgeEvent, it) }
            .subscribe(
                {
                  bridgeEvent.complete(true)
                },
                {
                  log.debug("Event bridge message was not authenticated: ${it.message}")
                  bridgeEvent.complete(false)
                }
            )
      }
      else -> bridgeEvent.complete(true)
    }
  }

  /**
   * When successfully authenticated, a header will be added containing the user's email and name.
   */
  private fun authenticate(bridgeEvent: BridgeEvent): Single<AuthInfo> {
    val jwt = bridgeEvent.rawMessage
        ?.getJsonObject("headers")
        ?.getString("Authorization")
        ?.substringAfter("Bearer ")
        ?: throw IllegalArgumentException("Cannot obtain 'Bearer' token from Authorization header.")
    return vertx
        .eventBus()
        .rxRequest<JsonObject>(AUTHENTICATE_ADDRESS, JsonObject().put("jwt", jwt), deliveryOptions)
        .map {
          AuthInfo(
              it.body().getString("email"),
              it.body().getString("name"))
        }
  }

  /**
   * When successfully authenticated, the user's roles will be added to the 'Auth' header.
   */
  private fun addAuthInfo(authInfo: AuthInfo) =
      vertx
          .eventBus()
          .rxRequest<JsonObject>(AUTH_INFO_FETCH_ADDRESS, authInfo.toJson(), deliveryOptions)
          .map {
            AuthInfo.fromJson(it.body())
          }

  private fun authorize(bridgeEvent: BridgeEvent, authInfo: AuthInfo): Single<AuthInfo> {
    val address = bridgeEvent.rawMessage.getString("address")
    val messageBody = bridgeEvent.rawMessage.getValue("body")
    // Check if this message intends to delete any data.
    if (address == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
      val query = createQueryForDataToBeDeleted(messageBody)
      if (query.isNotEmpty()) {
        // If so, then fetch dat data-to-be-deleted and add it to the message that is used for authorization.
        // NB: The original message body remains untouched!
        return fetchToBeDeletedData(JsonObject(query))
            .map { replaceEntityInstances(messageBody, it) }
            .doOnSuccess { Authorizer.authorize(address, it, authInfo) }
            .map { authInfo }
      }
    }
    return Single.just(messageBody)
        .doOnSuccess { Authorizer.authorize(address, it, authInfo) }
        .map { authInfo }
  }

  private fun fetchToBeDeletedData(queryForDataToBeDeleted: JsonObject) =
      vertx
          .eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, queryForDataToBeDeleted, deliveryOptions)
          .map { it.body() }

  internal fun replaceEntityInstances(sourceEntities: JsonObject, replacementEntities: JsonObject): JsonObject {
    if (replacementEntities.map.isEmpty())
      return sourceEntities

    val resultEntities = JsonObject(sourceEntities.encode())
    replacementEntities.map.entries
        .forEach { (entityName, instances) ->
          val resultEntity = resultEntities.getJsonObject(entityName)
          toJsonObject(instances)
              ?.forEach { (instanceId, instance) -> resultEntity.put(instanceId, instance) }
        }
    return resultEntities
  }
}