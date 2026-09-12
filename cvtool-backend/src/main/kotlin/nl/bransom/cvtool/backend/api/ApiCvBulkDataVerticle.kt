package nl.bransom.cvtool.backend.api

import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

const val API_CV_BULK_DATA_ADDRESS = "api.cvBulkData"

internal class ApiCvBulkDataVerticle : BasicVerticle(API_CV_BULK_DATA_ADDRESS) {

    /**
     * Response:
     *
     *    {
     *      "data": [
     *        {
     *          "name": "John Doe",
     *          "email": "john.doe@cerios.nl",
     *          "characteristics": {
     *            "role": "Software Engineer",
     *            "profile": "Blablabla",
     *            "interests": "None of the above"
     *          },
     *          "certification": [
     *            {
     *              "year": 2004,
     *              "institution": "Ordina Nieuwegein",
     *              "name": "Miller Heiman Strategic Selling"
     *            }
     *          ],
     *          "skills": [
     *            {
     *              "category": "EXPERTISE",
     *              "description": "Geautomatiseerd testen",
     *              "level": 2
     *            }
     *          ],
     *          "experience": [
     *            {
     *              "periodBegin": "2020-10-01",
     *              "periodEnd": "2023-02-31",
     *              "employer": "STRING",
     *              "client": "STRING",
     *              "role": "STRING",
     *              "assignment": "STRING",
     *              "activities": "STRING",
     *              "results": "STRING",
     *              "keywords": "STRING"
     *            }
     *          ],
     *        }
     *      ]
     *    }
     */
    override fun handleRequest(message: Message<JsonObject>) {
        vertx.eventBus()
            .rxRequest<JsonObject>(
                MONGODB_FETCH_ADDRESS,
                JsonObject(
                    """{
                        "account": [],
                        "characteristics": [{ "includeInCv": true }],
                        "education": [{ "includeInCv": true, "result": "DIPLOMA" }],
                        "training": [{ "includeInCv": true, "result": "DIPLOMA" }],
                        "skill": [{ "includeInCv": true }],
                        "experience": [{ "includeInCv": true }]
                    }"""
                ),
                DELIVERY_OPTIONS_4
            )
            .map { it.body() }
            .map(::toApiResponse)
            .subscribe(
                {
                    log.debug("Successfully fetched 'cv bulk data' API response")
                    message.reply(it)
                },
                {
                    log.warn("Error fetching 'cv bulk data' API response: ${it.message}")
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )
    }

    private fun toApiResponse(fetchedEntities: JsonObject): JsonObject {
        val characteristicsByAccountId = obtainCharacteristics(fetchedEntities)
        val certificationByAccountId = obtainCertifications(fetchedEntities)
        val skillsByAccountId = obtainSkills(fetchedEntities)
        val experienceByAccountId = obtainExperience(fetchedEntities)
        val result = fetchedEntities
            .getInstances("account")
            .mapNotNull {
                composeResponseJson(
                    it,
                    characteristicsByAccountId,
                    certificationByAccountId,
                    skillsByAccountId,
                    experienceByAccountId
                )
            }
        return JsonObject().put("data", JsonArray(result))
    }

    private fun composeResponseJson(
        account: JsonObject,
        characteristicsByAccountId: Map<String, JsonObject?>,
        certificationByAccountId: Map<String, List<JsonObject>>,
        skillsByAccountId: Map<String?, List<JsonObject>>,
        experienceByAccountId: Map<String?, List<JsonObject>>
    ): JsonObject? {
        val accountId = account.getString("_id")
        val characteristics = characteristicsByAccountId[accountId]
        val certification = certificationByAccountId[accountId] ?: emptySet()
        val skills = skillsByAccountId[accountId] ?: emptySet()
        val experience = experienceByAccountId[accountId] ?: emptySet()
        return if (certification.isNotEmpty() || skills.isNotEmpty() || experience.isNotEmpty()) {
            JsonObject(
                """{
                    "name": "${account.getString("name")}",
                    "email": "${account.getString("email")}"
                }"""
            ).apply {
                if (characteristics != null) {
                    put("characteristics", characteristics)
                }
                if (certification.isNotEmpty()) {
                    put("certification", certification)
                }
                if (skills.isNotEmpty()) {
                    put("skills", skills)
                }
                if (experience.isNotEmpty()) {
                    put("experience", experience)
                }
            }
        } else {
            null
        }
    }

    private fun obtainCharacteristics(fetchedEntities: JsonObject) =
        fetchedEntities
            .getInstances("characteristics")
            .groupBy { it.getString("accountId") }
            .mapValues { (_, characteristics) ->
                characteristics
                    .firstNotNullOfOrNull { characteristic ->
                        listOf("role", "profile", "interests")
                            .associateWith { characteristic.getJsonObject(it)?.getString("nl_NL") }
                            .toJsonOrNull()
                    }
            }
            .filter { (_, characteristics) -> characteristics != null }

    private fun obtainCertifications(fetchedEntities: JsonObject) =
        listOf("education", "training")
            .flatMap { entityName -> fetchedEntities.getInstances(entityName) }
            .groupBy { it.getString("accountId") }
            .mapValues { (_, certifications) ->
                certifications
                    .mapNotNull { certification ->
                        val year = (certification.getString("year") ?: certification.getString("yearTo"))?.toIntOrNull()
                        val institution = certification.getString("institution")?.escapeJson()
                        val name = certification.getJsonObject("name")?.getString("nl_NL")?.escapeJson()
                        if (institution != null && name != null) {
                            JsonObject("""{ "institution": "$institution", "name": "$name" }""")
                                .apply {
                                    if (year != null) {
                                        put("year", year)
                                    }
                                }
                        } else {
                            null
                        }
                    }
            }
            .filter { (_, trainings) -> trainings.isNotEmpty() }

    private fun obtainSkills(fetchedEntities: JsonObject): Map<String?, List<JsonObject>> =
        fetchedEntities
            .getInstances("skill")
            .groupBy { it.getString("accountId") }
            .mapValues { (_, skills) ->
                skills
                    .mapNotNull { skill ->
                        val category = skill.getString("category")
                        val description = skill.getJsonObject("description")?.getString("nl_NL")?.escapeJson()
                        val level = skill.getString("skillLevel")
                        if (category != null && description != null && level != null) {
                            JsonObject("""{ "category": "$category", "description": "$description", "level": $level }""")
                        } else {
                            null
                        }
                    }
            }
            .filter { (_, skills) -> skills.isNotEmpty() }

    private fun obtainExperience(fetchedEntities: JsonObject): Map<String?, List<JsonObject>> =
        fetchedEntities
            .getInstances("experience")
            .groupBy { it.getString("accountId") }
            .mapValues { (_, experiences) ->
                experiences
                    .mapNotNull { experience ->
                        val details = listOf("role", "assignment", "activities", "results", "keywords")
                            .associateWith { experience.getJsonObject(it)?.getString("nl_NL") }
                        if (details.isNotEmpty()) {
                            val overview = listOf("periodBegin", "periodEnd", "employer", "client")
                                .associateWith { experience.getString(it) }
                            (overview + details)
                                .toJsonOrNull()
                        } else {
                            null
                        }
                    }
            }
            .filter { (_, experiences) -> experiences.isNotEmpty() }

    private fun Map<String, String?>.toJsonOrNull() =
        filterValues { it != null }
            .mapValues { (_, value) -> value!!.escapeJson() }
            .let { if (it.isNotEmpty()) JsonObject(it) else null }

    private fun String.escapeJson() =
        trim()
            .replace("\t", " ")
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
}