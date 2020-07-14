package nl.valori.cvtool.server

import io.reactivex.subjects.SingleSubject
import io.vertx.core.Handler
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.oauth2.AccessToken
import io.vertx.ext.auth.oauth2.OAuth2ClientOptions
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.auth.oauth2.OAuth2Auth
import io.vertx.reactivex.ext.auth.oauth2.providers.OpenIDConnectAuth
import io.vertx.reactivex.ext.web.RoutingContext
import org.slf4j.LoggerFactory

internal object LoginHandler {

  private val log = LoggerFactory.getLogger(javaClass)
  private val oauth2: SingleSubject<OAuth2Auth> = SingleSubject.create()

  fun create(vertx: Vertx): Handler<RoutingContext> {
    val connectionString = vertx.orCreateContext.config().getString("loginConnectionString")
    val providerSite = connectionString.substringBefore("?")
    val clientID = connectionString.substringAfter("clientID=").substringBefore("&")
    val clientSecret = connectionString.substringAfterLast("clientSecret=").substringBefore("&")

    OpenIDConnectAuth.discover(
        vertx,
        OAuth2ClientOptions()
//          .setSite("https://login.microsoftonline.com/b44ed446-bdd4-46ab-a5b3-95ccdb7d4663/v2.0")
//          .setClientID("348af39a-f707-4090-bb0a-9e4dca6e4138")
//          .setClientSecret("_L2w?hG1ugvVch2i7GVC.Nji_50a64N?")
            .setSite(providerSite)
            .setClientID(clientID)
            .setClientSecret(clientSecret)) { res ->
      if (res.succeeded()) {
        log.debug("initialized OAuth2 client")
        oauth2.onSuccess(res.result())
      } else {
        log.error("Error initializing OAuth2 client: {}", res.cause())
        oauth2.onError(res.cause())
      }
    }

    return Handler { loginHandler(it) }
  }

  private fun loginHandler(routingContext: RoutingContext) {
    val authorizationCodes = routingContext.queryParam("code") // The authorizationCode is provided as a query parameter.
    if (authorizationCodes.size != 1) {
      requestAuthorizationCodeFromOAuthProvider(routingContext)
    } else {
      handleLoginAttempt(routingContext, authorizationCodes[0])
    }
  }

  private fun requestAuthorizationCodeFromOAuthProvider(routingContext: RoutingContext) {
    // Redirect to OAuth2 provider to obtain the authorizationCode.
    val loginUrl = routingContext
        .request()
        .absoluteURI()
        .substringBefore("?")
    oauth2
        .subscribe { oauth2 ->
          val authorizationUri = oauth2.authorizeURL(JsonObject()
              .put("redirect_uri", loginUrl)
              .put("scope", "openid Sites.ReadWrite.All Files.ReadWrite")
              .put("state", "2(#0/!~")
          )
          routingContext.response()
              .putHeader("Location", authorizationUri)
              .setStatusCode(302)
              .end()
        }
  }

