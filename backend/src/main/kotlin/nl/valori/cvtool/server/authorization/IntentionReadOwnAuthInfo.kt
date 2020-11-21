package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.server.AuthInfo

internal object IntentionReadOwnAuthInfo: Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo) =
      address == AUTH_INFO_FETCH_ADDRESS
          && body is JsonObject
          && body.getString("email", "") == authInfo.email
}