package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.DebouncingVerticle
import java.util.Base64
import java.util.Optional

const val CV_DOWNLOAD_DEMO_ADDRESS = "cv.download.demo"

internal class CvDownloadDemoVerticle : DebouncingVerticle(CV_DOWNLOAD_DEMO_ADDRESS) {

    override fun getMessageFingerprint(message: Message<JsonObject>): Optional<String> =
        Optional
            .ofNullable(message.headers()["authInfo"])
            .map { JsonObject(it).getString("accountId") }

    /**
     * Expected message body:
     *   {
     *      "locale": "nl_NL"
     *   }
     *
     * Response:
     *   {
     *     "fileName": "demo-cv.docx",
     *     "docxB64": "Base64-encoded-docx-data",
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message.body())
            .map { it.getString("locale", "nl_NL") }
            .flatMap { locale ->
                getDemoDocxBytes(locale)
                    .map { docxBytes ->
                        JsonObject()
                            .put("fileName", composeFileName(locale))
                            .put("docxB64", String(Base64.getEncoder().encode(docxBytes)))
                    }
            }
            .subscribe(
                {
                    log.debug("Successfully fetched demo cv")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching demo cv: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun getDemoDocxBytes(locale: String): Single<ByteArray> {
        return Single
            .just(locale)
            .map { "/demo/${composeFileName(it)}" }
            .map { CvDownloadDemoVerticle::class.java.getResource(it)!!.readBytes() }
    }

    private fun composeFileName(locale: String) =
        if (locale == "uk_UK") {
            "CV_UK_EXAMPLE.docx"
        } else {
            "CV_${locale.substring(3)}_VOORBEELD.docx"
        }
}