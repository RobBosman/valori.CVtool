package nl.valori.cvtool.backend.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.ADMIN
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.CONSULTANT
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.SALES
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.UNIT_LEAD
import nl.valori.cvtool.backend.authorization.intention.IntentionDeleteAccount
import nl.valori.cvtool.backend.authorization.intention.IntentionDownloadDemoCv
import nl.valori.cvtool.backend.authorization.intention.IntentionReadAllAccounts
import nl.valori.cvtool.backend.authorization.intention.IntentionReadAllAuthorizations
import nl.valori.cvtool.backend.authorization.intention.IntentionReadAllBusinessUnits
import nl.valori.cvtool.backend.authorization.intention.IntentionReadOtherCv
import nl.valori.cvtool.backend.authorization.intention.IntentionReadOwnAuthInfo
import nl.valori.cvtool.backend.authorization.intention.IntentionReadOwnCv
import nl.valori.cvtool.backend.authorization.intention.IntentionUpdateAuthorization
import nl.valori.cvtool.backend.authorization.intention.IntentionUpdateBusinessUnit
import nl.valori.cvtool.backend.authorization.intention.IntentionUpdateOtherCv
import nl.valori.cvtool.backend.authorization.intention.IntentionUpdateOwnCv
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory

internal object Authorizer {

    private val log = LoggerFactory.getLogger(Authorizer::class.java)

    private val REQUIRED_AUTHORIZATION_LEVELS = mapOf(
        IntentionReadOwnAuthInfo to CONSULTANT,
        IntentionReadOwnCv to CONSULTANT,
        IntentionReadOtherCv to SALES,
        IntentionReadAllAccounts to SALES,
        IntentionReadAllBusinessUnits to SALES,
        IntentionReadAllAuthorizations to SALES,
        IntentionUpdateOwnCv to CONSULTANT,
        IntentionUpdateOtherCv to UNIT_LEAD,
        IntentionUpdateBusinessUnit to UNIT_LEAD,
        IntentionUpdateAuthorization to ADMIN,
        IntentionDeleteAccount to ADMIN,
        IntentionDownloadDemoCv to ADMIN
    )

    /**
     * Verify if the authenticated user is authorized to execute this event.
     */
    internal fun authorize(
        messageAddress: String,
        messageBody: Any?,
        authInfo: AuthInfo,
        oldData: JsonObject
    ) {
        var toBeAuthorizedMessage = messageBody

        // Check if this message intends to delete any data.
        if (messageAddress == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
            val dataToBeDeleted = determineDataToBeDeleted(messageBody)
            if (dataToBeDeleted.isNotEmpty()) {
                // If so, then collect that data-to-be-deleted and add it to the message that is used for authorization.
                // NB: The original message body remains untouched!
                toBeAuthorizedMessage = replaceEntityInstances(messageBody, dataToBeDeleted, oldData)
                // Only authorize if the message still contains anything to save.
                // (We cannot and don't need to authorize deleting a non-existing object.)
                val isSomethingToBeSaved = toBeAuthorizedMessage.map.values
                    .filterIsInstance<Map<*, *>>()
                    .any { it.isNotEmpty() }
                if (!isSomethingToBeSaved)
                    return
            }
        }

        authorizeIntention(messageAddress, toBeAuthorizedMessage, authInfo)
    }

    internal fun replaceEntityInstances(
        sourceEntities: JsonObject,
        dataToBeDeleted: Map<String, List<String>>,
        replacementEntities: JsonObject
    ): JsonObject {

        // Compose a message body without the instances-to-be-removed and then add the fetched instances to that message.
        // First remove all references to data that must be deleted.
        val resultEntities = JsonObject(sourceEntities.encode())
        dataToBeDeleted.entries
            .forEach { (entityName, instanceIdsToBeDeleted) ->
                val resultEntity = resultEntities.getJsonObject(entityName)
                instanceIdsToBeDeleted
                    .forEach { instanceIdToBeDeleted -> resultEntity.remove(instanceIdToBeDeleted) }
            }

        // Now add the fetched (to-be-deleted) instances.
        replacementEntities.map.entries
            .forEach { (entityName, instances) ->
                val resultEntity = resultEntities.getJsonObject(entityName)
                toJsonObject(instances)
                    ?.forEach { (instanceId, instance) -> resultEntity.put(instanceId, instance) }
            }
        return resultEntities
    }

    internal fun determineDataToBeDeleted(messageBody: JsonObject) =
        messageBody.map.entries.asSequence()
            .map { (entityName, instances) ->
                val instanceIds =
                    toJsonObject(instances) // Ignore 'criteria' (JsonArray) and only consider 'instances' (JsonObject).
                        ?.filter { (_, instance) -> instance.toString() == "{}" }
                        ?.map { (instanceId, _) -> instanceId }
                        ?: emptyList()
                entityName to instanceIds
            }
            .filter { (_, instanceIds) -> instanceIds.isNotEmpty() } // Skip if there is nothing to be deleted.
            .toMap()

    internal fun authorizeIntention(address: String, messageData: Any?, authInfo: AuthInfo) {
        val matchedIntentions = REQUIRED_AUTHORIZATION_LEVELS.keys
            .filter { it.match(address, messageData, authInfo) }
            .toSet()
        if (matchedIntentions.isEmpty()) {
            val errorMessage = "No matching intention found for address '$address'."
            log.error(errorMessage)
            error(errorMessage)
        }

        val prohibitedIntentionNames = REQUIRED_AUTHORIZATION_LEVELS.entries
            .filter { (intention, _) -> matchedIntentions.contains(intention) }
            .filter { (_, requiredAuthorizationLevel) -> !authInfo.isAuthorized(requiredAuthorizationLevel) }
            .map { (intention, _) -> intention.name() }
            .toSet()
        if (prohibitedIntentionNames.isNotEmpty()) {
            val prohibitedText = prohibitedIntentionNames.joinToString(" and to ")
            log.debug("User ${authInfo.name} is prohibited to $prohibitedText.")
            throw IllegalAccessException("User ${authInfo.name} is prohibited to $prohibitedText.")
        }
    }
}