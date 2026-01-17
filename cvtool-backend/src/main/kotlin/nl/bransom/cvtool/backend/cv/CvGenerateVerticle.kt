package nl.bransom.cvtool.backend.cv

import io.reactivex.Flowable
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.DebouncingVerticle
import nl.bransom.cvtool.backend.ModelUtils.convertToLocalizedJson
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.ModelUtils.jsonToXml
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.util.Base64
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream
import javax.xml.stream.XMLOutputFactory
import javax.xml.transform.Templates
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

const val CV_GENERATE_ADDRESS = "cv.generate"

typealias DocxTemplateName = String

internal class CvGenerateVerticle : DebouncingVerticle(CV_GENERATE_ADDRESS) {

    companion object {
        internal const val CV_XML_NAMESPACE = "https://ns.bransom.nl/cerios/cv/v20260101.xsd"
        internal val ALL_LOCALES = setOf("nl_NL", "uk_UK")
        private const val DEFAULT_DOCX_TEMPLATE = "CERIOS"

        private fun loadBytes(location: String) =
            CvGenerateVerticle::class.java.getResource(location)
                ?.readBytes()
                ?: error("Resource not found: $location")

        private val b64BinaryEntryNames = setOf(
            "word/media/passport.photo"
        )

        private val commonXslIncludesMaps = mapOf(
            "common.xsl" to loadBytes("/docx/common.xsl"),
            "mappings.xsl" to loadBytes("/docx/mappings.xsl"),
            "translations.xsl" to loadBytes("/docx/translations.xsl")
        )
        private val cachedXslIncludesMaps = mutableMapOf<DocxTemplateName, Map<String, ByteArray>>()
        private fun getXslIncludesMap(docxTemplate: DocxTemplateName) =
            cachedXslIncludesMaps
                .computeIfAbsent(docxTemplate) { templateName ->
                    commonXslIncludesMaps +
                            ("fragments.xsl" to loadBytes("/docx/$templateName/fragments.xsl"))
                }

        private fun transformerFactory(docxTemplate: DocxTemplateName) =
            TransformerFactory
                .newInstance()
                .apply {
                    setURIResolver { href, _ ->
                        val xslt = getXslIncludesMap(docxTemplate)
                            .getOrElse(href.substringAfterLast("/")) {
                                error("Cannot find XSLT $href.")
                            }
                        StreamSource(ByteArrayInputStream(xslt))
                    }
                }

        internal fun createXslTemplate(docxTemplate: DocxTemplateName, location: String): Templates =
            ByteArrayInputStream(loadBytes(location))
                .use {
                    transformerFactory(docxTemplate).newTemplates(StreamSource(it))
                }

        private val cachedDocxPartNamesXslTemplatesMaps = mutableMapOf<DocxTemplateName, Map<String, Templates>>()
        private fun getDocxPartNamesXslTemplatesMap(docxTemplate: DocxTemplateName) =
            cachedDocxPartNamesXslTemplatesMaps
                .computeIfAbsent(docxTemplate) { templateName ->
                    listOf(
                        "[Content_Types].xml",
                        "docProps/core.xml",
                        "word/_rels/footer1.xml.rels",
                        "word/_rels/footer2.xml.rels",
                        "word/document.xml",
                        "word/footer1.xml",
                        "word/footer2.xml",
                        "word/footer3.xml",
                        "word/header1.xml",
                        "word/header2.xml",
                        "word/media/passport.photo"
                    )
                        .associateWith { "/docx/$templateName/template/$it.xsl" }
                        .filterValues { CvGenerateVerticle::class.java.getResource(it) != null }
                        .mapValues { (_, location) -> createXslTemplate(templateName, location) }
                }

        private val cachedDocxTemplates = mutableMapOf<DocxTemplateName, ByteArray>()
        private fun getDocxTemplate(docxTemplate: DocxTemplateName) =
            cachedDocxTemplates
                .computeIfAbsent(docxTemplate) { templateName ->
                    loadBytes("/docx/$templateName/template.docx")
                }

        internal fun xslTransform(xmlBytes: ByteArray, xslTemplate: Templates, locale: String): ByteArray {
            ByteArrayInputStream(xmlBytes)
                .use { xml ->
                    ByteArrayOutputStream()
                        .use { result ->
                            xslTemplate
                                .newTransformer()
                                .apply { setParameter("cv_locale", locale) }
                                .transform(StreamSource(xml), StreamResult(result))
                            return result.toByteArray()
                        }
                }
        }
    }

