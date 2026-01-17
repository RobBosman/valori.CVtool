package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.ModelUtils
import nl.bransom.cvtool.backend.ModelUtils.getInstanceIds
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.persistence.BRAND_DELETE_ADDRESS

internal object IntentionDeleteBrand : Intention {

    override fun name() = "delete brand"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        if (address != BRAND_DELETE_ADDRESS)
            return false

        val bodyJson = ModelUtils.toJsonObject(body)
            ?: return false

        if (bodyJson.getInstanceIds("brand").size != 1)
            return false

        return true
    }
}