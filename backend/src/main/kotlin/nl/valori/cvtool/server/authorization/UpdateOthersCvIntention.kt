package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.AuthInfo

internal object UpdateOthersCvIntention: Intention {

  override fun match(address: String, body: Any, authInfo: AuthInfo): Boolean {
    TODO("UpdateOthersCvIntention.match()")
  }
}