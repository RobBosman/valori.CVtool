package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.authorization.AuthInfo
import nl.valori.cvtool.backend.authorization.Intention
import nl.valori.cvtool.backend.cv.CV_DOWNLOAD_DEMO_ADDRESS

internal object IntentionDownloadDemoCv : Intention {

    override fun name() = "download demo cv"

    override fun match(address: String, body: Any?, authInfo: AuthInfo) =
        address == CV_DOWNLOAD_DEMO_ADDRESS
}