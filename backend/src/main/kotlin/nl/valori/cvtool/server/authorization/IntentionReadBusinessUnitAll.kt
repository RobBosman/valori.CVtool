package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS

internal object IntentionReadBusinessUnitAll : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo) =
      if (address == MONGODB_FETCH_ADDRESS && body is JsonObject) {
        val accountCriteria = body.getJsonArray("businessUnit")
        accountCriteria != null && (accountCriteria.isEmpty || accountCriteria.toString() == "[{}]")
      } else {
        false
      }
}