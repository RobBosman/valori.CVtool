package nl.valori.cvtool

import org.junit.jupiter.api.Test

internal object StorageServiceTest {

  @Test
  fun convertAndStore() {
    StorageService.getMongoClient().use { mongoClient ->
      StorageService.convertAndStore(FetchJokeService.fetchJoke(), mongoClient)
      StorageService.printAllJokes(mongoClient)
    }
  }
}