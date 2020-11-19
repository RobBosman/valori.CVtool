package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.server.AuthInfo

internal object ReadOwnAuthInfoIntention: Intention {

  override fun match(address: String, body: Any, authInfo: AuthInfo) =
      address == AUTH_INFO_FETCH_ADDRESS
}