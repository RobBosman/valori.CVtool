package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.AuthInfo
import nl.valori.cvtool.server.Model.getInstanceMap
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS

internal object UpdateOwnCvIntention: Intention {

  override fun match(address: String, body: Any, authInfo: AuthInfo): Boolean {
    if (address == MONGODB_SAVE_ADDRESS && body is JsonObject) {
      val accountIds = body.getInstanceMap("account").keys
      // AccountIds may only contain own accountId

      val cvIds = body.getInstanceMap("cv").keys

    }
    return false
  }
}