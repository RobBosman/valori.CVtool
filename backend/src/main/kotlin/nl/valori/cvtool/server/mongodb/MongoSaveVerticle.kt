package nl.valori.cvtool.server.mongodb

import com.mongodb.client.model.*
import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.reactivex.internal.operators.flowable.FlowableEmpty
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.stream.Collectors.toList

const val SAVE_ADDRESS = "save"

internal class MongoSaveVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(startPromise: Promise<Void>) {
    MongoConnection
        .mongodbConnection(config())
        .subscribe(
            { mongoDatabase ->
              vertx.eventBus()
                  .consumer<JsonObject>(SAVE_ADDRESS)
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
          .flatMap {
            val entity = it.key
            val instances = it.value
            if (instances !is JsonObject)
              throw IllegalArgumentException("Error saving data: expected 'JsonObject' but found '${instances.javaClass.name}'")
            when (instances.isEmpty) {
              true -> FlowableEmpty.empty()
              else -> {
                log.debug("Vertx saving ${instances.map.size} instances of '$entity'...")
                mongoDatabase
                    .getCollection(entity)
                    .bulkWrite(composeWriteRequests(instances.map))
              }
            }
          }
          .subscribe(
              {},
              {
                val errorMsg = "Error saving data: ${it.message}"
                log.warn(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              },
              {
                log.debug("Successfully saved data")
                message.reply(JsonObject().put("result", "Successfully saved data"))
              }
          )

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
  private fun composeWriteRequests(instanceMap: Map<String, Any>): List<WriteModel<Document>> =
      instanceMap.entries.stream()
          .map { (id, instance) -> toWriteModel(id, instance) }
          .collect(toList())

  private fun toWriteModel(id: String, instance: Any): WriteModel<Document> =
      if (instance is JsonObject && instance.getString("_id", "") == id) {
        val instanceDoc = Document.parse(instance.encode())
        ReplaceOneModel(Filters.eq("_id", id), instanceDoc, ReplaceOptions().upsert(true))
      } else {
        DeleteOneModel(Filters.eq("_id", id))
      }
}