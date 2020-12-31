package nl.valori.cvtool.backend.authorization.intention

import io.vertx.core.json.JsonArray
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.backend.cv.CV_GENERATE_ADDRESS
import nl.valori.cvtool.backend.cv.CV_SEARCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

internal object IntentionReadOtherCv : Intention {

    override fun name() = "read other's cv"

    override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
        val bodyJson = toJsonObject(body)
            ?: return false

        if (address == CV_FETCH_ADDRESS || address == CV_GENERATE_ADDRESS) {
            val accountId = bodyJson.map["accountId"]
            if (accountId != null && accountId != authInfo.accountId)
                return true
        }

        if (address == CV_SEARCH_ADDRESS) {
            if (bodyJson.map["searchText"] != null)
                return true
        }

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
                                // Only consider 'other' account.
                                val accountId = criterion.map["_id"]
                                if (accountId != null && accountId != authInfo.accountId)
                                    return true
                            }
                            "authorization" -> {
                            }
                            "businessUnit" -> {
                            }
                            "cv" -> {
                                val accountId = criterion.map["accountId"]
                                val cvId = criterion.map["_id"]
                                // 'Read all' queries also match here.
                                if (accountId == null && cvId == null)
                                    return true
                                // Only consider 'other' accountId.
                                if (accountId != null && authInfo.accountId != accountId)
                                    return true
                                // Only consider 'other' cv.
                                if (cvId != null && !authInfo.cvIds.contains(cvId))
                                    return true
                            }
                            else -> {
                                val accountId = criterion.map["accountId"]
                                val cvId = criterion.map["cvId"]
                                // 'Read all' queries also match here.
                                if (accountId == null && cvId == null)
                                    return true
                                // Only consider 'other' accountId.
                                if (accountId != null && authInfo.accountId != accountId)
                                    return true
                                // Only consider 'other' cvIds.
                                if (cvId != null && !authInfo.cvIds.contains(cvId))
                                    return true
                            }
                        }
                    }
            }

        return false
    }
}