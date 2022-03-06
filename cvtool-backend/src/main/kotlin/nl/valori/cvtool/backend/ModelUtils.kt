package nl.valori.cvtool.backend

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import javax.xml.stream.XMLStreamWriter

object ModelUtils {

    val ACCOUNT_RELATED_ENTITY_NAMES = listOf(
        "authorization",
        "characteristics",
        "education",
        "training",
        "skill",
        "publication",
        "reference",
        "experience"
    )

    fun JsonObject.hasInstances(entityName: String) =
        !getJsonObject(entityName, JsonObject()).isEmpty

    fun composeAccountInstance(id: String, email: String, name: String) =
        JsonObject(
            """{
                "_id": "$id",
                "email": "${email.uppercase()}",
                "name": "$name",
                "dateOfBirth": "",
                "residence": ""
            }"""
        )

    fun composeAuthorizationInstance(id: String, accountId: String, level: String) =
        JsonObject(
            """{
                "_id": "$id",
                "accountId": "$accountId",
                "level": "$level"
            }"""
        )

    fun composeCharacteristicsInstance(id: String, accountId: String) =
        JsonObject(
            """{
                "_id": "$id",
                "accountId": "$accountId",
                "role": {},
                "profile": {},
                "interests": {}
            }"""
        )

    fun composeCvDataCriteria(accountId: String) =
        JsonObject(
            """{
                "account": [{ "_id": "$accountId" }],
                "characteristics": [{ "accountId": "$accountId" }],
                "education": [{ "accountId": "$accountId" }],
                "training": [{ "accountId": "$accountId" }],
                "skill": [{ "accountId": "$accountId" }],
                "publication": [{ "accountId": "$accountId" }],
                "reference": [{ "accountId": "$accountId" }],
                "experience": [{ "accountId": "$accountId" }]
            }"""
        )

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



















