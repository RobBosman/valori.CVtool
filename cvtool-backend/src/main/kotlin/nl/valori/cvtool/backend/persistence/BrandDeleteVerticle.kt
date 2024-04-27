package nl.valori.cvtool.backend.persistence

import io.reactivex.Single
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.backend.BasicVerticle
import nl.valori.cvtool.backend.ModelUtils.getInstanceIds
import nl.valori.cvtool.backend.ModelUtils.getInstances

const val BRAND_DELETE_ADDRESS = "brand.delete"

internal class BrandDeleteVerticle : BasicVerticle(BRAND_DELETE_ADDRESS) {

    /**
     * Expected message body:
     *   {
     *     "brand": {
     *       "id-of-brand-to-delete": {}
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
            .map { it.getInstanceIds("brand").elementAtOrElse(0) { "" } }
            .doOnSuccess { if (it === "") error("'brandId' is not specified.") }
            .flatMap { brandId ->
                fetchMetaData(brandId)
                    .flatMap { metaData ->
                        deleteBrand(brandId, metaData)
                    }
            }
            .subscribe(
                {
                    log.debug("Successfully deleted brand")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error deleting brand: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
                }
            )
    }

    private fun fetchMetaData(brandId: String) =
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    """{
                        "businessUnit": [{ "brandId": "$brandId" }]
                    }"""
                ),
                deliveryOptions
            )
            .map { it.body() }

    private fun deleteBrand(brandId: String, metaData: JsonObject): Single<JsonObject> {
        val combinedCriteria = composeCriteria(brandId, metaData)
        log.debug("Deleting brand $brandId:\n${combinedCriteria.encodePrettily()}")
        return vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, combinedCriteria, deliveryOptions)
            .map { it.body() }
    }

    private fun composeCriteria(brandId: String, metaData: JsonObject): JsonObject {
        // Add updateCriteria for the businessUnits.
        val combinedCriteria = composeBusinessUnitUpdateCriteria(brandId, metaData)

        // And add deleteCriteria for the brand-instance.
        combinedCriteria.put("brand", JsonObject().put(brandId, JsonObject()))
        return combinedCriteria
    }

    private fun composeBusinessUnitUpdateCriteria(brandId: String, metaData: JsonObject): JsonObject {
        val instanceUpdateCriteria = JsonObject()
        metaData
            .getInstances("businessUnit")
            .filter { it.getString("brandId") == brandId }
            .forEach {
                it.remove("brandId")
                instanceUpdateCriteria.put(it.getString("_id"), it)
            }
        return JsonObject().put("businessUnit", instanceUpdateCriteria)
    }
}