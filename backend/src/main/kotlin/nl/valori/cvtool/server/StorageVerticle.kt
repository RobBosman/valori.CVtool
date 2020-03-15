package nl.valori.cvtool.server

import com.mongodb.client.model.Filters
import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.vertx.core.Future
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import nl.valori.cvtool.reactive.ReactiveStreamsSubscriber
import org.bson.BsonDocument
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.UUID

const val ADDRESS_CV_DATA_GET = "cv.data.get"
const val ADDRESS_CV_DATA_SET = "cv.data.set"

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
    val mongoCollection = mongoDatabase.getCollection("spike")

    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_CV_DATA_SET)
        .toObservable()
        .map { message ->
          val mongoRequestDoc = Document.parse(message.body().encode())
          val objectId = getOrAssignObjectId(mongoRequestDoc)
          log.debug("Vertx saving data with _id: $objectId...")

          val publisher = if (mongoRequestDoc["_id"] !== null)
            mongoCollection
                .findOneAndReplace(Filters.eq("_id", mongoRequestDoc["_id"]), mongoRequestDoc)
          else
            mongoCollection
                .insertOne(mongoRequestDoc)

          publisher
              .subscribe(ReactiveStreamsSubscriber(
                  {},
                  {
                    log.error("MongoDB error: ${it.message}")
                    message.fail(RECIPIENT_FAILURE.toInt(), "MongoDB error: ${it.message}")
                  },
                  {
                    log.debug("MongoDB saved _id: $objectId")
                    message.reply(JsonObject().put("_id", objectId))
                  }
              ))
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }

  private fun handleFetchRequests(mongoDatabase: MongoDatabase) {
    val mongoCollection = mongoDatabase.getCollection("spike")

    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_CV_DATA_GET)
        .toObservable()
        .map { message ->
          val objectId = Document.parse(message.body().encode())["_id"]
          log.debug("Vertx fetching data with _id: ${objectId}...")
          val reply = JsonArray()
          mongoCollection
              .find(if (objectId === null) BsonDocument() else Filters.eq("_id", objectId))
              .subscribe(ReactiveStreamsSubscriber(
                  {
                    reply.add(it)
                  },
                  {
                    log.error("MongoDB error: ${it.message}", it)
                    message.reply(JsonObject().put("error", it.message))
                  },
                  {
                    log.debug("MongoDB fetched ${reply.size()} documents")
                    message.reply(reply)
                  }
              ))
        }
        .subscribe(
            {},
            { log.error("Vertx error: ${it.message}", it) })
  }

  private fun getOrAssignObjectId(mongoDocument: Document): String {
    if (mongoDocument["_id"] === null) {
      mongoDocument["_id"] = UUID.randomUUID().toString()
    }
    return mongoDocument["_id"].toString()
  }
}