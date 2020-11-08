package nl.valori.cvtool.server.authorization

import io.vertx.ext.auth.authorization.Authorization
import io.vertx.ext.auth.authorization.AuthorizationContext

object AuthConsultant: Authorization {

  const val CONSULTANT_AUTHORITY = "CONSULTANT"

  override fun match(context: AuthorizationContext?): Boolean {
    context?.user()?.principal()
    return true
  }

  override fun verify(authorization: Authorization?) =
      authorization == this
}