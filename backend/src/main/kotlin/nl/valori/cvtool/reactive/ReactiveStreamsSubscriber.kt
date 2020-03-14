package nl.valori.cvtool.reactive

import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription

class ReactiveStreamsSubscriber<T>(
    private val onNext: (T) -> Unit,
    private val onError: (Throwable) -> Unit,
    private val onComplete: () -> Unit
) : Subscriber<T> {

  private lateinit var subscription: Subscription

  override fun onSubscribe(s: Subscription) {
    subscription = s
    requestNextEvents()
  }

  override fun onNext(result: T) {
    onNext.invoke(result)
    requestNextEvents()
  }

  override fun onError(error: Throwable) = onError.invoke(error)

  override fun onComplete() = onComplete.invoke()

  private fun requestNextEvents() = subscription.request(1)
}