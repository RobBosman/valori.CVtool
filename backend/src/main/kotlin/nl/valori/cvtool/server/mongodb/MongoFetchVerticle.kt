package nl.valori.cvtool.server.mongodb

import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.vertx.core.Future
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import nl.valori.reactive.RSSubscriberCollector
import org.bson.BsonDocument
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.stream.Collectors.joining

internal class MongoFetchVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val mongoConfig = config().getJsonObject("mongodb")
    val mongoDatabase = MongoClients
        .create("mongodb://${mongoConfig.getString("host")}:${mongoConfig.getLong("port")}")
        .getDatabase(mongoConfig.getString("db_name"))
    val fetchAddress = mongoConfig.getString("fetchAddress")

    vertx.eventBus()
        .consumer<JsonObject>(fetchAddress)
        .toObservable()
        .subscribe(
            {
              handleFetchRequests(it, mongoDatabase)
            },
            {
              log.error("Vertx error", it)
            })
  }

  /**
   * Request message body must be JSON, listing search criteria per entity:
   * <pre>
   *   {
   *     entity_1: [{ _id: "XXX" }, { _id: "YYY" }],
   *     entity_2: [{ _id: "ZZZ" }]
   *   }
   * </pre>
   *
   * Response will be JSON, normalized per entity:
   * <pre>
   *   {
   *     entity_1: {
   *       XXX: {
   *         _id: "XXX",
   *         property: "value"
   *       },
   *       YYY: {
   *         _id: "YYY",
   *         property: "value"
   *       }
   *     },
   *     entity_2: {
   *       ZZZ: {
   *         _id: "ZZZ",
   *         property: "value"
   *       }
   *     }
   *   }
   * </pre>
   */
  private fun handleFetchRequests(message: Message<JsonObject>, mongoDatabase: MongoDatabase) {
    message.body().map.entries.stream()
        .map { (entity, criteriaArray) ->
          if (criteriaArray !is JsonArray) throw IllegalArgumentException("Search criteria must be of type JsonArray")

          val criteria = criteriaArray.encode().substringAfter("[").substringBeforeLast("]")
          log.debug("Vertx fetching '$entity' documents using criteria [$criteria]")
          entity to mongoDatabase
              .getCollection(entity)
              .find(BsonDocument.parse(criteria))
        }
        .collect(RSSubscriberCollector())
        .subscribeAndCollect(
            { fetchedInstances ->
              log.debug("Successfully fetched instances of ${fetchedInstances.size} entities")
              message.reply(composeReplyJson(fetchedInstances))
            },
            {
              val errorMsg = composeErrorMessage(it)
              log.warn(errorMsg)
              message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
            })
  }

  private fun composeReplyJson(fetchedInstances: Map<String, Collection<Document>>): JsonObject {
    val resultJson = JsonObject()
    fetchedInstances.entries.stream()
        .forEach { (entity, instances) ->
          val instancesJson = JsonObject()
          instances.stream()
              .forEach { instance -> instancesJson.put(instance.getString("_id"), instance) }
          resultJson.put(entity, instancesJson)
        }
    return resultJson
  }

  private fun composeErrorMessage(errors: Map<String, Throwable>): String {
    val errorMessages = errors.values.stream()
        .map(Throwable::message)
        .collect(joining("\n\t"))
    return when (errors.size) {
      1 -> "MongoDB error: $errorMessages"
      else -> "${errors.size} MongoDB errors:\n\t$errorMessages"
    }
  }
}