package nl.valori.cvtool.server.authorization

import nl.valori.cvtool.server.authorization.TestData.authInfoTom
import nl.valori.cvtool.server.authorization.TestData.messageFetchCvByAccountIdPascal
import nl.valori.cvtool.server.authorization.TestData.messageFetchCvByAccountIdTom
import nl.valori.cvtool.server.authorization.TestData.messageFetchCvByCvIdPascal
import nl.valori.cvtool.server.authorization.TestData.messageFetchCvByCvIdTom
import nl.valori.cvtool.server.authorization.TestData.messageFetchSkillPascal
import nl.valori.cvtool.server.authorization.TestData.messageFetchSkillTom
import nl.valori.cvtool.server.authorization.TestData.messageGenerateCvPascal
import nl.valori.cvtool.server.authorization.TestData.messageGenerateCvTom
import nl.valori.cvtool.server.authorization.TestData.messageSaveAuthorizationPascal
import nl.valori.cvtool.server.authorization.TestData.messageSaveCvPascal
import nl.valori.cvtool.server.authorization.TestData.messageSaveCvTom
import nl.valori.cvtool.server.authorization.TestData.messageSaveSkillPascal
import nl.valori.cvtool.server.authorization.TestData.messageSaveSkillTom
import nl.valori.cvtool.server.cv.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.server.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.server.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.server.persistence.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal object IntentionUpdateAuthorizationTest {

  private val intentionToTest = IntentionUpdateAuthorization

  @Test
  fun testNoBody() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, null, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, null, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, null, authInfoTom))
  }

  @Test
  fun testFetchAllAccounts() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.messageFetchAllAccounts, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.messageFetchAllAccounts, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.messageFetchAllAccounts, authInfoTom))
  }

  @Test
  fun testFetchAllBusinessUnits() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.messageFetchAllBusinessUnits, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.messageFetchAllBusinessUnits, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.messageFetchAllBusinessUnits, authInfoTom))
  }

  @Test
  fun testFetchAllAuthorizations() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.messageFetchAllAuthorizations, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.messageFetchAllAuthorizations, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.messageFetchAllAuthorizations, authInfoTom))
  }

  @Test
  fun testFetchOwnAuthInfo() {
    assertFalse(intentionToTest.match(AUTH_INFO_FETCH_ADDRESS, TestData.messageFetchAuthInfoTom, authInfoTom))
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.messageFetchAuthInfoTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.messageFetchAuthInfoTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.messageFetchAuthInfoTom, authInfoTom))
  }

  @Test
  fun testGenerateOwnCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageGenerateCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageGenerateCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageGenerateCvTom, authInfoTom))
  }

  @Test
  fun testFetchOwnCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchCvByCvIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchCvByCvIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchCvByCvIdTom, authInfoTom))
  }

  @Test
  fun testFetchOwnCvByAccountId() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchCvByAccountIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchCvByAccountIdTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchCvByAccountIdTom, authInfoTom))
  }

  @Test
  fun testFetchOwnSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchSkillTom, authInfoTom))
  }

  @Test
  fun testSaveOwnCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveCvTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveCvTom, authInfoTom))
  }

  @Test
  fun testSaveOwnSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveSkillTom, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveSkillTom, authInfoTom))
  }

  @Test
  fun testGenerateOtherCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageGenerateCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageGenerateCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageGenerateCvPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherCvByCvId() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchCvByCvIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchCvByCvIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchCvByCvIdPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherCvByAccountId() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchCvByAccountIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchCvByAccountIdPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchCvByAccountIdPascal, authInfoTom))
  }

  @Test
  fun testFetchOtherSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchSkillPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherCv() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveCvPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveCvPascal, authInfoTom))
  }

  @Test
  fun testSaveOtherSkill() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveSkillPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveSkillPascal, authInfoTom))
  }

  @Test
  fun testSaveBusinessUnit() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.messageSaveBusinessUnit, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.messageSaveBusinessUnit, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.messageSaveBusinessUnit, authInfoTom))
  }

  @Test
  fun testSaveAuthorization() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveAuthorizationPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveAuthorizationPascal, authInfoTom))
    assertTrue(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveAuthorizationPascal, authInfoTom))
  }

  @Test
  fun testDeleteAccount() {
    assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, TestData.messageDeleteAccountPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, TestData.messageDeleteAccountPascal, authInfoTom))
    assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, TestData.messageDeleteAccountPascal, authInfoTom))
    assertFalse(intentionToTest.match(ACCOUNT_DELETE_ADDRESS, TestData.messageDeleteAccountPascal, authInfoTom))
  }
}