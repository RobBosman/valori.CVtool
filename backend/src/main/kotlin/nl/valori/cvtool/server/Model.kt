package nl.valori.cvtool.server

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import java.util.stream.Collectors.joining

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

  fun jsonToXml(json: JsonObject): String {
    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<root>"
    json.map.forEach { (entity, instances) ->
      val instanceMap = when (instances) {
        is Map<*, *> -> instances
        is JsonObject -> instances.map
        else -> throw IllegalArgumentException("Expected 'instances' to be a JsonObjet or Map, not a ${instances.javaClass.name}.")
      }
      instanceMap.forEach { (id, instance) ->
        val valueMap = when (instance) {
          is Map<*, *> -> instance
          is JsonObject -> instance.map
          else -> throw IllegalArgumentException("Expected 'instance' to be a JsonObjet or Map, not a ${instance?.javaClass?.name}.")
        }
        xml += "<$entity id=\"$id\">"
        valueMap.forEach { (tag, value) ->
          if (tag != "_id")
            xml += jsonKeyValueToXml(tag, value)
        }
        xml += "</$entity>"
      }
    }
    xml += "</root>"
    return xml
  }

  private fun jsonKeyValueToXml(tag: Any?, value: Any?): String =
      when (value) {
        null, "" -> ""
        is JsonObject ->
          "<$tag>${
            value.map.entries.stream()
                .map { jsonKeyValueToXml(it.key, it.value) }
                .collect(joining())
          }</$tag>"
        is Map<*, *> ->
          "<$tag>${
            value.entries.stream()
                .map { jsonKeyValueToXml(it.key, it.value) }
                .collect(joining())
          }</$tag>"
        is JsonArray -> value.stream()
            .map { jsonKeyValueToXml(tag, it) }
            .collect(joining())
        is List<*> -> value.stream()
            .map { jsonKeyValueToXml(tag, it) }
            .collect(joining())
        is String -> "<$tag>${xmlEscape(value)}</$tag>"
        else -> "<$tag>$value</$tag>"
      }

  private fun xmlEscape(value: String) =
      value
          .replace("&", "\n&amp;")
          .replace("\n", "\n&#x0A;")
}



















