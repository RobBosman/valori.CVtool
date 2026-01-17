package nl.bransom.cvtool.backend

import io.vertx.reactivex.ext.web.handler.sockjs.BridgeEvent

object MessageUtils {

    fun BridgeEvent.getMessageHeader(header: String) =
        rawMessage
            ?.getJsonObject("headers")
            ?.getString(header)
            ?: error("Cannot obtain header '$header' from BridgeEvent message.")

    fun BridgeEvent.setMessageHeader(header: String, value: String): BridgeEvent {
        val headers = rawMessage
            ?.getJsonObject("headers")
            ?: error("Cannot obtain headers from BridgeEvent message.")
        rawMessage.put("headers", headers.put(header, value))
        return this
    }
}