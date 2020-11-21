package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.Model.composeCvInstance
import nl.valori.cvtool.server.Model.composeEntity
import nl.valori.cvtool.server.Model.getInstanceIds
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.util.*

const val CV_FETCH_ADDRESS = "cv.fetch"

internal class CvFetchVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(startPromise: Promise<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(CV_FETCH_ADDRESS)
        .toObservable()
        .doOnSubscribe { startPromise.complete() }
        .subscribe(
            {
              handleRequest(it)
            },
            {
              log.error("Vertx error in CvFetchVerticle")
              startPromise.fail(it)
            }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map { it.body().getString("accountId", "") }
          .doOnSuccess { if (it === "") error("'accountId' is not specified.") }
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
          .rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, composeCvCriteria(accountId), deliveryOptions)
          .flatMap { obtainOrCreateCvId(it.body(), accountId) }
          .map { composeCvDataCriteria(accountId, it) }
          .flatMap { vertx.eventBus().rxRequest<JsonObject>(MONGODB_FETCH_ADDRESS, it, deliveryOptions) }
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
    val cvIds = cvEntity.getInstanceIds("cv")
    return when (cvIds.size) {
      0 -> {
        val cvId = UUID.randomUUID().toString()
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, composeEntity("cv", composeCvInstance(cvId, accountId)), deliveryOptions)
            .map { cvId }
      }
      1 -> Single.just(cvIds.first())
      else -> throw IllegalStateException("Found ${cvIds.size} cv records with accountId $accountId.")
    }
  }
}