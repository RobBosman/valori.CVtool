package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.CV_FETCH_ADDRESS
import nl.valori.cvtool.server.authorization.TestData.authInfoTom
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvByAccountIdPascal
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvByAccountIdTom
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvByCvIdPascal
import nl.valori.cvtool.server.authorization.TestData.bodyFetchCvByCvIdTom
import nl.valori.cvtool.server.authorization.TestData.bodyFetchSkillPascal
import nl.valori.cvtool.server.authorization.TestData.bodyFetchSkillTom
import nl.valori.cvtool.server.authorization.TestData.bodyGenerateCvPascal
import nl.valori.cvtool.server.authorization.TestData.bodyGenerateCvTom
import nl.valori.cvtool.server.authorization.TestData.bodySaveAccountRolePascal
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
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, null, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, null, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, null, authInfoTom))
  }

  @Test
  fun testFetchAllAccounts() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.bodyFetchAllAccounts, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.bodyFetchAllAccounts, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.bodyFetchAllAccounts, authInfoTom))
  }

  @Test
  fun testFetchAllBusinessUnits() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.bodyFetchAllBusinessUnits, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.bodyFetchAllBusinessUnits, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.bodyFetchAllBusinessUnits, authInfoTom))
  }

  @Test
  fun testFetchOwnAuthInfo() {
    assertFalse(intentionToTest.match(AUTH_INFO_FETCH_ADDRESS, TestData.bodyFetchAuthInfoTom, authInfoTom))
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.bodyFetchAuthInfoTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.bodyFetchAuthInfoTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.bodyFetchAuthInfoTom, authInfoTom))
  }

  @Test
  fun testGenerateOwnCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyGenerateCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyGenerateCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyGenerateCvTom, authInfoTom))
  }

  @Test
  fun testFetchOwnCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyFetchCvByCvIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvByCvIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvByCvIdTom, authInfoTom))
  }

  @Test
  fun testFetchOwnCvByAccountId() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyFetchCvByAccountIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvByAccountIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvByAccountIdTom, authInfoTom))
  }

  @Test
  fun testFetchOwnSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyFetchSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchSkillTom, authInfoTom))
  }

  @Test
  fun testSaveOwnCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodySaveCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveCvTom, authInfoTom))
  }

  @Test
  fun testSaveOwnSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodySaveSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveSkillTom, authInfoTom))
  }

  @Test
  fun testGenerateOtherCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyGenerateCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyGenerateCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyGenerateCvPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherCvByCvId() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyFetchCvByCvIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvByCvIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvByCvIdPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherCvByAccountId() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyFetchCvByAccountIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchCvByAccountIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchCvByAccountIdPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodyFetchSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodyFetchSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodyFetchSkillPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodySaveCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveCvPascal, authInfoTom))
    assertTrue(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveCvPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodySaveSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveSkillPascal, authInfoTom))
    assertTrue(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveSkillPascal, authInfoTom))
  }

  @Test
  fun testSaveAccountRole() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, bodySaveAccountRolePascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, bodySaveAccountRolePascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, bodySaveAccountRolePascal, authInfoTom))
  }
}