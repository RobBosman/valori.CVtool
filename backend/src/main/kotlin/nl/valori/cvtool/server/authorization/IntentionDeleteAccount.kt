package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils
import nl.valori.cvtool.server.cv.ACCOUNT_DELETE_ADDRESS

internal object IntentionDeleteAccount : Intention {

  override fun name() = "delete account"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    if (address != ACCOUNT_DELETE_ADDRESS)
      return false

    val bodyJson = ModelUtils.toJsonObject(body)
        ?: return false

    if (bodyJson.map["accountId"] == null)
      return false

    return true
  }
}