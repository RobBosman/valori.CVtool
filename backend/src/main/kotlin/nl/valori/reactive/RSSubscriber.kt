package nl.valori.reactive

import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription

class RSSubscriber<T>(
    private val onNext: (T) -> Unit,
    private val onComplete: () -> Unit,
    private val onError: (Throwable) -> Unit
) : Subscriber<T> {

  private lateinit var subscription: Subscription

  override fun onSubscribe(s: Subscription) {
    subscription = s
    requestNextEvents()
  }

  private fun requestNextEvents() = subscription.request(1)

  override fun onNext(result: T) {
    onNext.invoke(result)
    requestNextEvents()
  }

  override fun onComplete() = onComplete.invoke()

  override fun onError(error: Throwable) = onError.invoke(error)
}