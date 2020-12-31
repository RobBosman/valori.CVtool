package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention

internal object IntentionReadOwnAuthInfo : Intention {

    override fun name() = "read auth-info"

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