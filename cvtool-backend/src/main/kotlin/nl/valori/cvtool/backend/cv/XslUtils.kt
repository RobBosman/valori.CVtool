package nl.valori.cvtool.backend.cv

object XslUtils {

    // The width in this table are in mm, based on the Arial 10pt font used in MS-Word.
    private val WIDTH_MAP = mapOf(
        "ijl" to 0.75,
        "Ift, /" to 1.00,
        "r.-()" to 1.20,
        "JLcksvxyz" to 1.75,
        "abdeghnopqu0123456789=" to 1.95,
        "FTZ&" to 2.25,
        "ABEKPSVXY" to 2.35,
        "CDHNRUw" to 2.55,
        "GMOQ" to 2.75,
        "m" to 2.95,
        "W" to 3.30
    )

    private fun String.getWidth(letterWidth: Double): Double =
        toCharArray()
            .map { c ->
                val scaleFactor = WIDTH_MAP.entries
                    .find { (x, _) -> x.contains(c) }
                    ?.value ?: 1.0
                letterWidth * scaleFactor
            }
            .reduce { l, r -> l + r }

    /**
     * Search for the letter-index at 42.5 mm using table WIDTH_MAP.
     * That is 17 capitals of about 2,47 mm or 24 lower case letters of circa 1,75 mm wide.
     * If the text is longer than that, then replace the last space *before* that index with a newline.
     */
    @JvmStatic
    fun wrapText(text: String, letterWidth: Double, wrapWidth: Double): String {

        val spaceWidth = " ".getWidth(letterWidth)

        var buildUpWidth = 0.0
        var wrappedText = ""
        text.split(" ", "\t", "\n")
            .forEach { fragmentText ->
                val fragmentWidth = fragmentText.getWidth(letterWidth)

                if (buildUpWidth + spaceWidth + fragmentWidth > wrapWidth) {
                    wrappedText = "$wrappedText\n$fragmentText".trim()
                    buildUpWidth = fragmentWidth
                } else if (wrappedText.isEmpty()) {
                    wrappedText = fragmentText
                    buildUpWidth = fragmentWidth
                } else {
                    wrappedText += " $fragmentText"
                    buildUpWidth += spaceWidth + fragmentWidth
                }
            }

        return wrappedText
    }
}