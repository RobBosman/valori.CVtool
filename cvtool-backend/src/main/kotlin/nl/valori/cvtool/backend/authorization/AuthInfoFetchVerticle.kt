package nl.valori.cvtool.backend.authorization

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.addEntity
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.authorization.AuthorizationLevel.CONSULTANT
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import java.util.UUID

const val AUTH_INFO_FETCH_ADDRESS = "authInfo.fetch"

internal class AuthInfoFetchVerticle : BasicVerticle(AUTH_INFO_FETCH_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "email": "P.Puk@valori.nl",
     *     "name": "Pietje Puk"
     *   }
     *
     * Response:
     *   {
     *     "email": "P.Puk@valori.nl",
     *     "name": "Pietje Puk",
     *     "authorizationLevel": "SALES",
     *     "accountId": "1111-2222-5555-7777"
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message.body())
            .map(::createAuthInfo)
            .flatMap(::addAccountInfo)
            .flatMap(::addAuthorizationLevel)
            .map(AuthInfo::toJson)
            .subscribe(
                {
                    log.debug("Successfully fetched accountInfo")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching accountInfo: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )
    }

    private fun createAuthInfo(json: JsonObject) =
        AuthInfo(
            json.map["email"]?.toString() ?: error("Error creating AuthInfo: email not found."),
            json.map["name"]?.toString() ?: error("Error creating AuthInfo: name not found.")
        )

    private fun addAccountInfo(authInfo: AuthInfo) =
        fetchOrCreateAccount(authInfo.email, authInfo.name)
            .map { account -> authInfo.withAccountId(account.getString("_id", "")) }

    private fun fetchOrCreateAccount(email: String, name: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    $$"""
                    {
                        "account": [{ "email": { "$regex": "$${email.substringBefore("@")}", "$options": "i" } }]
                    }
                    """
                ),
                deliveryOptions
            )
            .map { it.body().getJsonObject("account", JsonObject()).map.values }
            .flatMap { accounts ->
                when (accounts.size) {
                    0 -> createAccount(email, name)
                    1 -> Single.just(accounts.iterator().next() as JsonObject)
                    else -> error("Found ${accounts.size} accounts for $email.")
                }
            }

    private fun createAccount(email: String, name: String): Single<JsonObject> {
        val accountId = UUID.randomUUID().toString()
        val accountInstance = composeAccountInstance(accountId, email, name)
        val authorization = composeAuthorizationInstance(UUID.randomUUID().toString(), accountId, CONSULTANT.name)
        val saveRequest = JsonObject()
            .addEntity("account", accountInstance)
            .addEntity("authorization", authorization)
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, saveRequest, deliveryOptions)
            .map { accountInstance }
    }

    private fun composeAccountInstance(id: String, email: String, name: String) =
        JsonObject(
            """
            {
                "_id": "$id",
                "email": "${email.uppercase()}",
                "name": "$name",
                "dateOfBirth": "",
                "residence": ""
            }
            """
        )

    private fun composeAuthorizationInstance(id: String, accountId: String, level: String) =
        JsonObject(
            """
            {
                "_id": "$id",
                "accountId": "$accountId",
                "level": "$level"
            }
            """
        )

    private fun addAuthorizationLevel(authInfo: AuthInfo) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    """
                    {
                        "authorization": [{ "accountId": "${authInfo.accountId}" }]
                    }
                    """
                ),
                deliveryOptions
            )
            .map {
                authInfo
                    .withAuthorizationLevel(
                        it.body()
                            .getInstances("authorization")
                            .map { authorizationLevel -> authorizationLevel.getString("level", "") }
                            .first()
                    )
            }
}