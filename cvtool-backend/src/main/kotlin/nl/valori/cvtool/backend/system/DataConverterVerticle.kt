package nl.valori.cvtool.backend.system

import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.toJsonObject
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

const val CONVERT_DATA_ADDRESS = "convert.data"

class DataConverterVerticle : BasicVerticle(CONVERT_DATA_ADDRESS) {

    override fun handleRequest(message: Message<JsonObject>) {
        fetchUnconvertedAccountInstances()
            .map(::convertAccountInstances)
            .flatMap(::saveAccountInstances)
            .subscribe(
                { resultJson ->
                    log.info("Successfully converted data of all accounts.")
                    message.reply(resultJson)
                },
                {
                    val errorMsg = "Error converting account data: ${it.message}"
                    log.error(errorMsg, it)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    /**
     * Result: {
     *   account: {
     *     "aaaa-bbbb-cccc-dddd": {
     *       "_id": "aaaa-bbbb-cccc-dddd",
     *       "name": "Rob Bosman",
     *       "email": "rob.bosman@cerios.nl",
     *       ...
     *     },
     *     ...
     *   }
     * }
     */
    private fun fetchUnconvertedAccountInstances() =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject($$"""{ "account": [{ "username": { "$exists": false } }] }"""),
                deliveryOptions
            )
            .map { it.body() }
            .toFlowable()
            .singleOrError()

    private fun convertAccountInstances(accountEntity: JsonObject) =
        accountEntity.apply {
            getJsonObject("account")
                .map.values
                .mapNotNull(::toJsonObject)
                .forEach { accountInstance ->
                    val username = accountInstance.getString("email")
                        .substringBefore("@")
                        .replace(".", "")
                        .uppercase()
                    accountInstance.put("username", username)
                }
        }

    private fun saveAccountInstances(convertedAccountsJson: JsonObject) =
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, convertedAccountsJson, deliveryOptions.setSendTimeout(30_000))
            .map { convertedAccountsJson }
}