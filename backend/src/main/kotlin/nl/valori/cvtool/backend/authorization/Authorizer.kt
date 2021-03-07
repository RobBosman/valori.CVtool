package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.Vertx
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.ADMIN
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.CONSULTANT
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.EE_LEAD
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.SALES
import nl.valori.cvtool.backend.authorization.intention.IntentionDeleteAccount
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
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory

internal object Authorizer {

    private val log = LoggerFactory.getLogger(Authorizer::class.java)
    private val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    private val REQUIRED_AUTHORIZATION_LEVELS = mapOf(
        IntentionReadOwnAuthInfo to CONSULTANT,
        IntentionReadOwnCv to CONSULTANT,
        IntentionReadOtherCv to SALES,
        IntentionReadAllAccounts to SALES,
        IntentionReadAllBusinessUnits to SALES,
        IntentionReadAllAuthorizations to SALES,
        IntentionUpdateOwnCv to CONSULTANT,
        IntentionUpdateOtherCv to EE_LEAD,
        IntentionUpdateBusinessUnit to EE_LEAD,
        IntentionUpdateAuthorization to ADMIN,
        IntentionDeleteAccount to ADMIN
    )

    /**
     * Verify if the authenticated user is authorized to execute this event.
     */
    internal fun authorize(
        vertx: Vertx,
        messageAddress: String,
        messageBody: Any?,
        authInfo: AuthInfo
    ): Single<AuthInfo> {
        // Check if this message intends to delete any data.
        if (messageAddress == MONGODB_SAVE_ADDRESS && messageBody is JsonObject) {
            val dataToBeDeleted = determineDataToBeDeleted(messageBody)
            if (dataToBeDeleted.isNotEmpty()) {
                // If so, then fetch dat data-to-be-deleted and add it to the message that is used for authorization.
                // NB: The original message body remains untouched!
                return fetchToBeDeletedData(vertx, dataToBeDeleted)
                    .map { replaceEntityInstances(messageBody, dataToBeDeleted, it) }
                    .doOnSuccess { toBeAuthorizedMessage ->
                        // Only authorize if the message still contains anything to save.
                        if (toBeAuthorizedMessage.map.values
                                .filterIsInstance<Map<*, *>>()
                                .any { it.isNotEmpty() }
                        ) {
                            authorizeIntention(messageAddress, toBeAuthorizedMessage, authInfo)
                        }
                    }
                    .map { authInfo }
            }
        }
        return Single.just(messageBody)
            .doOnSuccess { authorizeIntention(messageAddress, it, authInfo) }
            .map { authInfo }
    }

    /**
     * input:
     * {
     *   skill: {
     *     skill-1-to-be-deleted: {},
     *     skill-2: {
     *       _id: skill-2,
     *       cvId: cd-id-of-skill
     *       key: value
     *     }
     *   }
     * }
     *
     * output:
     * {
     *   skill: [{ _id: skill-1-to-be-deleted }]
     * }
     */
    private fun fetchToBeDeletedData(vertx: Vertx, dataToBeDeleted: Map<String, List<String>>): Single<JsonObject> {
        val queryForDataToBeDeleted = dataToBeDeleted
            .map { (entityName, instanceIds) ->
                entityName to JsonArray(instanceIds.map { JsonObject().put("_id", it) })
            }
            .toMap()
        return vertx
            .eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, JsonObject(queryForDataToBeDeleted), deliveryOptions)
            .map { it.body() }
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
            log.error("No matching intention found for address '$address'.")
            error("No matching intention found for address '$address'.")
        }

        val prohibitedIntentions = REQUIRED_AUTHORIZATION_LEVELS.entries
            .filter { (intention, _) -> matchedIntentions.contains(intention) }
            .filter { (_, requiredAuthorizationLevel) -> !authInfo.isAuthorized(requiredAuthorizationLevel) }
            .map { (intention, _) -> intention }
            .toSet()
        if (prohibitedIntentions.isNotEmpty()) {
            val prohibitedText = prohibitedIntentions.joinToString(" and to ", transform = Intention::name)
            log.debug("User ${authInfo.name} is prohibited to $prohibitedText.")
            throw IllegalAccessException("User ${authInfo.name} is prohibited to $prohibitedText.")
        }
    }
}