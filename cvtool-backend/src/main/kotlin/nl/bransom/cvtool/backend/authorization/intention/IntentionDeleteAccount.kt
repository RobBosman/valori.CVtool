package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.ModelUtils
import nl.bransom.cvtool.backend.ModelUtils.getInstanceIds
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.persistence.ACCOUNT_DELETE_ADDRESS

internal object IntentionDeleteAccount : Intention {

    override fun name() = "delete account"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        if (address != ACCOUNT_DELETE_ADDRESS)
            return false

        val bodyJson = ModelUtils.toJsonObject(body)
            ?: return false

        if (bodyJson.getInstanceIds("account").size != 1)
            return false

        return true
    }
}