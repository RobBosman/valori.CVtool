package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.ModelUtils.toJsonObject

internal object IntentionReadOwnAuthInfo : Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    if (address != AUTH_INFO_FETCH_ADDRESS)
      return false

    val bodyJson = toJsonObject(body)
        ?: return false

    // Only consider fetching own account info.
    if (bodyJson.map["email"] != authInfo.email || bodyJson.map["name"] != authInfo.name)
      return false

    return true
  }
}