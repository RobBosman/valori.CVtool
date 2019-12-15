package nl.valori.cvtool.e2e_encryption

import org.junit.jupiter.api.Test

internal class KeyTest {

  @Test
  fun encryptDecrypt() {
    val key = Key().generateSecretKey()
    val x = Key().encrypt(key, "xyz".toByteArray())
    val xx = x.contentToString()
    val y = String(Key().decrypt(key, x))
  }
}