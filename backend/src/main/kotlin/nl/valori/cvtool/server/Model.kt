package nl.valori.cvtool.server

import io.vertx.core.json.JsonObject

object Model {

  fun composeAccountInstance(id: String, email: String, name: String) =
      JsonObject("""{
          "_id": "$id",
          "email": "$email",
          "name": "$name",
          "businessUnitIds": [],
          "privileges": [],
          "dateOfBirth": "",
          "residence": ""
        }
        """.trimIndent())

  fun composeCvInstance(id: String, accountId: String) =
      JsonObject("""{
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
}