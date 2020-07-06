package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import io.vertx.rxjava.core.eventbus.Message
import nl.valori.cvtool.server.mongodb.ADDRESS_FETCH
import org.slf4j.LoggerFactory
import rx.Single

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
              Single
                  .just(message)
                  .map { it.body().getString("accountId") }
                  .doOnSuccess { if (it === null) throw IllegalArgumentException("'accountId' is not specified.") }
                  .flatMap { accountId -> fetchCvData(accountId) }
                  .subscribe(
                      {
                        log.debug("Successfully fetched cv data")
                        message.reply(it)
                      },
                      {
                        log.warn("Error fetching cv data", it)
                        message.fail(RECIPIENT_FAILURE.toInt(), "Error fetching cv data: ${it.message}")
                      })
            },
            {
              log.error("Vertx error", it)
            })
  }

  private fun fetchCvData(accountId: String): Single<JsonObject> =
      vertx.eventBus()
          .rxRequest<JsonObject>(ADDRESS_FETCH, composeCriteria(accountId), deliveryOptions)
          .map(::obtainCvId)
          .map { composeCvCriteria(accountId, it) }
          .flatMap { cvCriteria ->
            vertx.eventBus()
                .rxRequest<JsonObject>(ADDRESS_FETCH, cvCriteria, deliveryOptions)
          }
          .map { it.body() }

  private fun composeCriteria(accountId: String) =
      JsonObject("""{ "cv": [{ "accountId": "$accountId" }] }""")

  private fun obtainCvId(accountResponse: Message<JsonObject>) =
      accountResponse.body()
          .getJsonObject("cv", JsonObject("""{ "cv": [] }"""))
          .fieldNames()
          .first()

  private fun composeCvCriteria(accountId: String, cvId: String?) =
      JsonObject("""{
          |  "cv": [{ "_id": "$cvId" }],
          |  "profile": [{ "accountId": "$accountId" }],
          |  "education": [{ "cvId": "$cvId" }],
          |  "skill": [{ "cvId": "$cvId" }],
          |  "publication": [{ "cvId": "$cvId" }],
          |  "reference": [{ "cvId": "$cvId" }],
          |  "experience": [{ "cvId": "$cvId" }]
          |}"""
          .trimMargin())
}