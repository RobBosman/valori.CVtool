package nl.valori.cvtool.backend.authorization

internal interface Intention {

  fun name(): String

  fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean
}