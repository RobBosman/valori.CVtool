package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.authorization.AuthorizationLevel.ADMIN
import nl.valori.cvtool.server.authorization.AuthorizationLevel.CONSULTANT
import nl.valori.cvtool.server.authorization.AuthorizationLevel.EE_LEAD
import nl.valori.cvtool.server.authorization.AuthorizationLevel.SALES
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
      IntentionUpdateOtherCv to EE_LEAD,
      IntentionUpdateBusinessUnits to EE_LEAD,
      IntentionUpdateAuthorizations to ADMIN
  )

  internal fun determineDataToBeDeleted(messageBody: JsonObject) =
      messageBody.map.entries.asSequence()
          .map { (entityName, instances) ->
            val instanceIds = toJsonObject(instances) // Ignore 'criteria' and only consider 'instances'.
                ?.filter { (_, instance) -> instance.toString() == "{}" }
                ?.map { (instanceId, _) -> instanceId }
                ?: emptyList()
            entityName to instanceIds
          }
          .filter { (_, instanceIds) -> instanceIds.isNotEmpty() } // Skip if there is nothing to be deleted.
          .toMap()

  internal fun authorize(address: String, messageData: Any?, authInfo: AuthInfo) {
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