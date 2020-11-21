package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.CV_FETCH_ADDRESS

internal object IntentionReadOtherCv : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo) =
      address == CV_FETCH_ADDRESS
          && body is JsonObject
          && body.getString("accountId", "") != authInfo.accountId
}