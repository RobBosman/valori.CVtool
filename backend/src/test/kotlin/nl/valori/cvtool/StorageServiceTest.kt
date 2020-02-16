package nl.valori.cvtool

import io.vertx.core.json.JsonObject
import org.junit.jupiter.api.Test

internal object StorageServiceTest {

  @Test
  fun convertAndStore() {
    val dataJson = JsonObject()
        .put("x", 12)
        .put("y", 19)

    StorageService.getMongoClient().use { mongoClient ->
      StorageService.convertAndStore(dataJson.toString(), mongoClient)
      StorageService.printAllData(mongoClient)
    }
  }
}