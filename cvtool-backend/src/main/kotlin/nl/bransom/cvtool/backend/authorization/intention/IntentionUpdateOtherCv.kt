package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.ModelUtils.toJsonObject
import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOtherCv : Intention {

    override fun name() = "change other's cv"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        // Only consider 'saving' messages.
        if (address != MONGODB_SAVE_ADDRESS)
            return false

        val bodyJson = toJsonObject(body)
            ?: return false

        bodyJson.map.entries
            .forEach { (entityName, instances) ->
                val instancesMap = toJsonObject(instances)?.map
                // Ignore 'criteria' (JsonArray, so instancesMap == null) and only consider 'instances' (JsonObject).
                if (instancesMap != null && checkIntentionOfEntity(entityName, instancesMap, authInfo))
                    return true
            }

        return false
    }

    private fun checkIntentionOfEntity(
        entityName: String,
        instancesMap: Map<String, Any>,
        authInfo: AuthInfo
    ): Boolean {
        when (entityName) {
            "account" -> {
                // Referring to 'other' accountId(s) and NOT deleting the account?
                instancesMap.values
                    .mapNotNull { toJsonObject(it) }
                    .forEach { instance ->
                        val accountId = instance.map["_id"]
                        if (accountId != null && accountId != authInfo.accountId)
                            return true
                    }
            }
            "authorization" -> {
                // not applicable for IntentionUpdateOtherCv
            }
            "brand" -> {
                // not applicable for IntentionUpdateOtherCv
            }
            "businessUnit" -> {
                // not applicable for IntentionUpdateOtherCv
            }
            else -> {
                instancesMap.values
                    .mapNotNull { toJsonObject(it) }
                    .forEach { instance ->
                        val accountId = instance.map["accountId"]
                        // Only consider 'own' accountId.
                        if (accountId != null && accountId != authInfo.accountId)
                            return true
                    }
            }
        }
        return false
    }
}