package nl.valori.cvtool

import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

internal class XslUtilTest {

    @Test
    fun jsonText_empty() {
        assertEquals("", XslUtil.jsonText(""))
        assertEquals("", XslUtil.jsonText("   "))
    }

    @Test
    fun jsonText_trim() {
        assertEquals("!", XslUtil.jsonText(" \t ! \n \r"))
    }

    @Test
    fun jsonText_backslash() {
        assertEquals("C:\\\\Users\\\\admin\\\\", XslUtil.jsonText("C:\\Users\\admin\\"))
    }

    @Test
    fun jsonText_doubleQuote() {
        assertEquals("\\\"Sea Shepherd Belgium\\\".", XslUtil.jsonText("\"Sea Shepherd Belgium\"."))
    }

    @Test
    fun jsonText_newline() {
        assertEquals("regel 1\\nregel 2\\nregel 3", XslUtil.jsonText("regel 1\nregel 2\nregel 3"))
    }

    @Test
    fun jsonText_tab() {
        assertEquals("*\\tText", XslUtil.jsonText("*\tText"))
    }

    @Test
    fun jsonText() {
        assertEquals(
            "#\\titem 1: \\\"\\\\rootDirectory\\\\\\\"\\n# item 2: ...",
            XslUtil.jsonText("\n#\titem 1: \"\\rootDirectory\\\"\n# item 2: ...")
        )
    }

    @Test
    fun jsonInt_valid() {
        assertEquals(32, XslUtil.jsonInt("32"))
        assertEquals(-23, XslUtil.jsonInt("-23"))
    }

    @Test
    fun jsonInt_invalid() {
        assertEquals(0, XslUtil.jsonInt(""))
        assertEquals(0, XslUtil.jsonInt("   "))
        assertEquals(0, XslUtil.jsonInt("0000"))
        assertEquals(0, XslUtil.jsonInt("0"))
    }

    @Test
    fun jsonLevel_valid() {
        assertEquals(1, XslUtil.jsonLevel("1"))
        assertEquals(2, XslUtil.jsonLevel("2"))
        assertEquals(2, XslUtil.jsonLevel("3"))
        assertEquals(3, XslUtil.jsonLevel("4"))
        assertEquals(3, XslUtil.jsonLevel("5"))
    }

    @Test
    fun jsonLevel_invalid() {
        assertEquals(0, XslUtil.jsonLevel(""))
        assertEquals(0, XslUtil.jsonLevel("   "))
        assertEquals(0, XslUtil.jsonLevel("0000"))
        assertEquals(0, XslUtil.jsonLevel("0"))
    }

    @Test
    fun uuid() {
        val uuid1 = XslUtil.uuid("one")
        val uuid2 = XslUtil.uuid("two")
        val uuid3 = XslUtil.uuid("One")
        val uuid4 = XslUtil.uuid("one ")
        val uuid5 = XslUtil.uuid("one")
        assertNotEquals(uuid1, uuid2)
        assertNotEquals(uuid2, uuid3)
        assertNotEquals(uuid3, uuid4)
        assertNotEquals(uuid4, uuid5)
        assertEquals(uuid1, uuid5)
    }
}