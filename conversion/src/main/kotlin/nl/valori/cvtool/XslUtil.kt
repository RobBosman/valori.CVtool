package nl.valori.cvtool

import java.nio.charset.StandardCharsets.UTF_8
import java.util.*

object XslUtil {

  @JvmStatic
  fun jsonText(text: String) =
      text
          .trim { it <= ' ' }
          .replace("\"", "\\\"")
          .replace("\n", "\\n")

  @JvmStatic
  fun uuid(seed: String): UUID? =
      UUID.nameUUIDFromBytes(seed.toByteArray(UTF_8))
}