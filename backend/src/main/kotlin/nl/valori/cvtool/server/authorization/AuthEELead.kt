package nl.valori.cvtool.server.authorization

import io.vertx.ext.auth.authorization.Authorization
import io.vertx.ext.auth.authorization.AuthorizationContext

object AuthEELead: Authorization {

  const val EE_LEAD_AUTHORITY = "EE_LEAD"

  override fun match(context: AuthorizationContext?): Boolean {
    context?.user()?.principal()
    return true
  }

  override fun verify(authorization: Authorization?) =
      authorization == this
}