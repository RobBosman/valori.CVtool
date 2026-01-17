package nl.bransom.cvtool.backend

import io.vertx.core.Promise
import io.vertx.core.eventbus.DeliveryOptions
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.eventbus.Message
import org.slf4j.LoggerFactory

abstract class BasicVerticle(private val address: String) : AbstractVerticle() {

    internal val log = LoggerFactory.getLogger(javaClass)
    internal val deliveryOptions = DeliveryOptions().setSendTimeout(2_000)

    abstract fun handleRequest(message: Message<JsonObject>)

    open fun validateRequest(message: Message<JsonObject>) =
        true

    override fun start(startPromise: Promise<Void>) { // NOSONAR - Promise<Void> is defined in AbstractVerticle
        vertx.eventBus()
            .consumer<JsonObject>(address)
            .toFlowable()
            .doOnSubscribe { startPromise.complete() }
            .subscribe(
                { message ->
                    if (validateRequest(message)) {
                        handleRequest(message)
                    } else {
                        message.reply(null)
                    }
                },
                {
                    log.error("Vertx error in ${javaClass.name}", it)
                    startPromise.tryFail(it)
                }
            )
    }
}