  private fun handleLoginAttempt(routingContext: RoutingContext, authorizationCode: String) {
    val loginUrl = routingContext
        .request()
        .absoluteURI()
        .substringBefore("?")
    /*
    {
      "token_type": "Bearer",
      "scope": "Files.ReadWrite openid Sites.ReadWrite.All profile email",
      "expires_in": 3599,
      "ext_expires_in": 3599,
      "access_token": "eyJ0eXAiOiJKV1QiLCJub25jZSI6Im51QW1VQlJrblZ6anZsYU53MGFmVUFXN0lFLVNHY2Y3QXQ0VXRvZldPXzAiLCJhbGciOiJSUzI1NiIsIng1dCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSIsImtpZCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iNDRlZDQ0Ni1iZGQ0LTQ2YWItYTViMy05NWNjZGI3ZDQ2NjMvIiwiaWF0IjoxNTk0Njc2MDUzLCJuYmYiOjE1OTQ2NzYwNTMsImV4cCI6MTU5NDY3OTk1MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyQmdZRGdiYTNIOXM3MUQrVUdkc3NaSFB6VFpBK1h1L0xYZDBhMTM5a3A5OTFmSlNSTUEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IlZhbG9yaSBDVnRvb2wiLCJhcHBpZCI6IjM0OGFmMzlhLWY3MDctNDA5MC1iYjBhLTllNGRjYTZlNDEzOCIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQm9zbWFuIiwiZ2l2ZW5fbmFtZSI6IlJvYiIsImlwYWRkciI6Ijg1LjE0NS4yMDAuNjgiLCJuYW1lIjoiUm9iIEJvc21hbiIsIm9pZCI6ImQ0NWRlYTE3LTlkYmUtNDE0Ny1hOTZjLWQ1OGEzOGM2NTYxZCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yNDEwMDYwNTUzLTE5MTMwNDc2NTktMjg2ODczMDk3MS0xNDMwMCIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDczMEUxMDk1Iiwic2NwIjoiRmlsZXMuUmVhZFdyaXRlIG9wZW5pZCBTaXRlcy5SZWFkV3JpdGUuQWxsIHByb2ZpbGUgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiI5WmVlRVBkREZXTG5TMmtQR05ndDJMVjd1RVlQS0wzejdkNU9sb2h6em5ZIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkVVIiwidGlkIjoiYjQ0ZWQ0NDYtYmRkNC00NmFiLWE1YjMtOTVjY2RiN2Q0NjYzIiwidW5pcXVlX25hbWUiOiJSb2JCb3NtYW5AVmFsb3JpLm5sIiwidXBuIjoiUm9iQm9zbWFuQFZhbG9yaS5ubCIsInV0aSI6ImJiNC0yRExCUUU2aXI3OGFGU2JGQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfc3QiOnsic3ViIjoiQ29HekFnckJpeE8tMEp6d3laTncydUhoVlU5UTRUTXU4ZlNUN1ZiUHh6TSJ9LCJ4bXNfdGNkdCI6MTM1NjcyMjI1MX0.eBDLBPl6K7YeS99Gokn3Myc0ZlnBYTm8yIwD_OGZmkQgxjvxbkBAyTpWn15Ag0fdWuaZd5czQYu1C5nRgZTrX_ppxxfe866an0FqY9L3WmpXJnwrjm-8Q0UgjDnFoYgwWyggFX7AlYycRh2tj7rgZu8xhtKOjvMgJXLOajiemAPB6PAkYbI8QiYBtA_L7_KVMk1JcfH6sSiqiG97HplLIsvVe7ctb2_zzOhT4bA0xCTvVlSbCeiG1GYQKXonWb8GD2XC75AdHNnDEYWWxeEZu6Pr3LLN3DldWXgqhxqyxyuLhMVxGbZ_5y1ACtxnoUbEW60-F3mLzBa-3msflxfi8Q",
      "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSJ9.eyJhdWQiOiIzNDhhZjM5YS1mNzA3LTQwOTAtYmIwYS05ZTRkY2E2ZTQxMzgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vYjQ0ZWQ0NDYtYmRkNC00NmFiLWE1YjMtOTVjY2RiN2Q0NjYzL3YyLjAiLCJpYXQiOjE1OTQ2NzYwNTMsIm5iZiI6MTU5NDY3NjA1MywiZXhwIjoxNTk0Njc5OTUzLCJzdWIiOiJDb0d6QWdyQml4Ty0wSnp3eVpOdzJ1SGhWVTlRNFRNdThmU1Q3VmJQeHpNIiwidGlkIjoiYjQ0ZWQ0NDYtYmRkNC00NmFiLWE1YjMtOTVjY2RiN2Q0NjYzIiwidXRpIjoiYmI0LTJETEJRRTZpcjc4YUZTYkZBQSIsInZlciI6IjIuMCJ9.k06ItXyUpafA7IbTcAyj41L_Ka0dMqSJ1uAhDxfbETnpHMhRvyuRPWN6kNkljG60JYPp_9tO_JW40FyRjl57JwyHBq-yQxhI3Kl9fhu4T3crATOqrPqMK9IPeNGqEGgCIZsFFzFskAZh-qmtRtt6DqaDDjx01SD2zedaRw4yuDepM-vr-6SCSdqtXnLBe148OZeQXdg5iAkEuadDNmfin0tfgW3CP1RNjwSu_kUu7uzgicPbhewUuv90077fCuckk_MIVK1wG01GS0mTRPXqqfv2czmGKikXcqFhusGiAuUtqicRbMpt0SZh0WBHdrMQLSXj-iCYR6D_YztNvjaDfA",
      "expires_at": 1594679952862
    }
    */
    oauth2
        .flatMap {
          it.rxAuthenticate(JsonObject()
              .put("code", authorizationCode)
              .put("redirect_uri", loginUrl)
          )
        }
        .doOnSuccess { user ->
          // For some reason the signature of the received MS-AAD access_token is not valid.
          // (Validating the signature requires 'special processing', due to the nonce in the JWT,
          // see https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/issues/609.)
          // As a workaround we trust the access_token if the id_token is valid.
          val oauth2Token = user.delegate as AccessToken
          if (oauth2Token.accessToken() !== null && oauth2Token.idToken() !== null) {
            oauth2Token.setTrustJWT(true)
          }
          oauth2Token.setTrustJWT(true)
        }
        .subscribe(
            { verifiedUser ->
              log.debug("very well: {}", verifiedUser.principal().encodePrettily())
              routingContext.response()
                  .putHeader("content-type", "text/html")
                  .end("there you are: ${verifiedUser.principal().encodePrettily()}")
            },
            { error ->
              log.warn("bummer: {}", error)
              routingContext.response()
                  .putHeader("content-type", "text/html")
                  .end("bummer: ${error.message}")
            }
        )
  }
}