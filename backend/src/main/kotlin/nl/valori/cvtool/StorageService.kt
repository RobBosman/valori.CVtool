package nl.valori.cvtool

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.bson.Document
import java.time.LocalDateTime

object StorageService {

  private val CONNECTION_STRING = System.getProperty("connectionString", "mongodb://localhost:27017")
  private const val DATABASE_NAME = "spike"
  private const val COLLECTION_NAME = "cvData"

  fun getMongoClient(): MongoClient = MongoClients.create(CONNECTION_STRING)

  fun convertAndStore(dataJson: String, mongoClient: MongoClient) {
    val dataDoc = Document.parse(dataJson)
        .append("at", LocalDateTime.now())

    mongoClient
        .getDatabase(DATABASE_NAME)
        .getCollection(COLLECTION_NAME)
        .insertOne(dataDoc)
  }

  fun printAllData(mongoClient: MongoClient) {
    mongoClient
        .getDatabase(DATABASE_NAME)
        .getCollection(COLLECTION_NAME)
        .find()
//        .map { it["joke"] }
        .forEach { println(it) }
  }
}