package nl.valori.cvtool.backend.persistence

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.ModelUtils.getInstances

const val ACCOUNT_DELETE_ADDRESS = "account.delete"

internal class AccountDeleteVerticle : BasicVerticle(ACCOUNT_DELETE_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "account": {
     *       "id-of-account-to-delete": {}
     *     }
     *   }
     *
     * Response:
     *   {
     *     "result": "Successfully saved data"
     *   }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        Single
            .just(message.body())
            .map { it.getInstanceIds("account").elementAtOrElse(0) { "" } }
            .doOnSuccess { if (it === "") error("'accountId' is not specified.") }
            .flatMap { accountId ->
                fetchMetaData(accountId)
                    .flatMap { metaData ->
                        deleteAccount(accountId, metaData)
                    }
            }
            .subscribe(
                {
                    log.debug("Successfully deleted account")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error deleting account: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchMetaData(accountId: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    """{
                        "authorization": [{ "accountId": "$accountId" }],
                        "characteristics": [{ "accountId": "$accountId" }],
                        "education": [{ "accountId": "$accountId" }],
                        "training": [{ "accountId": "$accountId" }],
                        "skill": [{ "accountId": "$accountId" }],
                        "publication": [{ "accountId": "$accountId" }],
                        "reference": [{ "accountId": "$accountId" }],
                        "experience": [{ "accountId": "$accountId" }],
                        "businessUnit": [{}]
                    }"""
                ),
                deliveryOptions
            )
            .map { it.body() }

    private fun deleteAccount(accountId: String, metaData: JsonObject): Single<JsonObject> {
        val combinedCriteria = composeDeleteCriteria(accountId, metaData)
        log.debug("Deleting account $accountId:\n${combinedCriteria.encodePrettily()}")
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, combinedCriteria, deliveryOptions)
            .map { it.body() }
    }

    private fun composeDeleteCriteria(accountId: String, metaData: JsonObject): JsonObject {
        // Combine all account-related instances and convert them into deleteCriteria.
        val instanceIdsToDelete = HashMap<String, Set<String>>()
        listOf(
            "authorization",
            "characteristics",
            "education",
            "training",
            "skill",
            "publication",
            "reference",
            "experience"
        )
            .forEach { instanceIdsToDelete[it] = metaData.getInstanceIds(it) }
        val deleteCriteria = convertInstanceIdsIntoDeleteCriteria(instanceIdsToDelete)

        // Add updateCriteria for the businessUnits.
        val combinedCriteria = composeBusinessUnitUpdateCriteria(accountId, metaData)
        deleteCriteria
            .forEach { (entityName, criteria) -> combinedCriteria.put(entityName, criteria) }

        // And add deleteCriteria for the account-instance.
        combinedCriteria.put("account", JsonObject().put(accountId, JsonObject()))
        return combinedCriteria
    }

    private fun composeBusinessUnitUpdateCriteria(accountId: String, metaData: JsonObject): JsonObject {
        val instanceUpdateCriteria = JsonObject()
        metaData
            .getInstances("businessUnit")
            .filter { it.getJsonArray("accountIds").contains(accountId) }
            .forEach {
                it.getJsonArray("accountIds").remove(accountId)
                instanceUpdateCriteria.put(it.getString("_id"), it)
            }
        return JsonObject().put("businessUnit", instanceUpdateCriteria)
    }

    private fun convertInstanceIdsIntoDeleteCriteria(instanceIdsPerEntity: Map<String, Set<String>>) =
        JsonObject(instanceIdsPerEntity.entries
            .map { (entityName, instanceIds) ->
                val deleteCriteria = JsonObject()
                instanceIds
                    .forEach { deleteCriteria.put(it, JsonObject()) }
                entityName to deleteCriteria
            }
            .filter { (_, deleteCriteria) -> !deleteCriteria.isEmpty }
            .toMap())
}