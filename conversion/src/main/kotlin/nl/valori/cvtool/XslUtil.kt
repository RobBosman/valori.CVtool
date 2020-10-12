package nl.valori.cvtool

import java.nio.charset.StandardCharsets.UTF_8
import java.util.*

object XslUtil {

  /**
   * Convert 'raw' XML text to JSON Strings: escape newlines and double quotes.
   */
  @JvmStatic
  fun jsonText(text: String) =
      text.trim()
          .replace("\\", "\\\\")
          .replace("\"", "\\\"")
          .replace("\r\n", "\n")
          .replace("\n", "\\n")
          .replace("\t", "\\t")

  @JvmStatic
  fun jsonInt(value: String) =
      if (value.isBlank()) 0 else Integer.parseInt(value)

  @JvmStatic
  fun uuid(seed: String): UUID? =
      UUID.nameUUIDFromBytes(seed.toByteArray(UTF_8))
}