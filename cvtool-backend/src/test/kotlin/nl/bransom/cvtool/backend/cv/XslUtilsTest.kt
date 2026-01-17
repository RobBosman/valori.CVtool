package nl.bransom.cvtool.backend.cv

import nl.bransom.cvtool.backend.cv.XslUtils.wrapText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class XslUtilsTest {

    @Test
    fun testWrapText1000() {
        assertEquals(
            "A B C d e f G H I j k l M N O p q r S T U v w x Y Z",
            wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 1000.0)
        )
    }

    @Test
    fun testWrapText30() {
        assertEquals(
            "A B C d e f G H I j\n" +
                    "k l M N O p q r S T\n" +
                    "U v w x Y Z",
            wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 30.0)
        )
    }

    @Test
    fun testWrapText20() {
        assertEquals(
            "A B C d e f\n" +
                    "G H I j k l M\n" +
                    "N O p q r S\n" +
                    "T U v w x Y\n" +
                    "Z",
            wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 20.0)
        )
    }

    @Test
    fun testWrapText10() {
        assertEquals(
            "A B C\n" +
                    "d e f\n" +
                    "G H I\n" +
                    "j k l M\n" +
                    "N O p\n" +
                    "q r S\n" +
                    "T U v\n" +
                    "w x Y\n" +
                    "Z",
            wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 10.0)
        )
    }

    @Test
    fun testWrapText1() {
        assertEquals(
            "A\n" +
                    "B\n" +
                    "C\n" +
                    "d\n" +
                    "e\n" +
                    "f\n" +
                    "G\n" +
                    "H\n" +
                    "I\n" +
                    "j\n" +
                    "k\n" +
                    "l\n" +
                    "M\n" +
                    "N\n" +
                    "O\n" +
                    "p\n" +
                    "q\n" +
                    "r\n" +
                    "S\n" +
                    "T\n" +
                    "U\n" +
                    "v\n" +
                    "w\n" +
                    "x\n" +
                    "Y\n" +
                    "Z",
            wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 1.0)
        )
    }

    @Test
    fun testWrapText_SecuritySSLcertificaten() {
        assertEquals(
            "Security, SSL, certificaten",
            wrapText("Security, SSL, certificaten", 42.0)
        )
    }

    @Test
    fun testWrapText_BusinessProcessModeller() {
        assertEquals(
            "Business Process\n" +
                    "Modelling",
            wrapText("Business Process Modelling", 42.0)
        )
    }
}