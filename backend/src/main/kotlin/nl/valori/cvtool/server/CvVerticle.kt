package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import org.slf4j.LoggerFactory

const val ADDRESS_FETCH_CV = "fetch.cv"

internal class CvVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)
  private val deliveryOptions = DeliveryOptions().setSendTimeout(2000)

  override fun start(future: Future<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_FETCH_CV)
        .toObservable()
        .subscribe(
            { message ->
              fetchCvData(
                  message.body().getString("accountId"),
                  {
                    log.debug("Successfully fetched cv data")
                    message.reply(it)
                  },
                  {
                    log.warn("Error fetching cv data", it)
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                  })
            },
            {
              log.error("Vertx error", it)
            })
  }

  private fun fetchCvData(accountId: String, onSuccess: (JsonObject) -> Unit, onError: (Throwable) -> Unit) {
    val accountCriteria = JsonObject("""{ "cv": [{ "accountId": "$accountId" }] }""")
    vertx.eventBus()
        .rxRequest<JsonObject>(ADDRESS_FETCH, accountCriteria, deliveryOptions)
        .map(::obtainCvId)
        .map(::composeCvCriteria)
        .flatMap { cvCriteria ->
          vertx.eventBus()
              .rxRequest<JsonObject>(ADDRESS_FETCH, cvCriteria, deliveryOptions)
        }
        .map { it.body() }
        .subscribe(onSuccess, onError)
  }

  private fun obtainCvId(accountResponse: Message<JsonObject>) =
      accountResponse.body()
          .getJsonObject("cv")
          .fieldNames()
          .first()

  private fun composeCvCriteria(cvId: String?) =
      JsonObject("""{
          |  "cv": [{ "_id": "$cvId" }],
          |  "profile": [{ "cvId": "$cvId" }],
          |  "education": [{ "cvId": "$cvId" }],
          |  "skill": [{ "cvId": "$cvId" }],
          |  "publication": [{ "cvId": "$cvId" }],
          |  "reference": [{ "cvId": "$cvId" }],
          |  "workingExperience": [{ "cvId": "$cvId" }]
          |}"""
          .trimMargin())
}