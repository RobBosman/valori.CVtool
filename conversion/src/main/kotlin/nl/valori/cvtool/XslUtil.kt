package nl.valori.cvtool

import java.nio.charset.StandardCharsets.UTF_8
import java.util.UUID

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
  fun jsonInt(value: String = "") =
      if (value.isNotBlank()) Integer.parseInt(value) else 0

  @JvmStatic
  fun jsonLevel(value: String = "") =
      when (jsonInt(value)) {
        1 -> 1
        2, 3 -> 2
        4, 5 -> 3
        else -> 0
      }

  @JvmStatic
  fun uuid(seed: String): UUID =
      UUID.nameUUIDFromBytes(seed.toByteArray(UTF_8))
}