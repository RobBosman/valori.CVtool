package nl.valori.cvtool.server.cv

import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.Observable
import io.reactivex.Single
import io.reactivex.subjects.BehaviorSubject
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import nl.valori.cvtool.server.ModelUtils.getInstances
import nl.valori.cvtool.server.cv.CvGenerateVerticle.Companion.allLocales
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS
import org.slf4j.LoggerFactory
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit.NANOSECONDS
import java.util.concurrent.atomic.AtomicLong

internal class CvBackupVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

  private var counter = 0
  private var processingNanos = AtomicLong(1_000 * 1_000_000)
  private val intervalSubject = BehaviorSubject.createDefault(10 * 1_000_000L)

  override fun start(startPromise: Promise<Void>) {
    // Generate all cvs every 10 seconds.
    vertx.setPeriodic(10 * 1_000) { timerID ->
      // run only once!
      if (counter > 9)
        vertx.cancelTimer(timerID)

      generateAllCvs()
    }
    startPromise.complete()

    generateAllCvs()
  }

  private fun generateAllCvs() {
    log.info("Here we go! [$counter]")
    counter++

    val start = System.nanoTime()
    val allGeneratedCvs = ConcurrentHashMap<String, String>()

    // Use a 'trickle charger' with a dynamic interval that is constantly adjusted to the effective processing speed of the system.
    val trickleCharger = intervalSubject
        .switchMap { interval -> Observable.timer(interval, NANOSECONDS) }
        // Set the new interval to a fraction of the latest processing time.
        .doOnNext { intervalSubject.onNext(processingNanos.get() / 4) }
        .toFlowable(BackpressureStrategy.ERROR)

    fetchAllCvInstances()
        .toFlowable()
        .flatMap { allCvs -> Flowable.fromIterable(allCvs.getInstances("cv")) }
        .zipWith(trickleCharger) { cv, _ -> cv } // Trickle-charge.
        .flatMap { cv ->
          Flowable
              .fromIterable(allLocales)
              .flatMap { locale ->
                generateCv(cv.getString("accountId"), locale)
                    .toFlowable()
              }
        }
        .subscribe(
            { generatedCv ->
              allGeneratedCvs[generatedCv.getString("fileName")] = generatedCv.getString("contentB64")
              log.info("duration ${processingNanos.get() / 1_000_000} ms")
//              log.info("Generated CV '${generatedCv.getString("fileName")}'")
            },
            {
              log.error("Vertx error in CvBackupVerticle", it)
            },
            {
              log.info("generate ${allGeneratedCvs.size} cvs took ${(System.nanoTime() - start) / 1_000_000} ms")
            })
  }

  private fun fetchAllCvInstances() =
      vertx.eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS,
              JsonObject("""{ "cv": [{}] }"""),
              deliveryOptions)
          .map { it.body() }

  private fun generateCv(accountId: String, locale: String): Single<JsonObject> {
    val startNanos = System.nanoTime()
    return vertx.eventBus()
        .rxRequest<JsonObject>(CV_GENERATE_ADDRESS,
            JsonObject().put("accountId", accountId).put("locale", locale),
            deliveryOptions)
        .doOnSuccess { processingNanos.set(System.nanoTime() - startNanos) }
        .map { it.body() }
  }
}