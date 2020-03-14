package nl.valori.cvtool.server

import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.vertx.core.Future
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import org.bson.Document
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import org.slf4j.LoggerFactory

const val ADDRESS_CV_DATA_GET = "cv.data.get"
const val ADDRESS_CV_DATA_SET = "cv.data.set"

internal class StorageVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    val dbConfig = config().getJsonObject("mongoClient")
    val connectionString = "mongodb://" + dbConfig.getString("host") + ":" + dbConfig.getLong("port")
    val mongoClient = MongoClients.create(connectionString)

    val mongoDatabase = mongoClient.getDatabase(dbConfig.getString("db_name"))

    handleSaveRequests(mongoDatabase)
    handleFetchRequests(mongoDatabase)
  }

  class MongoSubscriber<T>(
      private val maxNumMessages: () -> Long,
      private val onNext: (T) -> Unit,
      private val onError: (Throwable) -> Unit,
      private val onComplete: () -> Unit
  ) : Subscriber<T> {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun onSubscribe(s: Subscription) {
      val maxNumMessages = maxNumMessages.invoke()
      log.debug("MongoSubscriber requesting max {} Mongo message(s)", maxNumMessages)
      s.request(maxNumMessages)
    }

    override fun onNext(result: T) {
      log.debug("MongoSubscriber received Mongo message", result)
      onNext.invoke(result)
    }

    override fun onError(error: Throwable) {
      log.debug("MongoSubscriber error handling Mongo message: {}", error.message)
      onError.invoke(error)
    }

    override fun onComplete() {
      log.debug("MongoSubscriber completed Mongo message")
      onComplete.invoke()
    }
  }


  private fun handleSaveRequests(mongoDatabase: MongoDatabase) {
    val mongoCollection = mongoDatabase.getCollection("spike")

    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_CV_DATA_SET)
        .toObservable()
        .map { message ->
          val mongoRequestJson = Document.parse(message.body().encode())
          val reply = JsonObject()
          mongoCollection
              .insertOne(mongoRequestJson)
              .subscribe(MongoSubscriber(
                  { 1 },
                  {
                    log.debug("MongoDB saved data: {}", it)
                    reply.put("_id", mongoRequestJson["_id"])
                  },
                  {
                    log.error("MongoDB error: {}", it.message)
                    message.reply(JsonObject().put("MongoDB error: {}", it.message))
                  },
                  {
                    log.debug("MongoDB completed")
                    message.reply(reply)
                  }
              ))
        }
        .subscribe(
            { log.debug("Vertx saving data...") },
            { log.error("Vertx error: {}", it.message, it) })
  }

  private fun handleFetchRequests(mongoDatabase: MongoDatabase) {
    val mongoCollection = mongoDatabase.getCollection("spike")

    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_CV_DATA_GET)
        .toObservable()
        .map { message ->
          val objectId = Document.parse(message.body().encode())["_id"]
          log.debug("Vertx about to fetch data with _id '{}'", objectId)
          val reply = JsonArray()
          mongoCollection
              .find()
//              .find(Filters.eq("_id", objectId))
              .subscribe(MongoSubscriber(
                  { 10 },
                  {
                    log.debug("MongoDB fetched data: {}", it)
                    reply.add(it)
                  },
                  {
                    log.error("MongoDB error: {}", it.message, it)
                    message.reply(JsonObject().put("MongoDB error: {}", it.message))
                  },
                  {
                    log.debug("MongoDB completed:", reply)
                    message.reply(reply)
                  }
              ))
        }
        .subscribe(
            { log.debug("Vertx fetching data...") },
            { log.error("Vertx error: {}", it.message, it) })
  }
}