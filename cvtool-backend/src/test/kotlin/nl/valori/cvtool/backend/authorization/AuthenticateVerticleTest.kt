package nl.valori.cvtool.backend.authorization

import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Test

class AuthenticateVerticleTest {

    @Test
    fun testParse() {
        // <OPENID_PROVIDER_URL>/<TENANT_ID>/v2.0?<CLIENT_ID>:<CLIENT_SECRET>
        assertArrayEquals(
            arrayOf("TENANT", "CLIENT_ID", "SECRET"),
            AuthenticateVerticle.parseConnectionString("https://example.com/TENANT/v2.0?CLIENT_ID:SECRET")
        )
    }
}