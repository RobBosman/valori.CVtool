package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.ModelUtils.toJsonObject
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateBrand : Intention {

    override fun name() = "change brand"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        // Only consider save queries.
        if (address != MONGODB_SAVE_ADDRESS)
            return false

        val bodyJson = toJsonObject(body)
            ?: return false

        // Only consider queries updating brands.
        bodyJson.getInstances("brand")
            .filter { brandInstance -> !brandInstance.isEmpty } // Don't allow deleting brands.
            .forEach { brandInstance ->
                // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                if (toJsonObject(brandInstance) != null)
                    return true
            }

        return false
    }
}