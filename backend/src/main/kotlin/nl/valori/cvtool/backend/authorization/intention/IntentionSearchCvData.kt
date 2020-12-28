package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.cv.CV_SEARCH_ADDRESS

internal object IntentionSearchCvData : Intention {

  override fun name() = "search cv data"

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    if (address != CV_SEARCH_ADDRESS)
      return false

    val bodyJson = ModelUtils.toJsonObject(body)
        ?: return false

    if (bodyJson.map["searchText"] == null)
      return false

    return true
  }
}