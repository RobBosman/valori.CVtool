package nl.valori.cvtool.backend.authorization.intention

import io.vertx.core.json.JsonArray
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.backend.cv.CV_GENERATE_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

internal object IntentionReadOwnCv : Intention {

    override fun name() = "read own cv"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        val bodyJson = toJsonObject(body)
            ?: return false

        if ((address == CV_FETCH_ADDRESS || address == CV_GENERATE_ADDRESS)
            && bodyJson.map["accountId"] == authInfo.accountId
        )
            return true

        if (address != MONGODB_FETCH_ADDRESS)
            return false

        bodyJson.map.entries
            .forEach { (entityName, criteria) ->
                val criteriaList = when (criteria) {
                    is List<*> -> criteria
                    is JsonArray -> criteria.list
                    else -> null // Ignore 'instances' and only consider 'criteria'.
                }
                criteriaList
                    ?.mapNotNull { toJsonObject(it) } // Only consider criteria that contain query objects.
                    ?.forEach { criterion ->
                        when (entityName) {
                            "account" -> {
                                // Only consider 'own' account.
                                if (authInfo.accountId == criterion.map["_id"])
                                    return true
                            }
                            "cv" -> {
                                // Only consider 'own' accountId.
                                if (authInfo.accountId == criterion.map["accountId"])
                                    return true
                                // Only consider 'own' cv.
                                if (authInfo.cvIds.contains(criterion.map["_id"]))
                                    return true
                            }
                            "authorization" -> {
                            }
                            "businessUnit" -> {
                            }
                            else -> {
                                // Only consider 'own' accountId.
                                if (authInfo.accountId == criterion.map["accountId"])
                                    return true
                                // Only consider 'own' cvIds.
                                if (authInfo.cvIds.contains(criterion.map["cvId"]))
                                    return true
                            }
                        }
                    }
            }

        return false
    }
}