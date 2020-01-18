package nl.valori.cvtool

import org.slf4j.LoggerFactory
import java.net.HttpURLConnection
import java.net.URL

object FetchJokeService {

  private val LOG = LoggerFactory.getLogger(javaClass)
  private const val API_URL = "http://api.icndb.com/jokes/random?limitTo=[explicit,nerdy]" // Chuck Norris jokes

  fun fetchJoke(): String {
    LOG.debug("fetch joke")
    val connection = URL(API_URL).openConnection() as HttpURLConnection
    try {
      connection.inputStream
          .bufferedReader()
          .use { return it.readText() }
    } finally {
      connection.disconnect()
      LOG.debug("fetched joke")
    }
  }
}