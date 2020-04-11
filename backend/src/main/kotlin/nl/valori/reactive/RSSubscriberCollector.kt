package nl.valori.reactive

import org.reactivestreams.Publisher
import java.util.function.BiConsumer
import java.util.function.BinaryOperator
import java.util.function.Function
import java.util.function.Supplier
import java.util.stream.Collector

class RSSubscriberCollector<K, T> : Collector<Pair<K, Publisher<T>>, HashMap<K, Publisher<T>>, RSSubscriberGroup<K, T>> {

  override fun characteristics() = mutableSetOf(Collector.Characteristics.UNORDERED)

  override fun supplier() = Supplier<HashMap<K, Publisher<T>>> { HashMap() }

  override fun accumulator() = BiConsumer<HashMap<K, Publisher<T>>, Pair<K, Publisher<T>>> { publisherMap, next ->
    publisherMap[next.first] = next.second
  }

  override fun combiner() = BinaryOperator<HashMap<K, Publisher<T>>> { t, u ->
    t.putAll(u)
    t
  }

  override fun finisher() = Function<HashMap<K, Publisher<T>>, RSSubscriberGroup<K, T>> { RSSubscriberGroup(it) }
}