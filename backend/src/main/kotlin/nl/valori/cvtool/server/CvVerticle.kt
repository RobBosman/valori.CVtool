package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.Model.composeCvInstance
import nl.valori.cvtool.server.Model.composeEntity
import nl.valori.cvtool.server.Model.getInstanceMap
import nl.valori.cvtool.server.mongodb.FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.util.*

const val FETCH_CV_ADDRESS = "fetch.cv"

internal class CvVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(future: Future<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(FETCH_CV_ADDRESS)
        .toObservable()
        .subscribe(
            { handleRequest(it) },
            { log.error("Vertx error", it) }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map { it.body().getString("accountId", "") }
          .doOnSuccess { if (it === "") throw IllegalArgumentException("'accountId' is not specified.") }
          .flatMap { accountId -> fetchCvData(accountId) }
          .subscribe(
              {
                log.debug("Successfully fetched cv data")
                message.reply(it)
              },
              {
                val errorMsg = "Error fetching cv data: ${it.message}"
                log.warn(errorMsg)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              }
          )

  private fun fetchCvData(accountId: String): Single<JsonObject> =
      vertx.eventBus()
          .rxRequest<JsonObject>(FETCH_ADDRESS, composeCvCriteria(accountId), deliveryOptions)
          .flatMap { obtainOrCreateCvId(it.body(), accountId) }
          .map { composeCvDataCriteria(accountId, it) }
          .flatMap { vertx.eventBus().rxRequest<JsonObject>(FETCH_ADDRESS, it, deliveryOptions) }
          .map { it.body() }

  private fun composeCvCriteria(accountId: String) =
      JsonObject("""{ "cv": [{ "accountId": "$accountId" }] }""")

  private fun composeCvDataCriteria(accountId: String, cvId: String?) =
      JsonObject("""{
          "cv": [{ "_id": "$cvId" }],
          "account": [{ "_id": "$accountId" }],
          "education": [{ "cvId": "$cvId" }],
          "skill": [{ "cvId": "$cvId" }],
          "publication": [{ "cvId": "$cvId" }],
          "reference": [{ "cvId": "$cvId" }],
          "experience": [{ "cvId": "$cvId" }]
        }""".trimIndent())

  private fun obtainOrCreateCvId(cvEntity: JsonObject, accountId: String): Single<String> {
    var cvId = cvEntity.getInstanceMap("cv").keys.firstOrNull() // TODO - multiple cv's?
    return if (cvId !== null) {
      Single.just(cvId)
    } else {
      // Create and save a new cv if necessary.
      cvId = UUID.randomUUID().toString()
      val cvInstance = composeCvInstance(cvId, accountId)
      vertx.eventBus()
          .rxRequest<JsonObject>(SAVE_ADDRESS, composeEntity("cv", cvInstance), deliveryOptions)
          .map { cvId }
    }
  }
}