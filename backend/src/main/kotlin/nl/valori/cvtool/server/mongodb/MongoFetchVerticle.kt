package nl.valori.cvtool.server.mongodb

import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import org.bson.BsonDocument
import org.slf4j.LoggerFactory

const val FETCH_ADDRESS = "fetch"

internal class MongoFetchVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    MongoConnection
        .mongodbConnection(config())
        .subscribe(
            { mongoDatabase ->
              vertx.eventBus()
                  .consumer<JsonObject>(FETCH_ADDRESS)
                  .toObservable()
                  .subscribe(
                      {
                        startPromise.tryComplete()
                        handleRequest(it, mongoDatabase)
                      },
                      {
                        log.error("Vertx error processing MongoDB request: ${it.message}.")
                        startPromise.fail(it)
                      }
                  )
            },
            {
              log.error("Error connecting to MongoDB")
              startPromise.fail(it)
            }
        )
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
  private fun handleRequest(message: Message<JsonObject>, mongoDatabase: MongoDatabase) =
      Flowable
          .fromIterable(message.body().map.entries)
          .flatMap { fetchInstancesOfEntity(it.key, it.value, mongoDatabase).toFlowable() }
          .reduceWith(
              { JsonObject() },
              { resultJson, entityJson -> resultJson.mergeIn(entityJson) }
          )
          .subscribe(
              { fetchResult ->
                log.debug("Successfully fetched instances of ${fetchResult.map.size} entities")
                message.reply(fetchResult)
              },
              {
                val errorMsg = "Error fetching data: ${it.message}"
                log.warn(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              }
          )

  /**
   * Returns JSON:
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
   *     }
   *   }
   * </pre>
   */
  private fun fetchInstancesOfEntity(entity: String, criteriaArray: Any, mongoDatabase: MongoDatabase): Single<JsonObject> {
    if (criteriaArray !is JsonArray)
      throw IllegalArgumentException("Error fetching data: search criteria must be of type JsonArray")
    val criteria = criteriaArray.encode().substringAfter("[").substringBeforeLast("]")
    return Flowable
        .defer {
          log.debug("Vertx fetching '$entity' documents using criteria [$criteria]...")
          mongoDatabase
              .getCollection(entity)
              .find(BsonDocument.parse(criteria))
        }
        .reduceWith(
            { JsonObject() },
            { instanceJson, instance -> instanceJson.put(instance.getString("_id"), instance) }
        )
        .map { JsonObject().put(entity, it) }
  }
}