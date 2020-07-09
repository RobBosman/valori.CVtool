package nl.valori.cvtool.server.mongodb

import com.mongodb.bulk.BulkWriteResult
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.WriteModel
import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.vertx.core.Future
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import org.bson.Document
import org.reactivestreams.Publisher
import org.slf4j.LoggerFactory
import java.util.stream.Collectors.toList

const val ADDRESS_SAVE = "save"

internal class MongoSaveVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val connectionString = config().getString("mongodbConnectionString")
    val databaseName = connectionString.substringAfterLast("/").substringBefore("?")
    val mongoDatabase = MongoClients
        .create(connectionString)
        .getDatabase(databaseName)

    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_SAVE)
        .toObservable()
        .subscribe(
            { handleRequest(it, mongoDatabase) },
            { log.error("Vertx error", it) })
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
  private fun handleRequest(message: Message<JsonObject>, mongoDatabase: MongoDatabase) =
      Flowable
          .fromIterable(message.body().map.entries)
          .flatMap { saveInstancesOfEntity(it.key, it.value, mongoDatabase) }
          .subscribe(
              {},
              {
                val errorMsg = "Error saving data: ${it.message}"
                log.warn(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              },
              {
                log.debug("Successfully saved data")
                message.reply("Successfully saved data")
              })

  private fun saveInstancesOfEntity(entity: String, instances: Any, mongoDatabase: MongoDatabase): Publisher<BulkWriteResult> {
    if (instances !is JsonObject)
      throw IllegalArgumentException("Error saving data: expected JsonObject here")
    log.debug("Vertx saving ${instances.map.size} instances of '$entity'...")
    return mongoDatabase
        .getCollection(entity)
        .bulkWrite(composeWriteRequests(instances.map))
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
   *   {
   *     "XXX": {
   *       "_id": "XXX",
   *       "property": "value"
   *     },
   *     "YYY": {
   *       "_id": "YYY",
   *       "property": "value"
   *     },
   *     "ZZZ": {}
   *   }
   * </pre>
   */
  private fun composeWriteRequests(
      instanceMap: Map<String, Any>
  ): List<WriteModel<Document>> {
    return instanceMap.entries.stream()
        .map { (id, instance) -> toWriteModel(id, instance) }
        .collect(toList())
  }

  private fun toWriteModel(id: String, instance: Any): WriteModel<Document> {
    return if (instance is JsonObject && instance.getString("_id") == id) {
      val instanceDoc = Document.parse(instance.encode())
      ReplaceOneModel(Filters.eq("_id", id), instanceDoc, ReplaceOptions().upsert(true))
    } else {
      DeleteOneModel(Filters.eq("_id", id))
    }
  }
}