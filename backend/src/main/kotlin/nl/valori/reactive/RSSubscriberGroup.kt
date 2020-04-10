package nl.valori.reactive

import org.reactivestreams.Subscriber
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

class RSSubscriberGroup<T>(
    private val onNext: (String, T) -> Unit,
    private val onError: (Map<String, Throwable>) -> Unit,
    private val onComplete: () -> Unit,
    private var numExpectedSubscribers: Int = 0
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
          terminateIfDone()
        },
        {
          numCompleted.incrementAndGet()
          terminateIfDone()
        })
  }

  private fun terminateIfDone() {
    if (numSubscribers.get() == numExpectedSubscribers
        && numCompleted.get() + errorMap.size == numExpectedSubscribers) {
      if (errorMap.isEmpty()) {
        onComplete()
      } else {
        onError(errorMap)
      }
    }
  }

  fun enable() {
    numExpectedSubscribers = numSubscribers.get()
    terminateIfDone()
  }
}