package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.authorization.TestData.authInfoTom
import nl.valori.cvtool.server.authorization.TestData.bodyFetchAccountsAndBusinessUnits
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvByAccountIdPascal
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvByAccountIdTom
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvPascal
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvTom
import nl.valori.cvtool.server.authorization.TestData.bodyFetchSkillPascal
import nl.valori.cvtool.server.authorization.TestData.bodyFetchSkillTom
import nl.valori.cvtool.server.authorization.TestData.bodyGenerateCvPascal
import nl.valori.cvtool.server.authorization.TestData.bodyGenerateCvTom
import nl.valori.cvtool.server.authorization.TestData.bodySaveAccountRolePascal
import nl.valori.cvtool.server.authorization.TestData.bodySaveAccountRoleTom
import nl.valori.cvtool.server.authorization.TestData.bodySaveCvPascal
import nl.valori.cvtool.server.authorization.TestData.bodySaveCvTom
import nl.valori.cvtool.server.authorization.TestData.bodySaveSkillPascal
import nl.valori.cvtool.server.authorization.TestData.bodySaveSkillTom
import nl.valori.cvtool.server.mongodb.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.mongodb.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal object IntentionUpdateOtherCvTest {

  private val intentionToTest = IntentionUpdateOtherCv

  @Test
  fun testNoBody() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, null, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, null, authInfoTom))
  }

  @Test
  fun testFetchAccountsAndBusinessUnits() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchAccountsAndBusinessUnits, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchAccountsAndBusinessUnits, authInfoTom))
  }

  @Test
  fun testGenerateOwnCv() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyGenerateCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyGenerateCvTom, authInfoTom))
  }

  @Test
  fun testFetchOwnCv() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvTom, authInfoTom))
  }

  @Test
  fun testFetchOwnCvByAccountId() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvByAccountIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvByAccountIdTom, authInfoTom))
  }

  @Test
  fun testFetchOwnSkill() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchSkillTom, authInfoTom))
  }

  @Test
  fun testSaveOwnCv() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveCvTom, authInfoTom))
  }

  @Test
  fun testSaveOwnSkill() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveSkillTom, authInfoTom))
  }

  @Test
  fun testSaveOwnAccountRole() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveAccountRoleTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveAccountRoleTom, authInfoTom))
  }

  @Test
  fun testGenerateOtherCv() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyGenerateCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyGenerateCvPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherCv() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherCvByAccountId() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvByAccountIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvByAccountIdPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherSkill() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchSkillPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherCv() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveCvPascal, authInfoTom))
    assertTrue(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveCvPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherSkill() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveSkillPascal, authInfoTom))
    assertTrue(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveSkillPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherAccountRole() {
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveAccountRolePascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveAccountRolePascal, authInfoTom))
  }
}