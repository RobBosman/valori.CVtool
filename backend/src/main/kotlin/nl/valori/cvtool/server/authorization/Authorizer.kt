package nl.valori.cvtool.server.authorization

import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent
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
      IntentionUpdateOwnCv to setOf(CONSULTANT),
      IntentionReadAllAccounts to setOf(ADMIN, EE_LEAD, SALES),
      IntentionReadAllBusinessUnits to setOf(ADMIN, EE_LEAD, SALES),
      IntentionReadAllRoles to setOf(ADMIN, EE_LEAD, SALES),
      IntentionReadOtherCv to setOf(ADMIN, EE_LEAD, SALES),
      IntentionUpdateOtherCv to setOf(ADMIN, EE_LEAD),
      IntentionUpdateRoles to setOf(ADMIN)
  )

  internal fun BridgeEvent.authorize(authInfo: AuthInfo) {
    val address = rawMessage.getString("address")
    val body = rawMessage.getValue("body")
    val authorizedRoles = ROLES_MAP.entries.stream()
        .filter { (intention, _) -> intention.match(address, body, authInfo) }
        .flatMap { (intention, roles) ->
          log.info("============================================================== ${intention.javaClass.simpleName}")
          roles.stream()
        }
        .reduce(HashSet<AuthorizationRoles>(), { acc, next -> acc.add(next); acc }, { x, _ -> x })
    if (authorizedRoles.isEmpty()) {
      error("No matching intention found for address '$address'.")
    }
    if (!authInfo.isAuthorized(authorizedRoles)) {
      throw IllegalAccessException("Insufficient rights")
    }
  }
}