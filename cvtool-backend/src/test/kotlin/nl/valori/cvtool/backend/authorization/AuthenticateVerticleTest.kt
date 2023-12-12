package nl.valori.cvtool.backend.authorization

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class AuthenticateVerticleTest {

    @Test
    fun testParse() {
        // <OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        val parseResult =
            AuthenticateVerticle.parseConnectionString("https://example.com/TENANT/v2.0?CLIENT_ID:SECRET")
        assertEquals(4, parseResult.size)
        assertEquals("https://example.com/TENANT/v2.0", parseResult["site"])
        assertEquals("TENANT", parseResult["tenant"])
        assertEquals("CLIENT_ID", parseResult["clientId"])
        assertEquals("SECRET", parseResult["secret"])
    }
}