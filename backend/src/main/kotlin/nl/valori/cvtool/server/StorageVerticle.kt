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
import io.vertx.rxjava.core.eventbus.Message
import nl.valori.reactive.RSSubscriberGroup
import org.bson.BsonDocument
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentLinkedDeque
import java.util.stream.Collectors
import java.util.stream.Collectors.joining

const val ADDRESS_FETCH = "fetch"
const val ADDRESS_SAVE = "save"

internal class StorageVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val dbConfig = config().getJsonObject("mongoClient")
    val mongoDatabase = MongoClients
        .create("mongodb://${dbConfig.getString("host")}:${dbConfig.getLong("port")}")
        .getDatabase(dbConfig.getString("db_name"))

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
          val subscriberGroup = RSSubscriberGroup<BulkWriteResult>(
              { _, _ -> },
              {
                replyError(message, it)
              },
              {
                log.debug("MongoDB saved documents")
                message.reply("Successfully saved documents")
              },
              message.body().map.size)
          message.body().map.entries.stream()
              .filter { it.value is JsonObject }
              .forEach { (entity, instance) ->
                mongoUpsertEntity(
                    mongoDatabase,
                    entity,
                    (instance as JsonObject).map.values,
                    subscriberGroup)
              }
        }
        .subscribe(
            {},
            { log.error("Vertx error", it) })
  }

  /**
   * TODO: CRUD
   * CRUD-state:
   *   C = create
   *   R = read (will be ignored here)
   *   U = update
   *   D = delete
   * CRUD-states C and U are combined to a replace-with-upsert action
   *
   * <pre>
   *   [
   *     {
   *       "_id": "XXX",
   *       "property": "value"
   *     },
   *     {
   *       "_id": "YYY",
   *       "property": "value"
   *     }
   *   ]
   * </pre>
   */
  private fun mongoUpsertEntity(
      mongoDatabase: MongoDatabase,
      entity: String,
      instances: Collection<Any>,
      subscriberGroup: RSSubscriberGroup<BulkWriteResult>
  ) {
    log.debug("Vertx saving instances of '$entity'...")
    val replaceOptions = ReplaceOptions().upsert(true)
    val bulkReplacements = instances.stream()
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
  private fun handleFetchRequests(mongoDatabase: MongoDatabase) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_FETCH)
        .toObservable()
        .subscribe(
            { message ->
              val fetchedInstances = ConcurrentHashMap<String, Queue<Document>>()
              val subscriberGroup = RSSubscriberGroup<Document>(
                  { entity, instance ->
                    fetchedInstances.computeIfAbsent(entity) { ConcurrentLinkedDeque() }
                        .add(instance)
                  },
                  {
                    replyError(message, it)
                  },
                  {
                    val numInstances = fetchedInstances.values.stream()
                        .mapToInt { it.size }
                        .sum()
                    log.debug("MongoDB fetched $numInstances instances of ${fetchedInstances.size} entities")
                    message.reply(composeReplyJson(fetchedInstances))
                  })
              message.body().map.entries.stream()
                  .map { (entity, criteriaArray) ->
                    if (criteriaArray !is JsonArray)
                      throw IllegalArgumentException("Search criteria must be of type JsonArray")
                    entity to criteriaArray
                  }
                  .forEach { (entity, criteriaArray) ->
                    val criteria = criteriaArray.encode().substringAfter("[").substringBeforeLast("]")
                    log.debug("Vertx fetching '$entity' documents using criteria [$criteria]")
                    mongoDatabase
                        .getCollection(entity)
                        .find(BsonDocument.parse(criteria))
                        .subscribe(subscriberGroup.newSubscriber(entity))
                  }
              subscriberGroup.enable()
            },
            {
              log.error("Vertx error", it)
            })
  }

  private fun replyError(message: Message<JsonObject>, errors: Map<String, Throwable>) {
    val errorMsg = when (errors.size) {
      1 -> "MongoDB error: "
      else -> "${errors.size} MongoDB errors:\n\t"
    } + errors.values.stream()
        .map(Throwable::message)
        .collect(joining("\n\t"))
    log.warn(errorMsg)
    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
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
}