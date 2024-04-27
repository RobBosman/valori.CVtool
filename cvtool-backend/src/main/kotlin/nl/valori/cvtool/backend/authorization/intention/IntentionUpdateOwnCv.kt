package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

internal object IntentionUpdateOwnCv : Intention {

    override fun name() = "change own cv"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        // Only consider 'save' messages.
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
                // Referring to 'own' accountId(s) and NOT deleting the account?
                instancesMap.values
                    .mapNotNull { toJsonObject(it) }
                    .forEach { instance ->
                        if (instance.map["_id"] == authInfo.accountId)
                            return true
                    }
            }
            "brand" -> {
                // not applicable for IntentionUpdateOwnCv
            }
            "businessUnit" -> {
                // not applicable for IntentionUpdateOwnCv
            }
            "authorization" -> {
                // not applicable for IntentionUpdateOwnCv
            }
            else -> {
                instancesMap.values
                    .mapNotNull { toJsonObject(it) }
                    .forEach { instance ->
                        val accountId = instance.map["accountId"]
                        // Only consider 'own' accountId.
                        if (accountId == authInfo.accountId)
                            return true
                    }
            }
        }
        return false
    }
}