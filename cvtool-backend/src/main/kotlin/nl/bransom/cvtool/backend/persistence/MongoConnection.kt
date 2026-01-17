package nl.bransom.cvtool.backend.persistence

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

    private val configSubject: Subject<JsonObject> = ReplaySubject.create(1)
    private val mongodbSubject: Subject<MongoDatabase> = ReplaySubject.create(1)

    init {
        // Connect to MongoDB only once, using the first config available.
        configSubject
            .take(1)
            .observeOn(Schedulers.io())
            .map { getMongoDatabase(it) }
            .subscribe(
                {
                    mongodbSubject.onNext(it)
                    mongodbSubject.onComplete()
                    log.info("Successfully configured MongoDB")
                },
                {
                    log.error("Error configuring MongoDB", it)
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
        // Connect to MongoDB only once, using the first config.
        // Subsequent calls to this function will use the same connection.
        if (!configSubject.hasComplete()) {
            configSubject.onNext(config)
            configSubject.onComplete()
        }
        return mongodbSubject
            .take(1)
            .singleOrError()
            .flatMap { mongoDatabase ->
                Flowable
                    .defer { mongoDatabase.runCommand(Document("ping", 1)) }
                    .subscribeOn(Schedulers.io())
                    .singleOrError()
                    .map { mongoDatabase }
            }
    }
}