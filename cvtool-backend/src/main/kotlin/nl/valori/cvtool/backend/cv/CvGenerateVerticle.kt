package nl.valori.cvtool.backend.cv

import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.DebouncingVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.ModelUtils.jsonToXml
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.util.Base64
import java.util.Optional
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream
import javax.xml.stream.XMLOutputFactory
import javax.xml.transform.Templates
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

const val CV_GENERATE_ADDRESS = "cv.generate"

internal class CvGenerateVerticle : DebouncingVerticle(CV_GENERATE_ADDRESS) {

    companion object {
        internal const val CV_XML_NAMESPACE = "https://ns.bransom.nl/valori/cv/v20201130.xsd"
        internal val ALL_LOCALES = setOf("nl_NL", "uk_UK")
        private const val DEFAULT_DOCX_TEMPLATE = "VALORI"

        private fun loadBytes(location: String) =
            CvGenerateVerticle::class.java.getResource(location)
                ?.readBytes()
                ?: error("Resource not found: $location")

        private val b64BinaryEntryNames = setOf(
            "word/media/passport.photo"
        )

        private fun xslIncludesMap(docxTemplate: String) =
            mapOf(
                "common.xsl" to loadBytes("/docx/common.xsl"),
                "common-nl_NL.xsl" to loadBytes("/docx/$docxTemplate/nl_NL/common-nl_NL.xsl"),
                "common-uk_UK.xsl" to loadBytes("/docx/$docxTemplate/uk_UK/common-uk_UK.xsl")
            )

        private fun transformerFactory(docxTemplate: String) =
            TransformerFactory
                .newInstance()
                .apply {
                    setURIResolver { href, _ ->
                        val xslt = xslIncludesMap(docxTemplate).getOrElse(href.substringAfterLast("/")) {
                            error("Cannot find XSLT $href.")
                        }
                        StreamSource(ByteArrayInputStream(xslt))
                    }
                }

        internal fun createXslTemplate(docxTemplate: String, location: String) =
            transformerFactory(docxTemplate).newTemplates(StreamSource(ByteArrayInputStream(loadBytes(location))))

        private fun createDocxPartNamesXslTemplatesMap(docxTemplate: String, locale: String) =
            mapOf(
                "[Content_Types].xml" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/[Content_Types].xml.xsl"
                ),
                "docProps/core.xml" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/docProps/core.xml.xsl"
                ),
                "word/document.xml" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/word/document.xml.xsl"
                ),
                "word/footer1.xml" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/word/footer1.xml.xsl"
                ),
                "word/footer2.xml" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/word/footer2.xml.xsl"
                ),
                "word/header2.xml" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/word/header2.xml.xsl"
                ),
                "word/media/passport.photo" to createXslTemplate(
                    docxTemplate,
                    "/docx/$docxTemplate/$locale/word/media/passport.photo.xsl"
                )
            )

        private fun docxCoreTemplate(docxTemplate: String) =
            loadBytes("/docx/$docxTemplate/coreTemplate.docx")

        private fun docxPartNamesXslTemplatesMap(docxTemplate: String) =
            mapOf(
                "nl_NL" to createDocxPartNamesXslTemplatesMap(docxTemplate, "nl_NL"),
                "uk_UK" to createDocxPartNamesXslTemplatesMap(docxTemplate, "uk_UK"),
            )

        internal fun xslTransform(xmlBytes: ByteArray, xslTemplate: Templates): ByteArray {
            ByteArrayInputStream(xmlBytes)
                .use { xml ->
                    ByteArrayOutputStream()
                        .use { result ->
                            xslTemplate
                                .newTransformer()
                                .transform(StreamSource(xml), StreamResult(result))
                            return result.toByteArray()
                        }
                }
        }
    }

    override fun getMessageFingerprint(message: Message<JsonObject>): Optional<String> =
        Optional
            .ofNullable(message.headers()["authInfo"])
            .map { JsonObject(it).getString("accountId") }
            .map { accountId -> "$accountId: ${message.body().encode()}" }

    /**
     * Expected message body:
     *   {
     *     "locale": "nl_NL",
     *     "accountId": "id-of-account-to-generate-cv-for"
     *   }
     *
     * Response:
     *   {
     *     "fileName": "generated-cv.docx",
     *     "docxB64": "Base64-encoded-docx-data",
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        val locale = message.body().getString("locale", "nl_NL")
        val accountId = message.body().getString("accountId")
        Single
            .just(message.body())
            .flatMap(::fetchCvData)
            .flatMap { cvJson ->
                val docxTemplate = cvJson.getInstances("brand")
                    .firstOrNull()
                    ?.getString("docxTemplate")
                    ?: DEFAULT_DOCX_TEMPLATE
                xmlToDocx(convertToXml(cvJson), docxTemplate, locale)
                    .map { docxBytes ->
                        JsonObject()
                            .put("fileName", composeFileName(cvJson, locale))
                            .put("docxB64", String(Base64.getEncoder().encode(docxBytes)))
                    }
            }
            .subscribe(
                {
                    log.debug("Successfully generated $locale cv data for $accountId")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error generating $locale cv data for $accountId: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchCvData(requestData: JsonObject): Single<JsonObject> =
        vertx.eventBus()
            .rxRequest<JsonObject>(CV_FETCH_ADDRESS, requestData, deliveryOptions)
            .map { it.body() }

    internal fun convertToXml(json: JsonObject): ByteArray {
        val writer = ByteArrayOutputStream()
        jsonToXml(json, XMLOutputFactory.newInstance().createXMLStreamWriter(writer), CV_XML_NAMESPACE)
        return writer.toByteArray()
    }

    internal fun xmlToDocx(xmlBytes: ByteArray, docxTemplate: String, locale: String) =
        Flowable
            .fromIterable(docxPartNamesXslTemplatesMap(docxTemplate)[locale]?.entries)
            .parallel()
            .runOn(Schedulers.computation())
            .map { entry -> entry.key to xslTransform(xmlBytes, entry.value) }
            .sequential()
            .reduce(HashMap<String, ByteArray>()) { map, (docxEntryName, xsltBytes) ->
                map[docxEntryName] = xsltBytes
                map
            }
            .doOnSuccess {
                // Convert Base64 encoded entries, e.g. images, to binary data.
                b64BinaryEntryNames.forEach { b64BinaryEntryName ->
                    val binaryB64 = it[b64BinaryEntryName]
                    if (binaryB64 != null && binaryB64.isNotEmpty()) { // NOSONAR ignore SonarQube's 'advice' here
                        it[b64BinaryEntryName] = Base64.getDecoder().decode(String(binaryB64))
                    } else {
                        it.remove(b64BinaryEntryName)
                    }
                }
            }
            .map { preRenderedEntries ->
                val docxBytes = ByteArrayOutputStream()
                ZipOutputStream(docxBytes)
                    .use { docxOutputStream ->
                        ZipInputStream(ByteArrayInputStream(docxCoreTemplate(docxTemplate)))
                            .use { zipIn ->
                                var entry = zipIn.nextEntry
                                while (entry != null) {

                                    docxOutputStream.putNextEntry(ZipEntry(entry.name))
                                    docxOutputStream.write(preRenderedEntries.getOrElse(entry.name) { zipIn.readAllBytes() })
                                    docxOutputStream.closeEntry()

                                    zipIn.closeEntry()
                                    entry = zipIn.nextEntry
                                }
                            }
                    }
                docxBytes.toByteArray()
            }

    private fun composeFileName(cvEntities: JsonObject, locale: String): String {
        val name = when (val accountInstances = cvEntities.getValue("account")) {
            is JsonObject -> accountInstances.map.values
                .filterIsInstance<JsonObject>()
                .first()
                .getString("name")
                .replace(" ", "")

            else -> ""
        }
        return "CV_${locale.substring(3)}_$name.docx"
    }
}