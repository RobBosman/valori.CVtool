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

  fun JsonObject.getInstanceMap(entity: String) =
      getJsonObject(entity, null)
          ?.map
          ?.mapValues {
            if (it.value !is JsonObject)
              throw IllegalStateException("Expected 'instance' of type JsonObject here, not ${it.value.javaClass.name}.")
            it.value as JsonObject
          }
          ?: emptyMap()

  fun jsonToXml(json: JsonObject, xmlWriter: XMLStreamWriter) {
    xmlWriter.writeStartDocument()
    xmlWriter.writeStartElement("root")

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
                valueMap.forEach { (tag, value) ->
                  if (tag != "_id")
                    writeJsonKeyValue(xmlWriter, tag.toString(), value)
                }
                xmlWriter.writeEndElement()
              }
        }

    xmlWriter.writeEndElement()
    xmlWriter.writeEndDocument()
  }

  private fun writeJsonKeyValue(xmlWriter: XMLStreamWriter, tag: String, value: Any?, cdata: Boolean = false) {
    if (value != null && value.toString().isNotBlank()) {
      xmlWriter.writeStartElement(tag)
      when (value) {
        is JsonObject -> value.map.forEach { (t, u) -> writeJsonKeyValue(xmlWriter, t, u, true) }
        is Map<*, *> -> value.forEach { (t, v) -> writeJsonKeyValue(xmlWriter, t as String, v, true) }
        is JsonArray -> value.forEach { writeJsonKeyValue(xmlWriter, tag, it) }
        is List<*> -> value.forEach { writeJsonKeyValue(xmlWriter, tag, it) }
        is String -> if (cdata) xmlWriter.writeCData(value) else xmlWriter.writeCharacters(value)
        else -> xmlWriter.writeCharacters(value.toString())
      }
      xmlWriter.writeEndElement()
    }
  }
}



















