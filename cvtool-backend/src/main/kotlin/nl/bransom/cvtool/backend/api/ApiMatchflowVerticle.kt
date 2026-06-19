package nl.bransom.cvtool.backend.api

import io.vertx.core.eventbus.ReplyFailure.RECIPIENT_FAILURE
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.eventbus.Message
import nl.bransom.cvtool.backend.BasicVerticle
import nl.bransom.cvtool.backend.ModelUtils.getInstances
import nl.bransom.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS

const val API_MATCHFLOW_URL = "/api/matchflow"
const val API_MATCHFLOW_ADDRESS = "api.matchflow"

internal class ApiMatchflowVerticle : BasicVerticle(API_MATCHFLOW_ADDRESS) {

    /**
     * Expected message body:
     *
     *    {
     *      "accountId": "id-of-account-of-api-request"
     *    }
     *
     * Response:
     *
     *    {
     *      "data": [
     *        {
     *          "name": "John Doe",
     *          "email": "john.doe@cerios.nl",
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
     *          ]
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
                        "training": [{ "result": "DIPLOMA" }],
                        "skill": []
                    }"""
                ),
                deliveryOptions
            )
            .map { it.body() }
            .map(::toApiResponse)
            .subscribe(
                {
                    log.debug("Successfully fetched API response")
                    message.reply(it)
                },
                {
                    val errorMsg = "Error fetching API response: ${it.message}"
                    log.warn(errorMsg)
                    message.fail(RECIPIENT_FAILURE.toInt(), it.message)
                }
            )
    }

    private fun toApiResponse(fetchedEntities: JsonObject): JsonObject {
        val trainingByAccountId = fetchedEntities.getInstances("training")
            .groupBy { it.getString("accountId") }
            .mapValues { (_, trainings) ->
                trainings
                    .mapNotNull { training ->
                        val year = training.getString("year")
                        val institution = training.getString("institution")
                        val name = training.getJsonObject("name")?.getString("nl_NL")
                        if (year != null && institution != null && name != null) {
                            JsonObject("""{ "year": $year, "institution": "$institution", "name": "$name" }""")
                        } else {
                            null
                        }
                    }
            }
            .filter { (_, trainings) -> trainings.isNotEmpty() }
        val skillsByAccountId = fetchedEntities.getInstances("skill")
            .groupBy { it.getString("accountId") }
            .mapValues { (_, skills) ->
                skills
                    .mapNotNull { skill ->
                        val category = skill.getString("category")
                        val description = "###"
//                        skill.getJsonObject("description")?.getString("nl_NL")
//                            ?.replace("\"", "\\\"")
                        val level = skill.getString("skillLevel")
                        if (category != null && description != null && level != null) {
                            JsonObject("""{ "category": "$category", "description": "$description", "level": $level }""")
                        } else {
                            null
                        }
                    }
            }
            .filter { (_, skills) -> skills.isNotEmpty() }

        val result = fetchedEntities.getInstances("account")
            .map {
                val accountId = it.getString("_id")
                val certification = trainingByAccountId[accountId]
                val skills = skillsByAccountId[accountId]
                val x = JsonObject(
                    """{
                        "name": "${it.getString("name")}",
                        "email": "${it.getString("email")}"
                    }"""
                )
                if (certification?.isNotEmpty() == true) {
                    x.put("certification", certification)
                }
                if (skills?.isNotEmpty() == true) {
                    x.put("skills", skills)
                }
                x
            }
        return JsonObject().put("data", JsonArray(result))
    }
}