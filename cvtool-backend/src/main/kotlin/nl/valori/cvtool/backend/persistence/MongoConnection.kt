package nl.valori.cvtool.backend.persistence

import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.ReplaySubject
import io.reactivex.subjects.Subject
import io.vertx.core.json.JsonObject
import org.bson.Document
import org.slf4j.LoggerFactory

object MongoConnection {

    private val log = LoggerFactory.getLogger(javaClass)

    private val configSubject: Subject<JsonObject> = ReplaySubject.create()
    private val mongodbSubject: Subject<MongoDatabase> = ReplaySubject.create()

    init {
        // Connect to MongoDB only once, using the first config available.
        configSubject
            .observeOn(Schedulers.io())
            .take(1)
            .map { getMongoDatabase(it) }
            .subscribe(
                {
                    mongodbSubject.onNext(it)
                    mongodbSubject.onComplete()
                    log.info("Successfully configured the connection to MongoDB")
                },
                {
                    log.error("Error configuring the connection to MongoDB", it)
                }
            )
    }

    private fun getMongoDatabase(config: JsonObject): MongoDatabase {
        // Environment variable:
        //   MONGO_CONNECTION_STRING=mongodb://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
        //   MONGO_CONNECTION_STRING=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_URL>/<DATABASE>
        val connectionString = config.getString("MONGO_CONNECTION_STRING")
        val databaseName = connectionString.substringAfterLast("/").substringBefore("?")
        return MongoClients
            .create(connectionString)
            .getDatabase(databaseName)
    }

    fun connectToDatabase(config: JsonObject): Single<MongoDatabase> {
        // Connect to MongoDB only once, using the first config. Subsequent calls to this function will use the same connection.
        configSubject.onNext(config)
        return mongodbSubject
            .singleOrError()
            .flatMap { mongoDatabase ->
                Flowable
                    .defer { mongoDatabase.runCommand(Document("ping", 1)) }
                    .singleOrError()
                    .observeOn(Schedulers.io())
                    .map { mongoDatabase }
            }
    }
}