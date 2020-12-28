package nl.valori.cvtool.backend

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.ext.bridge.BridgeEventType.PUBLISH
import io.vertx.ext.bridge.BridgeEventType.SEND
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler
import nl.valori.cvtool.backend.authorization.AUTHENTICATE_ADDRESS
import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Authorizer
import nl.valori.cvtool.backend.cv.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.backend.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.backend.cv.CV_GENERATE_ADDRESS
import nl.valori.cvtool.backend.cv.CV_SEARCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory

internal object EventBusMessageHandler {

  private val log = LoggerFactory.getLogger(EventBusMessageHandler::class.java)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

  internal fun create(vertx: Vertx) =
      SockJSHandler.create(vertx).bridge(createBridgeOptions()) { authHandler(vertx, it) }

  private fun createBridgeOptions() =
      SockJSBridgeOptions()
          .addInboundPermitted(PermittedOptions().setAddress(AUTH_INFO_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_GENERATE_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(CV_SEARCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(ACCOUNT_DELETE_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(MONGODB_FETCH_ADDRESS))
          .addInboundPermitted(PermittedOptions().setAddress(MONGODB_SAVE_ADDRESS))

  private fun authHandler(vertx: Vertx, bridgeEvent: BridgeEvent) {
    when (bridgeEvent.type()) {
      SEND, PUBLISH -> {
        Single
            .just(bridgeEvent)
            .flatMap { authenticate(vertx, it) }
            .flatMap { addAuthInfo(vertx, it) }
            .flatMap { authorize(vertx, bridgeEvent, it) }
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
  private fun authenticate(vertx: Vertx, bridgeEvent: BridgeEvent): Single<AuthInfo> {
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
   * When successfully authenticated, the user's authorization.level will be added to {@code authInfo}.
   */
  private fun addAuthInfo(vertx: Vertx, authInfo: AuthInfo) =
      vertx
          .eventBus()
          .rxRequest<JsonObject>(AUTH_INFO_FETCH_ADDRESS, authInfo.toJson(), deliveryOptions)
          .map {
            AuthInfo.fromJson(it.body())
          }

  private fun authorize(vertx: Vertx, bridgeEvent: BridgeEvent, authInfo: AuthInfo): Single<AuthInfo> {
    val address = bridgeEvent.rawMessage.getString("address")
    val messageBody = bridgeEvent.rawMessage.getValue("body")
    // Check if this message intends to delete any data.
    if (address == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
      val dataToBeDeleted = Authorizer.determineDataToBeDeleted(messageBody)
      if (dataToBeDeleted.isNotEmpty()) {
        // If so, then fetch dat data-to-be-deleted and add it to the message that is used for authorization.
        // NB: The original message body remains untouched!
        return fetchToBeDeletedData(vertx, dataToBeDeleted)
            .map { replaceEntityInstances(messageBody, dataToBeDeleted, it) }
            .doOnSuccess { toBeAuthorizedMessage ->
              // Only authorize if the message still contains anything to save.
              if (toBeAuthorizedMessage.map.values
                      .filterIsInstance<Map<*, *>>()
                      .any { it.isNotEmpty() }) {
                Authorizer.authorize(address, toBeAuthorizedMessage, authInfo)
              }
            }
            .map { authInfo }
      }
    }
    return Single.just(messageBody)
        .doOnSuccess { Authorizer.authorize(address, it, authInfo) }
        .map { authInfo }
  }

  /**
   * input:
   * {
   *   skill: {
   *     skill-1-to-be-deleted: {},
   *     skill-2: {
   *       _id: skill-2,
   *       cvId: cd-id-of-skill
   *       key: value
   *     }
   *   }
   * }
   *
   * output:
   * {
   *   skill: [{ _id: skill-1-to-be-deleted }]
   * }
   */
  private fun fetchToBeDeletedData(vertx: Vertx, dataToBeDeleted: Map<String, List<String>>): Single<JsonObject> {
    val queryForDataToBeDeleted = dataToBeDeleted
        .map { (entityName, instanceIds) ->
          entityName to JsonArray(instanceIds.map { JsonObject().put("_id", it) })
        }
        .toMap()
    return vertx
        .eventBus()
        .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, JsonObject(queryForDataToBeDeleted), deliveryOptions)
        .map { it.body() }
  }

  internal fun replaceEntityInstances(
      sourceEntities: JsonObject,
      dataToBeDeleted: Map<String, List<String>>,
      replacementEntities: JsonObject): JsonObject {

    // Compose a message body without the instances-to-be-removed and then add the fetched instances to that message.
    // First remove all references to data that must be deleted.
    val resultEntities = JsonObject(sourceEntities.encode())
    dataToBeDeleted.entries
        .forEach { (entityName, instanceIdsToBeDeleted) ->
          val resultEntity = resultEntities.getJsonObject(entityName)
          instanceIdsToBeDeleted
              .forEach { instanceIdToBeDeleted -> resultEntity.remove(instanceIdToBeDeleted) }
        }

    // Now add the fetched (to-be-deleted) instances.
    replacementEntities.map.entries
        .forEach { (entityName, instances) ->
          val resultEntity = resultEntities.getJsonObject(entityName)
          ModelUtils.toJsonObject(instances)
              ?.forEach { (instanceId, instance) -> resultEntity.put(instanceId, instance) }
        }
    return resultEntities
  }
}