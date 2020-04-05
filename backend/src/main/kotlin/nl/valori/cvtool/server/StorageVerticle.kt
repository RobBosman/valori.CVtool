package nl.valori.cvtool.server

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
import nl.valori.reactive.ReactiveStreamsSubscriber
import org.bson.BsonDocument
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.stream.Collectors

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

  private fun handleSaveRequests(mongoDatabase: MongoDatabase) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_SAVE)
        .toObservable()
        .map { message ->
          val collection = message.headers()["entity"] ?: DB_COLLECTION
          log.debug("Vertx saving documents to '$collection'...")

          val replaceOptions = ReplaceOptions().upsert(true)
          val bulkReplacements = message.body().map.values.stream()
              .filter { it is JsonObject }
              .map { Document.parse((it as JsonObject).encode()) }
              .map { ReplaceOneModel(Filters.eq("_id", it["_id"]), it, replaceOptions) }
              .collect(Collectors.toList())
          mongoDatabase
              .getCollection(collection)
              .bulkWrite(bulkReplacements)
              .subscribe(ReactiveStreamsSubscriber(
                  {},
                  {
                    log.error("MongoDB error: ${it.message}")
                    message.fail(RECIPIENT_FAILURE.toInt(), "MongoDB error: ${it.message}")
                  },
                  {
                    log.debug("MongoDB saved ${bulkReplacements.size} documents in '$collection'")
                    message.reply("job's done")
                  }
              ))
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }

  private fun handleFetchRequests(mongoDatabase: MongoDatabase) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_FETCH)
        .toObservable()
        .map { message ->
          val collection = message.headers()["entity"] ?: DB_COLLECTION
          val objectId = message.body().getString("_id")
          log.debug("Vertx fetching documents from '$collection' with _id: $objectId...")

          val reply = JsonArray()
          mongoDatabase
              .getCollection(collection)
              .find(if (objectId === null) BsonDocument() else Filters.eq("_id", objectId))
              .subscribe(ReactiveStreamsSubscriber(
                  {
                    reply.add(it)
                  },
                  {
                    log.error("MongoDB error: ${it.message}", it)
                    message.fail(RECIPIENT_FAILURE.toInt(), "MongoDB error: ${it.message}")
                  },
                  {
                    log.debug("MongoDB fetched ${reply.size()} documents from '$collection'")
                    message.reply(reply)
                  }
              ))
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }
}