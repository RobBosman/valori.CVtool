package nl.valori.cvtool.server

import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.WriteModel
import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.vertx.core.Future
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import nl.valori.reactive.RSSubscriberCollector
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.stream.Collectors.joining
import java.util.stream.Collectors.toList

const val ADDRESS_SAVE = "save"

internal class SaveVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val dbConfig = config().getJsonObject("mongoClient")
    val mongoDatabase = MongoClients
        .create("mongodb://${dbConfig.getString("host")}:${dbConfig.getLong("port")}")
        .getDatabase(dbConfig.getString("db_name"))

    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_SAVE)
        .toObservable()
        .subscribe(
            {
              handleSaveRequest(it, mongoDatabase)
            },
            {
              log.error("Vertx error", it)
            })
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
  private fun handleSaveRequest(message: Message<JsonObject>, mongoDatabase: MongoDatabase) {
    message.body().map.entries.stream()
        .map { (entity, instances) ->
          if (instances !is JsonObject)
            throw IllegalArgumentException("Expected JsonObject here")
          entity to instances
        }
        .map { (entity, instances) ->
          log.debug("Vertx saving instances of '$entity'...")
          entity to mongoDatabase
              .getCollection(entity)
              .bulkWrite(composeSaveRequests(instances.map.values))
        }
        .collect(RSSubscriberCollector())
        .subscribe(
            { _, _ -> },
            {
              log.debug("MongoDB saved documents")
              message.reply("Successfully saved documents")
            },
            {
              replyError(message, it)
            })
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
  private fun composeSaveRequests(
      instances: Collection<Any>
  ): List<WriteModel<Document>> {
    val replaceOptions = ReplaceOptions().upsert(true)
    return instances.stream()
        .filter { it is JsonObject }
        .map { Document.parse((it as JsonObject).encode()) }
        .map { ReplaceOneModel(Filters.eq("_id", it["_id"]), it, replaceOptions) }
        .collect(toList())
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
}