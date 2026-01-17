package nl.bransom.cvtool.backend.authorization

internal interface Intention {

    fun name(): String

    fun match(address: String, body: Any?, authInfo: AuthInfo): Boolean
}