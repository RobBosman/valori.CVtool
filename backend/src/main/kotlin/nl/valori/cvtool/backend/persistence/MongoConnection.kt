package nl.valori.cvtool.backend.persistence

import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.reactivex.Flowable
import io.reactivex.Observable
import io.reactivex.subjects.ReplaySubject
import io.reactivex.subjects.Subject
import io.vertx.core.json.JsonObject
import org.bson.Document

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

    fun mongodbConnection(config: JsonObject): Subject<MongoDatabase> {
        // Connect to MongoDB only once, using the first config. Subsequent calls to this function will use the same connection.
        if (!mongodbSubject.hasComplete()) {
            mongodbSubject.onNext(getMongoDatabase(config))
            mongodbSubject.onComplete()
        }
        return mongodbSubject
    }

    fun checkConnection(config: JsonObject): Observable<String> =
        mongodbConnection(config)
            .flatMap { mongoDatabase ->
                Flowable
                    .defer { mongoDatabase.runCommand(Document("ping", 1)) }
                    .toObservable()
            }
            .map(Document::toJson)
}