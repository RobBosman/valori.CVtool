package nl.valori.cvtool.backend.persistence

import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.subjects.ReplaySubject
import io.reactivex.subjects.Subject
import io.vertx.core.json.JsonObject
import org.bson.Document
import java.util.concurrent.TimeUnit.MILLISECONDS

object MongoConnection {

    private val mongodbSubject: Subject<MongoDatabase> = ReplaySubject.create()

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

    private fun mongodbConnection(config: JsonObject): Subject<MongoDatabase> {
        // Connect to MongoDB only once, using the first config. Subsequent calls to this function will use the same connection.
        if (!mongodbSubject.hasComplete()) {
            mongodbSubject.onNext(getMongoDatabase(config))
            mongodbSubject.onComplete()
        }
        return mongodbSubject
    }

    fun connectToDatabase(config: JsonObject): Single<MongoDatabase> =
        mongodbConnection(config)
            .flatMap { mongoDatabase ->
                Flowable
                    .defer { mongoDatabase.runCommand(Document("ping", 1)) }
                    .toObservable()
                    .timeout(2000, MILLISECONDS)
                    .map { mongoDatabase }
            }
            .singleOrError()
}