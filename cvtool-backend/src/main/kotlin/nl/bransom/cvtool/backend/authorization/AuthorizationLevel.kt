package nl.bransom.cvtool.backend.authorization

internal enum class AuthorizationLevel {
    ADMIN,
    UNIT_LEAD,
    SALES,
    CONSULTANT;

    fun includesOrSuperseeds(other: AuthorizationLevel) =
        ordinal <= other.ordinal
}