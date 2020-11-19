package nl.valori.cvtool.server

import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent
import nl.valori.cvtool.server.authorization.*
import nl.valori.cvtool.server.authorization.AuthorizationRoles.*
import org.slf4j.LoggerFactory

internal object Authorizer {

  private val log = LoggerFactory.getLogger(Authorizer::class.java)

  private val ROLES_MAP = mapOf(
      ReadOwnAuthInfoIntention to setOf(),
      ReadOwnCvIntention to setOf(),
      UpdateOwnCvIntention to setOf(),
      ReadAllAccountsIntention to setOf(ADMIN, EE_LEAD, SALES),
      ReadOthersCvIntention to setOf(ADMIN, EE_LEAD, SALES),
      UpdateOthersCvIntention to setOf(ADMIN, EE_LEAD),
      UpdateRolesIntention to setOf(ADMIN)
  )

  internal fun BridgeEvent.authorize(authInfo: AuthInfo) {
    val address = rawMessage.getString("address")
    val body = rawMessage.getValue("body")
    val authorizedRoles = ROLES_MAP.entries.stream()
        .filter { (intention, _) -> intention.match(address, body, authInfo) }
        .map { (intention, roles) ->
          log.debug("Intention: ${intention.javaClass.simpleName}")
          roles
        }
        .findAny()
        .orElseThrow { error("No matching intention found for address '$address'.") }
    if (!authInfo.isAuthorized(authorizedRoles)) {
      throw IllegalAccessException("Insufficient rights")
    }
  }
}