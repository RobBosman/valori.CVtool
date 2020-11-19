package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.CV_FETCH_ADDRESS

internal object ReadOthersCvIntention : Intention {

  override fun match(address: String, body: Any, authInfo: AuthInfo) =
      if (address == CV_FETCH_ADDRESS && body is JsonObject) {
        val accountId = body.getString("accountId")
        accountId != null && accountId != authInfo.accountId
      } else {
        false
      }
}