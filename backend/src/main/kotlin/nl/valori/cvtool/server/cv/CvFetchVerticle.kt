package nl.valori.cvtool.server.cv

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.ModelUtils.addEntity
import nl.valori.cvtool.server.ModelUtils.composeCvCriteria
import nl.valori.cvtool.server.ModelUtils.composeCvDataCriteria
import nl.valori.cvtool.server.ModelUtils.composeCvInstance
import nl.valori.cvtool.server.ModelUtils.getInstanceIds
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS
import org.slf4j.LoggerFactory
import java.util.UUID

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
          .just(message.body())
          .map { it.getString("accountId", "") }
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

  private fun obtainOrCreateCvId(cvEntity: JsonObject, accountId: String): Single<String> {
    val cvIds = cvEntity.getInstanceIds("cv")
    return when (cvIds.size) {
      0 -> {
        val cvId = UUID.randomUUID().toString()
        val saveRequest = JsonObject().addEntity("cv", composeCvInstance(cvId, accountId))
        vertx.eventBus()
            .rxRequest<JsonObject>(MONGODB_SAVE_ADDRESS, saveRequest, deliveryOptions)
            .map { cvId }
      }
      1 -> Single.just(cvIds.first())
      else -> throw IllegalStateException("Found ${cvIds.size} cv records with accountId $accountId.")
    }
  }
}