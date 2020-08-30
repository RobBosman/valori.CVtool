package nl.valori.cvtool

import java.nio.charset.StandardCharsets
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
      UUID.nameUUIDFromBytes(seed.toByteArray(StandardCharsets.UTF_8))
}