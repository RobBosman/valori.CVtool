package nl.valori.cvtool.e2e_encryption

import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

internal class KeyTest {

  @Test
  fun encryptDecrypt() {
    val key = Key().generateSecretKey()
    val plainText = "xyz"
    val cipherText = Key().encrypt(key, plainText.toByteArray())
    val decryptedPlainText = String(Key().decrypt(key, cipherText))

    assertNotEquals(plainText, cipherText.contentToString())
    assertEquals(plainText, decryptedPlainText)
  }
}