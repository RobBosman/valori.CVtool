package nl.valori.cvtool.backend.cv

import io.reactivex.BackpressureStrategy.ERROR
import io.reactivex.Flowable
import io.reactivex.subjects.BehaviorSubject
import io.vertx.core.eventbus.ReplyFailure
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.cv.CvGenerateVerticle.Companion.allLocales
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import java.io.ByteArrayOutputStream
import java.lang.System.nanoTime
import java.util.*
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.collections.component1
import kotlin.collections.component2
import kotlin.collections.set

const val ALL_CVS_GENERATE_ADDRESS = "all.cvs.generate"

internal class CvBackupVerticle : BasicVerticle(ALL_CVS_GENERATE_ADDRESS) {

    // Ensure that cv generation is throttled to prevent connection timeouts.
    private val permitSubject = BehaviorSubject.createDefault(1)

    /**
     * Expected message body:
     *   null
     *
     * Response:
     *   {
     *     "zipB64": "binary zip data with all docx cvs"
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        val startNanos = nanoTime()
        fetchAllCharacteristicsInstances()
            .flatMap { characteristics ->
                Flowable
                    .fromIterable(allLocales)
                    .map { locale -> characteristics.getString("accountId") to locale }
            }
            .zipWith(permitSubject.toFlowable(ERROR)) { job, _ -> job }
            .flatMap { (accountId, locale) ->
                generateCv(accountId, locale)
                    .toFlowable()
                    .doOnComplete { permitSubject.onNext(1) }
            }
            .reduceWith(
                { HashMap<String, String>() },
                { allGeneratedCvs, generatedCv ->
                    allGeneratedCvs[generatedCv.getString("fileName")] = generatedCv.getString("docxB64")
                    allGeneratedCvs
                })
            .map { it to createZip(it) }
            .subscribe(
                { (allGeneratedCvs, zipBytes) ->
                    log.info("Generated and zipped ${allGeneratedCvs.size} cvs in ${(nanoTime() - startNanos) / 1_000_000} ms")
                    message.reply(JsonObject().put("zipBytes", zipBytes))
                },
                {
                    val errorMsg = "Error generating all cvs: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchAllCharacteristicsInstances() =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject("""{ "characteristics": [{ "includeInCv": true }] }"""),
                deliveryOptions
            )
            .map { it.body() }
            .toFlowable()
            .flatMap { Flowable.fromIterable(it.getInstances("characteristics")) }

    private fun generateCv(accountId: String, locale: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                CV_GENERATE_ADDRESS,
                JsonObject().put("accountId", accountId).put("locale", locale),
                deliveryOptions
            )
            .map { it.body() }
            .onErrorReturn { createErrorCv(accountId, locale, it) }

    private fun createErrorCv(accountId: String, locale: String, t: Throwable) =
        JsonObject()
            .put("fileName", "ERROR-CV_${locale.substring(3)}_$accountId.txt")
            .put("docxB64", String(Base64.getEncoder().encode("Error generating $locale cv:\n$t".encodeToByteArray())))

    private fun createZip(allGeneratedCvs: Map<String, String>): ByteArray {
        val zipBytes = ByteArrayOutputStream()
        ZipOutputStream(zipBytes)
            .use { zipOutputStream ->
                allGeneratedCvs.forEach { (fileName, docxB64) ->
                    zipOutputStream.putNextEntry(ZipEntry(fileName))
                    zipOutputStream.write(Base64.getDecoder().decode(docxB64))
                    zipOutputStream.closeEntry()
                }
            }
        return zipBytes.toByteArray()
    }
}