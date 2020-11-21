package nl.valori.cvtool.server.authorization

internal interface Intention {

  fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean
}