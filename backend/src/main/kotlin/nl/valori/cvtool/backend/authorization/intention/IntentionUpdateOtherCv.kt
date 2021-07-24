package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

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
                if (instancesMap != null) { // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
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
                        "businessUnit" -> {
                            // not applicable for IntentionUpdateOtherCv
                        }
                        "cv" -> {
                            // Referring to 'other' cvIds?
                            if (!authInfo.cvIds.containsAll(instancesMap.keys))
                                return true
                        }
                        else -> {
                            instancesMap.values
                                .mapNotNull { toJsonObject(it) }
                                .forEach { instance ->
                                    val accountId = instance.map["accountId"]
                                    val cvId = instance.map["cvId"]
                                    // Only consider 'own' accountId.
                                    if (accountId != null && accountId != authInfo.accountId)
                                        return true
                                    // Only allow 'own' cvIds.
                                    if (cvId != null && !authInfo.cvIds.contains(cvId))
                                        return true
                                }
                        }
                    }
                }
            }

        return false
    }
}