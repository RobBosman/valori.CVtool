package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.AuthInfo

internal interface Intention {

  fun match(address: String, body: Any, authInfo: AuthInfo): Boolean
}