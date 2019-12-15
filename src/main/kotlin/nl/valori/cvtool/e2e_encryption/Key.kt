package nl.valori.cvtool.e2e_encryption

import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

class Key {

  fun generateSecretKey(): SecretKey {
    val secureRandom = SecureRandom()
    val keyGenerator = KeyGenerator.getInstance("AES")
    //generate a key with secure random
    keyGenerator?.init(128, secureRandom)
    return keyGenerator.generateKey()
  }

//  fun saveSecretKey(sharedPref: SharedPreferences, secretKey: SecretKey): String {
//    val encodedKey = Base64.encodeToString(secretKey.encoded, Base64.NO_WRAP)
//    sharedPref.edit().putString(AppConstants.secretKeyPref, encodedKey).apply()
//    return encodedKey
//  }

  fun encrypt(yourKey: SecretKey, plainText: ByteArray): ByteArray {
    val data = yourKey.encoded
    val keySpec = SecretKeySpec(data, 0, data.size, "AES")
    val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
    cipher.init(Cipher.ENCRYPT_MODE, keySpec, IvParameterSpec(ByteArray(cipher.blockSize)))
    return cipher.doFinal(plainText)
  }

//  fun getSecretKey(sharedPref: SharedPreferences): SecretKey {
//
//    val key = sharedPref.getString(AppConstants.secretKeyPref, null)
//
//    if (key == null) {
//      //generate secure random
//      val secretKey = generateSecretKey()
//      saveSecretKey(sharedPref, secretKey!!)
//      return secretKey
//    }
//
//    val decodedKey = Base64.decode(key, Base64.NO_WRAP)
//    val originalKey = SecretKeySpec(decodedKey, 0, decodedKey.size, "AES")
//
//    return originalKey
//  }

  fun decrypt(yourKey: SecretKey, cipherText: ByteArray): ByteArray {
    val plainText: ByteArray
    val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
    cipher.init(Cipher.DECRYPT_MODE, yourKey, IvParameterSpec(ByteArray(cipher.blockSize)))
    plainText = cipher.doFinal(cipherText)
    return plainText
  }
}