package nl.valori.cvtool.server.cv

import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.subjects.BehaviorSubject
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import nl.valori.cvtool.server.ModelUtils.getInstances
import nl.valori.cvtool.server.cv.CvGenerateVerticle.Companion.allLocales
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS
import org.slf4j.LoggerFactory
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.Base64
import java.util.concurrent.ConcurrentHashMap
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

internal class CvBackupVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

  private var counter = 0
  private val permitSubject = BehaviorSubject.createDefault(1)

  override fun start(startPromise: Promise<Void>) {
    // Generate all cvs every 10 seconds.
    vertx.setPeriodic(10 * 1_000) { timerID ->
      // Stop after a few times.
      if (counter > 2)
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

    fetchAllCvInstances()
        .toFlowable()
        .flatMap { allCvs -> Flowable.fromIterable(allCvs.getInstances("cv")) }
        .flatMap { cv ->
          Flowable
              .fromIterable(allLocales)
              .map { locale -> cv.getString("accountId") to locale }
        }
        .zipWith(permitSubject.toFlowable(BackpressureStrategy.ERROR)) { job, _ -> job }
        .flatMap { (accountId, locale) ->
          generateCv(accountId, locale)
              .toFlowable()
              .doOnComplete { permitSubject.onNext(1) }
        }
        .subscribe(
            { generatedCv ->
              allGeneratedCvs[generatedCv.getString("fileName")] = generatedCv.getString("contentB64")
            },
            {
              log.error("Vertx error in CvBackupVerticle", it)
            },
            {
              val resultZip = createZip(allGeneratedCvs)
              File("C:\\temp\\cvs.zip").writeBytes(resultZip)
              log.info("Generated ${allGeneratedCvs.size} cvs (${resultZip.size}) in ${(System.nanoTime() - start) / 1_000_000} ms")
            })
  }

  private fun fetchAllCvInstances() =
      vertx.eventBus()
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS,
              JsonObject("""{ "cv": [{}] }"""),
              deliveryOptions)
          .map { it.body() }

  private fun generateCv(accountId: String, locale: String) =
      vertx.eventBus()
          .rxRequest<JsonObject>(CV_GENERATE_ADDRESS,
              JsonObject().put("accountId", accountId).put("locale", locale),
              deliveryOptions)
          .map { it.body() }

  private fun createZip(allGeneratedCvs: Map<String, String>): ByteArray {
    val zipBytes = ByteArrayOutputStream()
    ZipOutputStream(zipBytes)
        .use { zipOutputStream ->
          allGeneratedCvs.forEach { (fileName, contentB64) ->
            zipOutputStream.putNextEntry(ZipEntry(fileName))
            zipOutputStream.write(Base64.getDecoder().decode(contentB64))
            zipOutputStream.closeEntry()
          }
        }
    return zipBytes.toByteArray()
  }
}