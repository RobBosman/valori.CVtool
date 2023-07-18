package nl.valori.cvtool.backend

import io.reactivex.Single
import io.vertx.core.impl.ConcurrentHashSet
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import java.util.concurrent.TimeUnit.MILLISECONDS

abstract class DebouncingVerticle(address: String) : BasicVerticle(address) {

    companion object {
        // This debounceMap is used to prevent the same event is processed multiple times in a (very) short time.
        // It should prevent DDoS attacks.
        private val debouncedFingerprints = ConcurrentHashSet<String>()
    }

    abstract fun getMessageFingerprint(message: Message<JsonObject>): String?

    open fun getDebounceDelayMillis() =
        2_000L

    override fun validateRequest(message: Message<JsonObject>): Boolean {
        val fingerprint = getMessageFingerprint(message)
            ?: return true

        if (debouncedFingerprints.contains(fingerprint)) {
            log.debug("Ignoring ${message.address()} duplicate message [$fingerprint].")
            return false
        }

        // Add an entry to the debouncedFingerprints...
        debouncedFingerprints.add(fingerprint)
        // ...and make sure it will be cleared after a while.
        Single
            .just(fingerprint)
            .delay(getDebounceDelayMillis(), MILLISECONDS)
            .subscribe( { debouncedFingerprints.remove(fingerprint) }, {} )

        return true
    }
}