package nl.valori.reactive

import org.reactivestreams.Publisher
import java.util.concurrent.ConcurrentHashMap
import java.util.function.BiConsumer
import java.util.function.BinaryOperator
import java.util.function.Function
import java.util.function.Supplier
import java.util.stream.Collector
import java.util.stream.Collector.Characteristics

class RSSubscriberCollector<K, T> : Collector<Pair<K, Publisher<T>>, MutableMap<K, Publisher<T>>, RSSubscriberGroup<K, T>> {

  override fun characteristics() = mutableSetOf(Characteristics.CONCURRENT, Characteristics.UNORDERED)

  override fun supplier() = Supplier<MutableMap<K, Publisher<T>>> { ConcurrentHashMap() }

  override fun accumulator() = BiConsumer<MutableMap<K, Publisher<T>>, Pair<K, Publisher<T>>> { publisherMap, event ->
    publisherMap[event.first] = event.second
  }

  override fun combiner() = BinaryOperator<MutableMap<K, Publisher<T>>> { combinedMap, publisherMap ->
    combinedMap.putAll(publisherMap)
    combinedMap
  }

  override fun finisher() = Function<MutableMap<K, Publisher<T>>, RSSubscriberGroup<K, T>> { RSSubscriberGroup(it) }
}