package nl.valori.cvtool.backend

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import javax.xml.stream.XMLStreamWriter

object ModelUtils {

  val ACCOUNT_RELATED_ENTITY_NAMES = listOf(
      "authorization",
      "cv"
  )

  val CV_RELATED_ENTITY_NAMES = listOf(
      "education",
      "training",
      "skill",
      "publication",
      "reference",
      "experience"
  )

  fun composeAccountInstance(id: String, email: String, name: String) =
      JsonObject("""
        {
          "_id": "$id",
          "email": "${email.toUpperCase()}",
          "name": "$name",
          "dateOfBirth": "",
          "residence": ""
        }
        """.trimIndent())

  fun composeAuthorizationInstance(id: String, accountId: String, level: String) =
      JsonObject("""
        {
          "_id": "$id",
          "accountId": "$accountId",
          "level": "$level"
        }
        """.trimIndent())

  fun composeCvInstance(id: String, accountId: String) =
      JsonObject("""
        {
          "_id": "$id",
          "accountId": "$accountId",
          "role": {},
          "profile": {},
          "interests": {}
        }""".trimIndent())

  fun composeCvDataCriteria(accountId: String, cvId: String?) =
      JsonObject("""{
          "cv": [{ "_id": "$cvId" }],
          "account": [{ "_id": "$accountId" }],
          "education": [{ "cvId": "$cvId" }],
          "training": [{ "cvId": "$cvId" }],
          "skill": [{ "cvId": "$cvId" }],
          "publication": [{ "cvId": "$cvId" }],
          "reference": [{ "cvId": "$cvId" }],
          "experience": [{ "cvId": "$cvId" }]
        }""".trimIndent())

  fun JsonObject.addEntity(entity: String, instance: JsonObject): JsonObject =
      put(entity, JsonObject()
          .put(instance.getString("_id"), instance))

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
            else -> throw IllegalArgumentException("Expected 'instances' to be a JsonObject or Map, not a ${instances.javaClass.name}.")
          }
          instanceMap
              .forEach { (id, instance) ->
                val valueMap = when (instance) {
                  is Map<*, *> -> instance
                  is JsonObject -> instance.map
                  else -> throw IllegalArgumentException("Expected 'instance' to be a JsonObject or Map, not a ${instance?.javaClass?.name}.")
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



















