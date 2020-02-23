package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import io.vertx.ext.mongo.MongoClient
import io.vertx.rxjava.core.AbstractVerticle
import org.slf4j.LoggerFactory

const val ADDRESS_CV_DATA_GET = "cv.data.get"
const val ADDRESS_CV_DATA_SET = "cv.data.set"

internal class StorageVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val storageConfig = config().getJsonObject("mongoClient")
    val mongoClient = MongoClient.createShared(vertx.delegate, storageConfig, "DataSourceName")
    handleSaveRequests(mongoClient)
    handleFetchRequests(mongoClient)
  }

  private fun handleSaveRequests(mongoClient: MongoClient) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_CV_DATA_SET)
        .toObservable()
        .map { message ->
          mongoClient.save("spike", message.body()) { result ->
            if (!result.succeeded())
              throw result.cause()
            message.reply(JsonObject().put("_id", result.result()))
          }
        }
        .subscribe(
            { log.info("Saved data") },
            { log.error("Error: {}", it.message, it) })
  }

  private fun handleFetchRequests(mongoClient: MongoClient) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_CV_DATA_GET)
        .toObservable()
        .map { message ->
          mongoClient.findOne("spike", message.body(), null) { result ->
            if (!result.succeeded())
              throw result.cause()
            message.reply(result.result())
          }
        }
        .subscribe(
            { log.info("Fetched data") },
            { log.error("Error: {}", it.message, it) })
  }
}