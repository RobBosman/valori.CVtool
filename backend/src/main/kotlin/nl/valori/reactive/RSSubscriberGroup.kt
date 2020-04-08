package nl.valori.reactive

import org.reactivestreams.Subscriber
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

class RSSubscriberGroup<T>(
    private val onNext: (String, T) -> Unit,
    private val onError: (Map<String, Throwable>) -> Unit,
    private val onComplete: () -> Unit
) {
  private val numSubscribers = AtomicInteger()
  private val errorMap = ConcurrentHashMap<String, Throwable>()
  private val numCompleted = AtomicInteger()

  fun newSubscriber(correlationId: String): Subscriber<T> {
    numSubscribers.incrementAndGet()
    return RSSubscriber(
        {
          onNext(correlationId, it)
        },
        {
          errorMap[correlationId] = it
          subscriberTerminated()
        },
        {
          numCompleted.incrementAndGet()
          subscriberTerminated()
        }
    )
  }

  private fun subscriberTerminated() {
    if (numCompleted.get() + errorMap.size == numSubscribers.get()) {
      if (errorMap.isEmpty()) {
        onComplete()
      } else {
        onError(errorMap)
      }
    }
  }
}