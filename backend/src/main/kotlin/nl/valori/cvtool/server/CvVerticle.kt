package nl.valori.cvtool.server

import io.vertx.core.Future
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonObject
import io.vertx.rxjava.core.AbstractVerticle
import org.slf4j.LoggerFactory

const val ADDRESS_FETCH_CV = "fetch.cv"

internal class CvVerticle : AbstractVerticle() {

  private val log = LoggerFactory.getLogger(javaClass)

  override fun start(future: Future<Void>) {
    vertx.eventBus()
        .consumer<JsonObject>(ADDRESS_FETCH_CV)
        .toObservable()
        .doOnNext { message ->
          val accountId = message.body().getString("accountId")

          vertx.eventBus()
              .rxRequest<JsonObject>(
                  ADDRESS_FETCH,
                  JsonObject("""{ "cv": [{ "accountId": "$accountId" }] }"""),
                  DeliveryOptions().setSendTimeout(2000))
              .toObservable()
              .flatMap { cvResponse ->
                val cvId = cvResponse.body()
                    .getJsonObject("cv")
                    .fieldNames()
                    .first()

                vertx.eventBus()
                    .rxRequest<JsonObject>(
                        ADDRESS_FETCH,
                        JsonObject("""{
                            | "cv": [{ "_id": "$cvId" }],
                            | "profile": [{ "cvId": "$cvId" }],
                            | "education": [{ "cvId": "$cvId" }],
                            | "skill": [{ "cvId": "$cvId" }],
                            | "publication": [{ "cvId": "$cvId" }],
                            | "reference": [{ "cvId": "$cvId" }],
                            | "workingExperience": [{ "cvId": "$cvId" }]
                            | }"""
                            .trimMargin()),
                        DeliveryOptions().setSendTimeout(2000))
                    .toObservable()
              }
              .subscribe(
                  {
                    log.debug("Successfully fetched cv data")
                    message.reply(it.body())
                  },
                  {
                    log.warn("Error fetching cv data", it)
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                  })
        }
        .subscribe(
            {},
            { log.error("Vertx error", it) })
  }
}