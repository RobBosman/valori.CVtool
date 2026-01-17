package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.ModelUtils.getCriteria
import nl.bransom.cvtool.backend.ModelUtils.toJsonObject
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

internal object IntentionReadAllBrands : Intention {

    override fun name() = "read all brands"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        // Only consider fetch queries.
        if (address != MONGODB_FETCH_ADDRESS)
            return false

        val bodyJson = toJsonObject(body)
            ?: return false

        return bodyJson
            .getCriteria("brand")
            .any { criterion -> criterion.map.isEmpty() }
    }
}