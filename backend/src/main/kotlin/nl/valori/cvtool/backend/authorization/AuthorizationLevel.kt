package nl.valori.cvtool.backend.authorization

internal enum class AuthorizationLevel {
  ADMIN,
  EE_LEAD,
  SALES,
  CONSULTANT;

  fun includesOrSuperseeds(other: AuthorizationLevel) =
      ordinal <= other.ordinal
}