    override fun getMessageFingerprint(message: Message<JsonObject>): String? =
        message.headers()["authInfo"]
            ?.let { authInfo: String -> JsonObject(authInfo).getString("accountId") }
            ?.let { accountId -> "$accountId: ${message.body().encode()}" }

    /**
     * Expected message body:
     *   {
     *     "locale": "nl_NL",
     *     "accountId": "id-of-account-to-generate-cv-for"
     *     "docxTemplate": "CERIOS"
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
        val docxTemplateOverride = message.body().getString("docxTemplate")
        Single
            .just(message.body())
            .flatMap(::fetchCvData)
            .flatMap { cvJson ->
                val defaultDocxTemplate =
                    cvJson.getInstances("brand")
                        .firstOrNull()
                        ?.getString("docxTemplate")
                        ?: DEFAULT_DOCX_TEMPLATE
                val docxTemplate = docxTemplateOverride ?: defaultDocxTemplate
                val docxJson = convertToLocalizedJson(cvJson, locale)
                val docxXml = convertToDocxXml(docxJson)
                xmlToDocx(docxXml, docxTemplate, locale)
                    .map { docxBytes ->
                        JsonObject()
                            .put("fileName", composeFileName(cvJson, locale, defaultDocxTemplate, docxTemplateOverride))
                            .put("docxB64", String(Base64.getEncoder().encode(docxBytes)))
                    }
            }
            .subscribe(
                {
                    log.debug("Successfully generated $locale cv data for $accountId")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error generating $locale cv data for account $accountId: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchCvData(requestData: JsonObject): Single<JsonObject> =
        vertx.eventBus()
            .rxRequest<JsonObject>(CV_FETCH_ADDRESS, requestData, deliveryOptions)
            .map { it.body() }

    internal fun convertToDocxXml(json: JsonObject): ByteArray {
        val writer = ByteArrayOutputStream()
        jsonToXml(json, XMLOutputFactory.newInstance().createXMLStreamWriter(writer), CV_XML_NAMESPACE)
        return writer.toByteArray()
    }

    internal fun xmlToDocx(xmlBytes: ByteArray, docxTemplate: DocxTemplateName, locale: String) =
        Flowable
            .fromIterable(getDocxPartNamesXslTemplatesMap(docxTemplate).entries)
            .parallel()
            .runOn(Schedulers.computation())
            .map { entry -> entry.key to xslTransform(xmlBytes, entry.value, locale) }
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
                        ZipInputStream(ByteArrayInputStream(getDocxTemplate(docxTemplate)))
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

    // CV_$LOCALE_$BRAND_$ACCOUNTNAME_[TEMPLATE-OVERRIDE].docx, e.g. CV_NL_Cerios_RobBosman_[VALORI-CLASSIC].docx
    private fun composeFileName(
        cvEntities: JsonObject,
        locale: String,
        defaultDocxTemplate: String,
        docxTemplateOverride: String?
    ): String {
        val brand = when (val brandInstances = cvEntities.getValue("brand")) {
            is JsonObject -> brandInstances.map.values
                .filterIsInstance<JsonObject>()
                .first()
                .getString("name")
                .replace(" ", "")

            else -> ""
        }
        val unit = when (val unitInstances = cvEntities.getValue("businessUnit")) {
            is JsonObject -> unitInstances.map.values
                .filterIsInstance<JsonObject>()
                .firstOrNull()
                ?.getString("name")
                ?.replace(" ", "")
                ?: ""

            else -> ""
        }
        val accountName = when (val accountInstances = cvEntities.getValue("account")) {
            is JsonObject -> accountInstances.map.values
                .filterIsInstance<JsonObject>()
                .first()
                .getString("name")
                .replace(" ", "")

            else -> ""
        }
        val appliedDocxTemplate = when {
            docxTemplateOverride != null && docxTemplateOverride != defaultDocxTemplate -> "[$docxTemplateOverride]"
            else -> ""
        }
        return listOf("CV", locale.substring(3), brand.ifBlank { unit }, accountName, appliedDocxTemplate)
            .filter { it.isNotBlank() }
            .joinToString("_") + ".docx"
    }
}