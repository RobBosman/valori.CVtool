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
import kotlin.collections.HashMap
import kotlin.collections.component1
import kotlin.collections.component2
import kotlin.collections.set

const val ALL_CVS_GENERATE_ADDRESS = "all.cvs.generate"

internal class CvBackupVerticle : BasicVerticle(ALL_CVS_GENERATE_ADDRESS) {

    private val permitSubject = BehaviorSubject.createDefault(1)

    /**
     * input: null
     * output: {
     *   "zipB64": "binary zip data with all docx cvs"
     * }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        val startNanos = nanoTime()
        fetchAllCvInstances()
            .toFlowable()
            .flatMap { allCvs -> Flowable.fromIterable(allCvs.getInstances("cv")) }
            .flatMap { cv ->
                Flowable
                    .fromIterable(allLocales)
                    .map { locale -> cv.getString("accountId") to locale }
            }
            .zipWith(permitSubject.toFlowable(ERROR)) { job, _ -> job }
            .flatMap { (accountId, locale) ->
                generateCv(accountId, locale)
                    .toFlowable()
                    .doOnComplete { permitSubject.onNext(1) }
            }
            .reduceWith({ HashMap<String, String>() }, { allGeneratedCvs, generatedCv ->
                allGeneratedCvs[generatedCv.getString("fileName")] = generatedCv.getString("docxB64")
                allGeneratedCvs
            })
            .subscribe(
                { allGeneratedCvs ->
                    log.info("Generated and zipped ${allGeneratedCvs.size} cvs in ${(nanoTime() - startNanos) / 1_000_000} ms")
                    val zipBytes = createZip(allGeneratedCvs)
                    message.reply(JsonObject().put("zipBytes", zipBytes))
                },
                {
                    val errorMsg = "Error generating all cvs: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchAllCvInstances() =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject("""{ "cv": [{}] }"""),
                deliveryOptions
            )
            .map { it.body() }

    private fun generateCv(accountId: String, locale: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                CV_GENERATE_ADDRESS,
                JsonObject().put("accountId", accountId).put("locale", locale),
                deliveryOptions
            )
            .map { it.body() }

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