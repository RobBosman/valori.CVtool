package nl.valori.cvtool.server.authorization

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import nl.valori.cvtool.server.ModelUtils.toJsonObject
import nl.valori.cvtool.server.authorization.AuthorizationRoles.ADMIN
import nl.valori.cvtool.server.authorization.AuthorizationRoles.CONSULTANT
import nl.valori.cvtool.server.authorization.AuthorizationRoles.EE_LEAD
import nl.valori.cvtool.server.authorization.AuthorizationRoles.SALES
import org.slf4j.LoggerFactory

internal object Authorizer {

  private val log = LoggerFactory.getLogger(Authorizer::class.java)

  private val ROLES_MAP = mapOf(
      IntentionReadOwnAuthInfo to setOf(CONSULTANT),
      IntentionReadOwnCv to setOf(CONSULTANT),
      IntentionReadOtherCv to setOf(ADMIN, EE_LEAD, SALES),
      IntentionReadAllAccounts to setOf(ADMIN, EE_LEAD, SALES),
      IntentionReadAllBusinessUnits to setOf(ADMIN, EE_LEAD, SALES),
      IntentionReadAllRoles to setOf(ADMIN, EE_LEAD, SALES),
      IntentionUpdateOwnCv to setOf(CONSULTANT),
      IntentionUpdateOtherCv to setOf(ADMIN, EE_LEAD),
      IntentionUpdateRoles to setOf(ADMIN)
  )

  internal fun createQueryForDataToBeDeleted(messageBody: JsonObject) =
      messageBody.map.entries.asSequence()
          .map { (entityName, instances) ->
            val instanceIds = toJsonObject(instances) // Ignore 'criteria' and only consider 'instances'.
                ?.filter { (_, instance) -> instance.toString() == "{}" }
                ?.map { (instanceId, _) -> instanceId }
                ?: emptyList()
            entityName to instanceIds
          }
          .filter { (_, instanceIds) -> instanceIds.isNotEmpty() } // Skip if there is nothing to be deleted.
          .map { (entityName, instanceIds) ->
            entityName to JsonArray(instanceIds.map { JsonObject().put("_id", it) })
          }
          .toMap()

  internal fun authorize(address: String, messageData: Any?, authInfo: AuthInfo) {
    val authorizedRoles = ROLES_MAP.entries.stream()
        .filter { (intention, _) -> intention.match(address, messageData, authInfo) }
        .flatMap { (intention, authorizedRoles) ->
          if (!authInfo.isAuthorized(authorizedRoles)) {
            throw IllegalAccessException("User ${authInfo.name} is not authorized to ${intention.name()}")
          }
          log.debug("User ${authInfo.name} is authorized to ${intention.name()}")
          authorizedRoles.stream()
        }
        .reduce(HashSet<AuthorizationRoles>(), { acc, next -> acc.add(next); acc }, { x, _ -> x })
    if (authorizedRoles.isEmpty()) {
      log.error("No matching intention found for address '$address'.")
      error("No matching intention found for address '$address'.")
    }
  }
}