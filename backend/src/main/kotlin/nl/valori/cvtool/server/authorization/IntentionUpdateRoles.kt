package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.AuthInfo

internal object IntentionUpdateRoles: Intention {

  override fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean {
    return false // TODO("UpdateRolesIntention.match()")
  }
}