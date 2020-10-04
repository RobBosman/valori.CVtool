package nl.valori.cvtool.server.mongodb

import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoDatabase
import io.vertx.core.json.JsonObject

object MongoConnection {

  private var mongoDatabase: MongoDatabase? = null

  fun getMongoDatabase(config: JsonObject): MongoDatabase {
    // Environment variable:
    //   MONGO_CONNECTION_STRING=mongodb://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
    //   MONGO_CONNECTION_STRING=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_URL>/<DATABASE>
    val connectionString = config.getString("MONGO_CONNECTION_STRING")
    val databaseName = connectionString.substringAfterLast("/").substringBefore("?")

    if (mongoDatabase == null) {
      synchronized(this) {
        if (mongoDatabase == null) {
          mongoDatabase = MongoClients
              .create(connectionString)
              .getDatabase(databaseName)
        }
      }
    }

    return mongoDatabase!!
  }
}