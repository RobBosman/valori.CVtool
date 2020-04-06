package nl.valori.cvtool.server

import com.mongodb.bulk.BulkWriteResult
import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.vertx.core.Future
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import nl.valori.reactive.ReactiveStreamsSubscriberGroup
import org.bson.BsonDocument
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.concurrent.ConcurrentLinkedDeque
import java.util.stream.Collectors
import java.util.stream.Collectors.joining

const val ADDRESS_FETCH = "fetch"
const val ADDRESS_SAVE = "save"

internal const val DB_COLLECTION = "safe"

internal class StorageVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val dbConfig = config().getJsonObject("mongoClient")
    val connectionString = "mongodb://${dbConfig.getString("host")}:${dbConfig.getLong("port")}"
    val mongoClient = MongoClients.create(connectionString)
    val mongoDatabase = mongoClient.getDatabase(dbConfig.getString("db_name"))

    handleSaveRequests(mongoDatabase)
    handleFetchRequests(mongoDatabase)
  }

  /**
   * Request message body must be JSON, normalized per entity:
   * <pre>
   *   {
   *     "entity_1": {
   *       "XXX": {
   *         "_id": "XXX",
   *         "property": "value"
   *       },
   *       "YYY": {
   *         "_id": "YYY",
   *         "property": "value"
   *       }
   *     },
   *     "entity_2": {
   *       "ZZZ": {
   *         "_id": "ZZZ",
   *         "property": "value"
   *       }
   *     }
   *   }
   * </pre>
   */
  private fun handleSaveRequests(mongoDatabase: MongoDatabase) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_SAVE)
        .toObservable()
        .map { message ->
          val subscriberGroup = ReactiveStreamsSubscriberGroup<BulkWriteResult>(
              {},
              {
                val errorMsg = "${it.size} MongoDB error(s): " +
                    it.values.stream()
                        .map(Throwable::message)
                        .collect(joining("\n"))
                log.error(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              },
              {
                log.debug("MongoDB saved documents")
                message.reply("Successfully saved documents")
              }
          )
          message.body().map.entries.stream()
              .filter { it.value is JsonObject }
              .forEach { (entity, instance) ->
                mongoSaveEntity(mongoDatabase, entity, instance as JsonObject, subscriberGroup)
              }
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }

  /**
   * @param instances
   * <pre>
   *   {
   *     "XXX": {
   *       "_id": "XXX",
   *       "property": "value"
   *     },
   *     "YYY": {
   *       "_id": "YYY",
   *       "property": "value"
   *     }
   *   }
   * </pre>
   */
  private fun mongoSaveEntity(
      mongoDatabase: MongoDatabase,
      entity: String,
      instances: JsonObject,
      subscriberGroup: ReactiveStreamsSubscriberGroup<BulkWriteResult>
  ) {
    log.debug("Vertx saving instances of '$entity'...")
    val replaceOptions = ReplaceOptions().upsert(true)
    val bulkReplacements = instances.map.values.stream()
        .filter { it is JsonObject }
        .map { Document.parse((it as JsonObject).encode()) }
        .map { ReplaceOneModel(Filters.eq("_id", it["_id"]), it, replaceOptions) }
        .collect(Collectors.toList())
    mongoDatabase
        .getCollection(entity)
        .bulkWrite(bulkReplacements)
        .subscribe(subscriberGroup.newSubscriber(entity))
  }

  /**
   * Request message body must be JSON, listing _ids per entity:
   * <pre>
   *   {
   *     "entity_1": [ "XXX", "YYY" ],
   *     "entity_2": [ "ZZZ" ]
   *   }
   * </pre>
   *
   * Response will be JSON normalized per entity:
   * <pre>
   *   {
   *     "entity_1": {
   *       "XXX": {
   *         "_id": "XXX",
   *         "property": "value"
   *       },
   *       "YYY": {
   *         "_id": "YYY",
   *         "property": "value"
   *       }
   *     },
   *     "entity_2": {
   *       "ZZZ": {
   *         "_id": "ZZZ",
   *         "property": "value"
   *       }
   *     }
   *   }
   * </pre>
   */
  private fun handleFetchRequests(mongoDatabase: MongoDatabase) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_FETCH)
        .toObservable()
        .map { message ->
          val entity = message.headers()["entity"] ?: DB_COLLECTION
          val objectId = message.body().getString("_id")
          log.debug("Vertx fetching documents from '$entity' with _id: $objectId...")

          val reply = ConcurrentLinkedDeque<Document>()
          val subscriberGroup = ReactiveStreamsSubscriberGroup<Document>(
              {
                reply.add(it)
              },
              {
                val errorMsg = "${it.size} MongoDB error(s): " +
                    it.values.stream()
                        .map(Throwable::message)
                        .collect(joining("\n"))
                log.error(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              },
              {
                log.debug("MongoDB fetched ${reply.size} documents from '$entity'")
                message.reply(JsonArray(reply.toList()))
              }
          )
          mongoDatabase
              .getCollection(entity)
              .find(if (objectId === null) BsonDocument() else Filters.eq("_id", objectId))
              .subscribe(subscriberGroup.newSubscriber(entity))
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }
}