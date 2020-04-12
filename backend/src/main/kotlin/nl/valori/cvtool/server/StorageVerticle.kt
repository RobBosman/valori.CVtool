package nl.valori.cvtool.server

import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import nl.valori.cvtool.server.mongodb.MongoFetchVerticle
import nl.valori.cvtool.server.mongodb.MongoSaveVerticle
import org.slf4j.LoggerFactory

const val ADDRESS_FETCH = "fetch"
const val ADDRESS_SAVE = "save"

internal class StorageVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val verticleClassMap = mapOf(
      "mongodb" to listOf(MongoFetchVerticle::class, MongoSaveVerticle::class))
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(future: Future<Void>) {
    val dataSource = config().getJsonObject("dataSource")

    val verticlesToDeploy = verticleClassMap[dataSource.getString("database")]
    if (verticlesToDeploy === null)
      throw UnsupportedOperationException("Unknown database configured '${dataSource.getString("database")}'")

    val deploymentOptions = DeploymentOptions().setConfig(config())
    verticlesToDeploy
        .forEach { Main.deployVerticle(vertx.delegate, it.java.name, deploymentOptions) }

    consumeMessages(ADDRESS_FETCH, dataSource.getString("fetchAddress"))
    consumeMessages(ADDRESS_SAVE, dataSource.getString("saveAddress"))
  }

  private fun consumeMessages(address: String, delegateAddress: String) {
    vertx.eventBus()
        .consumer<JsonObject>(address)
        .toObservable()
        .subscribe(
            {
              delegate(it, delegateAddress)
            },
            {
              log.error("Vertx error", it)
            })
  }

  private fun delegate(requestMessage: Message<JsonObject>, delegateAddress: String) {
    vertx.eventBus()
        .rxRequest<JsonObject>(delegateAddress, requestMessage.body(), deliveryOptions)
        .map { it.body() }
        .subscribe(
            {
              log.debug("Replying delegate response to requester")
              requestMessage.reply(it)
            },
            {
              log.warn("Error fetching data", it)
              requestMessage.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), it.message)
            })
  }
}