package nl.valori.cvtool.server

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import javax.xml.stream.XMLStreamWriter

object Model {

  fun composeAccountInstance(id: String, email: String, name: String) =
      JsonObject("""
        {
          "_id": "$id",
          "email": "${email.toUpperCase()}",
          "name": "$name",
          "businessUnitIds": [],
          "privileges": [],
          "dateOfBirth": "",
          "residence": ""
        }
        """.trimIndent())

  fun composeCvInstance(id: String, accountId: String) =
      JsonObject("""
        {
          "_id": "$id",
          "accountId": "$accountId",
          "role": {},
          "personalProfile": {},
          "interests": {},
          "workingSince": "",
          "inItSince": ""
        }""".trimIndent())

  fun composeEntity(entity: String, instance: JsonObject): JsonObject =
      JsonObject()
          .put(entity, JsonObject()
              .put(instance.getString("_id"), instance))

  fun JsonObject.getInstanceIds(entityName: String) =
      when (val entity = getValue(entityName)) {
        is JsonObject -> entity.map.keys
        else -> emptySet()
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



















