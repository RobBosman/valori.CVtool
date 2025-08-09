package nl.valori.cvtool.backend

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import javax.xml.stream.XMLStreamWriter

object ModelUtils {

    data class LocalizableField(
        val fieldName: String,
        val fallbackLocale: String? = null
    )

    private val LOCALIZABLE_FIELDS_PER_ENTITY = mapOf(
        "characteristics" to setOf(
            LocalizableField("role", "nl_NL"),
            LocalizableField("profile"),
            LocalizableField("interests")
        ),
        "skill" to setOf(
            LocalizableField("description", "nl_NL")
        ),
        "education" to setOf(
            LocalizableField("name", "nl_NL")
        ),
        "training" to setOf(
            LocalizableField("name", "nl_NL")
        ),
        "experience" to setOf(
            LocalizableField("role", "nl_NL"),
            LocalizableField("assignment"),
            LocalizableField("activities"),
            LocalizableField("results"),
            LocalizableField("keywords", "nl_NL")
        ),
        "publication" to setOf(
            LocalizableField("title", "nl_NL"),
            LocalizableField("description")
        ),
        "reference" to setOf(
            LocalizableField("referentFunction", "nl_NL"),
            LocalizableField("description")
        )
    )

    fun JsonObject.hasInstances(entityName: String) =
        !getJsonObject(entityName, JsonObject()).isEmpty

    fun JsonObject.addEntity(entity: String, instance: JsonObject): JsonObject =
        put(entity, JsonObject().put(instance.getString("_id"), instance))

    fun JsonObject.getInstanceIds(entityName: String) =
        when (val entity = getValue(entityName)) {
            is JsonObject -> entity.map.keys
            else -> emptySet()
        }

    fun JsonObject.getInstances(entityName: String) =
        when (val entity = getValue(entityName)) {
            is JsonObject -> entity.map.values.mapNotNull(::toJsonObject)
            else -> emptyList()
        }

    fun JsonObject.getCriteria(entityName: String): List<JsonObject> {
        return when (val criteria = getValue(entityName)) {
            is JsonArray -> criteria.list.mapNotNull(::toJsonObject)
            else -> emptyList()
        }
    }

    fun toJsonObject(value: Any?) =
        when (value) {
            is JsonObject -> value
            is Map<*, *> -> JsonObject(value.mapKeys { "${it.key}" })
            else -> null
        }

    /**
     * Flattens JSON nodes that contain localized data.
     * Note that the given JsonObject is converted *in place*; no data is copied.
     *
     * With locale value "uk_UK", this
     *     {
     *       "description": {
     *         "nl_NL": "Zomaar wat tekst.",
     *         "uk_UK": "Just some text."
     *       }
     *     }
     * is converted to this
     *     {
     *       "description": "Just some text."
     *     }
     */
    fun convertToLocalizedJson(json: JsonObject, locale: String) =
        json.apply {
            forEach { (entityName, instances) ->
                val localizableFields = LOCALIZABLE_FIELDS_PER_ENTITY[entityName]
                if (localizableFields != null && instances is JsonObject) {
                    instances.forEach { (_, instance) ->
                        if (instance is JsonObject) {
                            instance.forEach { (fieldName, fieldValue) ->
                                val localizable = localizableFields.find { it.fieldName == fieldName }
                                if (localizable != null && fieldValue is JsonObject) {
                                    val localizedText = fieldValue.getValue(locale)
                                        ?: localizable.fallbackLocale?.let { fieldValue.getValue(it) }
                                    instance.put(fieldName, localizedText)
                                }
                            }
                        }
                    }
                }
            }
        }

    fun jsonToXml(json: JsonObject, xmlWriter: XMLStreamWriter, defaultNamespaceURI: String) {
        xmlWriter.writeStartDocument()
        xmlWriter.writeStartElement("root")
        xmlWriter.writeDefaultNamespace(defaultNamespaceURI)

        json.map
            .forEach { (entity, instances) ->
                val instanceMap = when (instances) {
                    is Map<*, *> -> instances
                    is JsonObject -> instances.map
                    else -> error("Expected 'instances' to be a JsonObject or Map, not a ${instances.javaClass.name}.")
                }
                instanceMap
                    .forEach { (id, instance) ->
                        val valueMap = when (instance) {
                            is Map<*, *> -> instance
                            is JsonObject -> instance.map
                            else -> error("Expected 'instance' to be a JsonObject or Map, not a ${instance?.javaClass?.name}.")
                        }
                        xmlWriter.writeStartElement(entity)
                        xmlWriter.writeAttribute("id", id.toString())
                        valueMap.forEach { (localName, value) ->
                            if (localName != "_id")
                                writeJsonKeyValue(xmlWriter, localName.toString(), value)
                        }
                        xmlWriter.writeEndElement()
                    }
            }

        xmlWriter.writeEndElement()
        xmlWriter.writeEndDocument()
    }

    private fun writeJsonKeyValue(xmlWriter: XMLStreamWriter, localName: String, value: Any?, cdata: Boolean = false) {
        when (value) {
            null -> {
                // ignore
            }

            is JsonArray -> value.forEach { writeJsonKeyValue(xmlWriter, localName, it) }
            is List<*> -> value.forEach { writeJsonKeyValue(xmlWriter, localName, it) }
            is JsonObject -> {
                xmlWriter.writeStartElement(localName)
                value.map.forEach { (k, v) -> writeJsonKeyValue(xmlWriter, k, v, true) }
                xmlWriter.writeEndElement()
            }

            is Map<*, *> -> {
                xmlWriter.writeStartElement(localName)
                value.forEach { (k, v) -> writeJsonKeyValue(xmlWriter, k as String, v, true) }
                xmlWriter.writeEndElement()
            }

            is String -> {
                if (value.isNotBlank()) {
                    xmlWriter.writeStartElement(localName)
                    if (cdata) xmlWriter.writeCData(value) else xmlWriter.writeCharacters(value)
                    xmlWriter.writeEndElement()
                }
            }

            else -> {
                xmlWriter.writeStartElement(localName)
                xmlWriter.writeCharacters(value.toString())
                xmlWriter.writeEndElement()
            }
        }
    }
}



















