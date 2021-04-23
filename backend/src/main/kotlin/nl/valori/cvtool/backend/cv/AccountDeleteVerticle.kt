package nl.valori.cvtool.backend.cv

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.ACCOUNT_RELATED_ENTITY_NAMES
import nl.valori.cvtool.backend.ModelUtils.CV_RELATED_ENTITY_NAMES
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.ModelUtils.getInstances
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS

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
                        fetchCvData(metaData)
                            .flatMap { cvData ->
                                deleteAccount(accountId, metaData, cvData)
                            }
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
                        "cv": [{ "accountId": "$accountId" }],
                        "businessUnit": [{}]
                    }"""
                ),
                deliveryOptions
            )
            .map { it.body() }

    private fun fetchCvData(metaData: JsonObject): Single<JsonObject> {
        val cvIdCriterion = JsonArray()
        metaData
            .getInstances("cv")
            .forEach { cvIdCriterion.add(JsonObject().put("cvId", it.map["_id"])) }
        if (cvIdCriterion.isEmpty) {
            return Single.just(JsonObject())
        }

        val fetchCriteria = JsonObject()
        CV_RELATED_ENTITY_NAMES
            .forEach { fetchCriteria.put(it, cvIdCriterion) }
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, fetchCriteria, deliveryOptions)
            .map { it.body() }
    }

    private fun deleteAccount(accountId: String, metaData: JsonObject, cvData: JsonObject): Single<JsonObject> {
        // Combine all cv- and account-related instances and convert them into deleteCriteria.
        val instanceIdsToDelete = HashMap<String, Set<String>>()
        ACCOUNT_RELATED_ENTITY_NAMES
            .forEach { instanceIdsToDelete[it] = metaData.getInstanceIds(it) }
        CV_RELATED_ENTITY_NAMES
            .forEach { instanceIdsToDelete[it] = cvData.getInstanceIds(it) }
        val deleteCriteria = convertInstanceIdsIntoDeleteCriteria(instanceIdsToDelete)

        // Add updateCriteria for the businessUnits.
        val combinedCriteria = composeBusinessUnitUpdateCriteria(accountId, metaData)
        deleteCriteria
            .forEach { (entityName, criteria) -> combinedCriteria.put(entityName, criteria) }

        // And add deleteCriteria for the account-instance.
        combinedCriteria.put("account", JsonObject().put(accountId, JsonObject()))

        log.debug("Deleting account $accountId:\n${combinedCriteria.encodePrettily()}")
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, combinedCriteria, deliveryOptions)
            .map { it.body() }
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