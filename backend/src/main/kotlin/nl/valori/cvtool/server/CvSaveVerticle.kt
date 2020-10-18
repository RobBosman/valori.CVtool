package nl.valori.cvtool.server

import io.reactivex.Single
import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import nl.valori.cvtool.server.mongodb.SAVE_ADDRESS
import org.slf4j.LoggerFactory

const val CV_SAVE_ADDRESS = "cv.save"

internal class CvSaveVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(startPromise: Promise<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(CV_SAVE_ADDRESS)
        .toObservable()
        .subscribe(
            {
              startPromise.tryComplete()
              handleRequest(it)
            },
            {
              log.error("Vertx error in CvSaveVerticle")
              startPromise.fail(it)
            }
        )
  }

  private fun handleRequest(message: Message<JsonObject>) =
      Single
          .just(message)
          .map { it.body() }
          .flatMap(::saveCvData)
          .subscribe(
              {
                log.debug("Successfully saved cv data")
                message.reply("Successfully saved data")
              },
              {
                val errorMsg = "Error saving cv data: ${it.message}"
                log.warn(errorMsg, it)
                message.fail(RECIPIENT_FAILURE.toInt(), errorMsg)
              }
          )

  private fun saveCvData(cvData: JsonObject): Single<JsonObject> =
      vertx.eventBus()
          .rxRequest<JsonObject>(SAVE_ADDRESS, cvData, deliveryOptions)
          .map { it.body() }
}