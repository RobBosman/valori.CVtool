package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.cv.CV_DEMO_ADDRESS

internal object IntentionCvDemo : Intention {

    override fun name() = "download demo cv"

    override fun match(address: String, body: Any?, authInfo: AuthInfo) =
        address == CV_DEMO_ADDRESS
}