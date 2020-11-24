package nl.valori.cvtool.server.authorization

internal interface Intention {

  fun name(): String

  fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean
}