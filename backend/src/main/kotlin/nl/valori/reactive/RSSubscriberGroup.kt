package nl.valori.reactive

import org.reactivestreams.Publisher
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

class RSSubscriberGroup<K, T>(
    private val publisherMap: Map<K, Publisher<T>>
) {
  private val errorMap = ConcurrentHashMap<K, Throwable>()
  private val numCompleted = AtomicInteger()
  private lateinit var onNext: (K, T) -> Unit
  private lateinit var onError: (Map<K, Throwable>) -> Unit
  private lateinit var onComplete: () -> Unit

  fun subscribe(
      onNext: (K, T) -> Unit,
      onComplete: () -> Unit,
      onError: (Map<K, Throwable>) -> Unit
  ) {
    this.onNext = onNext
    this.onComplete = onComplete
    this.onError = onError

    publisherMap.forEach { (correlationId, publisher) ->
      publisher.subscribe(RSSubscriber(
          {
            onNext(correlationId, it)
          },
          {
            errorMap[correlationId] = it
            terminateWhenDone()
          },
          {
            numCompleted.incrementAndGet()
            terminateWhenDone()
          }))
    }
  }

  private fun terminateWhenDone() {
    if (numCompleted.get() + errorMap.size == publisherMap.size) {
      if (errorMap.isEmpty()) {
        onComplete()
      } else {
        onError(errorMap)
      }
    }
  }
}