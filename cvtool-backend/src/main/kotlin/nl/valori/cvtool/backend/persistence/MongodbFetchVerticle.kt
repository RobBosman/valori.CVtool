package nl.valori.cvtool.backend.persistence

import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.cv.DOLLAR
import org.bson.BsonDocument
import org.slf4j.LoggerFactory

const val MONGODB_FETCH_ADDRESS = "mongodb.fetch"

internal class MongodbFetchVerticle : AbstractVerticle() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun start(startPromise: Promise<Void>) {
        MongoConnection
            .connectToDatabase(config())
            .subscribe(
                { mongoDatabase ->
                    startPromise.complete()

                    vertx.eventBus()
                        .consumer<JsonObject>(MONGODB_FETCH_ADDRESS)
                        .toFlowable()
                        .subscribe(
                            {
                                handleRequest(it, mongoDatabase)
                            },
                            {
                                log.error("Vertx error processing MongoDB fetch request.", it)
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
     *     entity_1: [{ _id: "XXX" }, { _id: "YYY" }],
     *     entity_2: [{ cvId: "my-cv-id" }]
     *   }
     *
     * Response:
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
     *         cvId: "my-cv-id",
     *         property: "value"
     *       }
     *     }
     *   }
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
     * Expected input:
     *   entity_1
     *   [ { _id: "XXX" }, { _id: "YYY" } ]
     *
     * JSON response:
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
     */
    private fun fetchInstancesOfEntity(
        entityName: String,
        criteriaArray: Any,
        mongoDatabase: MongoDatabase
    ): Single<JsonObject> {
        if (criteriaArray !is JsonArray)
            error("Error fetching data: search criteria must be of type JsonArray")
        // Transform the non-empty criteriaArray
        //   [ { _id: "XXX" }, { _id: "YYY" } ]
        // into the query criteria:
        //   { $or: [ { _id: "XXX" }, { _id: "YYY" } ] }
        val criteria = if (criteriaArray.isEmpty) "{}" else "{ \"${DOLLAR}or\": ${criteriaArray.encode()} }"
        return Flowable
            .defer {
                log.debug("Vertx fetching '$entityName' documents using criteria [$criteria]...")
                mongoDatabase
                    .getCollection(entityName)
                    .find(BsonDocument.parse(criteria))
            }
            .reduceWith(
                { JsonObject() },
                { instanceJson, instance -> instanceJson.put(instance.getString("_id"), instance) }
            )
            .map { JsonObject().put(entityName, it) }
    }
}