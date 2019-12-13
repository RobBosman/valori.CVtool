package nl.valori.cvtool

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.bson.Document
import org.slf4j.LoggerFactory
import java.time.LocalDateTime

object StorageService {

  private val LOG = LoggerFactory.getLogger(javaClass)
  private val CONNECTION_STRING = System.getProperty("connectionString", "mongodb://localhost:27017")
  private const val DATABASE_NAME = "cvtool"
  private const val COLLECTION_NAME = "jokes"

  fun getMongoClient(): MongoClient {
    LOG.debug("get MongoDB client")
    val mongoClient = MongoClients.create(CONNECTION_STRING)
    LOG.debug("got MongoDB client")
    return mongoClient
  }

  fun convertAndStore(jokeJson: String, mongoClient: MongoClient): String {
    LOG.debug("convert and store joke")
    val jokeValue = Document.parse(jokeJson)["value"] as Document
    val joke = jokeValue["joke"] as String
    val jokeDocument = Document()
        .append("at", LocalDateTime.now())
        .append("joke", joke)
        .append("categories", jokeValue["categories"])

    mongoClient
        .getDatabase(DATABASE_NAME)
        .getCollection(COLLECTION_NAME)
        .insertOne(jokeDocument)
    LOG.debug("converted and stored joke")
    return joke
  }

  fun printAllJokes(mongoClient: MongoClient) {
    mongoClient
        .getDatabase(DATABASE_NAME)
        .getCollection(COLLECTION_NAME)
        .find()
        .map { it["joke"] }
        .forEach { println(it) }
  }
}