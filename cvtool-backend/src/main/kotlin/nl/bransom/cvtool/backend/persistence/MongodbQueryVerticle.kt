package nl.bransom.cvtool.backend.persistence

import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import org.bson.BsonDocument
import org.bson.Document
import org.slf4j.LoggerFactory
import java.util.concurrent.TimeUnit.MILLISECONDS

const val MONGODB_QUERY_ADDRESS = "mongodb.query"

internal class MongodbQueryVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun start(startPromise: Promise<Void>) { // NOSONAR - Promise<Void> is defined in AbstractVerticle
        MongoConnection
            .connectToDatabase(config())
            .doOnError { log.warn("Cannot start verticle: ${it.message}") }
            .retryWhen { it.delay(5_000, MILLISECONDS) }
            .subscribe(
                { mongoDatabase ->
                    startPromise.complete()

                    vertx.eventBus()
                        .consumer<JsonObject>(MONGODB_QUERY_ADDRESS)
                        .toFlowable()
                        .subscribe(
                            {
                                handleRequest(it, mongoDatabase)
                            },
                            {
                                log.error("Vertx error processing MongoDB query request.", it)
                            }
                        )
                },
                {
                    log.error("Error connecting to MongoDB", it)
                    startPromise.fail(it)
                }
            )
    }

    /**
     * Expected message body:
     *   {
     *       "aggregate": "audit_log",
     *       "pipeline": [
     *           {
     *               "$group": {
     *                   "_id": { "$ifNull": [ "$cvAccountId", "$editorAccountId" ] },
     *                   "latestTimestamp": { "$last": "$timestamp" }
     *               }
     *           }
     *       ],
     *       "cursor": { }
     *   }
     *
     * Response:
     *   [
     *       {
     *           "_id": "ede8738e-4297-4072-8d3a-0d860ef887a2",
     *           "latestTimestamp": "2026-01-12T14:55:19.867504873"
     *       },
     *       ...
     *   ]
     */
    private fun handleRequest(message: Message<JsonObject>, mongoDatabase: MongoDatabase) =
        Flowable
            .just(message.body())
            .flatMap { jsonQuery ->
                log.info("Vertx running query: {}", jsonQuery.encode())

                val entityName = jsonQuery.getString("aggregate")
                val pipeline = jsonQuery.getJsonArray("pipeline")
                    .map { BsonDocument.parse(it.toString()) }

                mongoDatabase
                    .getCollection(entityName)
                    .aggregate(pipeline)
            }
            .cache()
            .reduceWith(
                { ArrayList<Document>() },
                { collectedItems, item -> collectedItems.apply { add(item) } }
            )
            .map { collectedItems -> collectedItems.associateBy { it.getString("_id") } }
            .subscribe(
                { fetchedResult ->
                    log.info("Successfully queried ${fetchedResult.size} result items")
                    message.reply(JsonObject(fetchedResult))
                },
                {
                    val errorMsg = "Error querying data: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
}