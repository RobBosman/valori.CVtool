package nl.bransom.cvtool.backend.authorization.intention

import nl.bransom.cvtool.backend.authorization.AuthInfo
import nl.bransom.cvtool.backend.authorization.Intention
import nl.bransom.cvtool.backend.cv.CV_REPORT_ADDRESS

internal object IntentionCvReport : Intention {

    override fun name() = "download cv report"

    override fun match(address: String, body: Any?, authInfo: AuthInfo) =
        address == CV_REPORT_ADDRESS
}