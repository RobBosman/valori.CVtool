package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.persistence.BRAND_DELETE_ADDRESS

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