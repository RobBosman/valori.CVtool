package nl.valori.cvtool.backend.authorization.intention

import nl.valori.cvtool.backend.authorization.AUTH_INFO_FETCH_ADDRESS
import nl.valori.cvtool.backend.authorization.TestData.authInfoTom
import nl.valori.cvtool.backend.authorization.TestData.messageDeleteAccountPascal
import nl.valori.cvtool.backend.authorization.TestData.messageDeleteBrand
import nl.valori.cvtool.backend.authorization.TestData.messageFetchAllAccounts
import nl.valori.cvtool.backend.authorization.TestData.messageFetchAllAuthorizations
import nl.valori.cvtool.backend.authorization.TestData.messageFetchAllBrands
import nl.valori.cvtool.backend.authorization.TestData.messageFetchAllBusinessUnits
import nl.valori.cvtool.backend.authorization.TestData.messageFetchAuthInfoTom
import nl.valori.cvtool.backend.authorization.TestData.messageFetchCharacteristicsByAccountIdPascal
import nl.valori.cvtool.backend.authorization.TestData.messageFetchCharacteristicsByAccountIdTom
import nl.valori.cvtool.backend.authorization.TestData.messageFetchSkillPascal
import nl.valori.cvtool.backend.authorization.TestData.messageFetchSkillTom
import nl.valori.cvtool.backend.authorization.TestData.messageGenerateCvPascal
import nl.valori.cvtool.backend.authorization.TestData.messageGenerateCvTom
import nl.valori.cvtool.backend.authorization.TestData.messageSaveAuthorizationPascal
import nl.valori.cvtool.backend.authorization.TestData.messageSaveBrand
import nl.valori.cvtool.backend.authorization.TestData.messageSaveBusinessUnit
import nl.valori.cvtool.backend.authorization.TestData.messageSaveCharacteristicsPascal
import nl.valori.cvtool.backend.authorization.TestData.messageSaveCharacteristicsTom
import nl.valori.cvtool.backend.authorization.TestData.messageSaveSkillPascal
import nl.valori.cvtool.backend.authorization.TestData.messageSaveSkillTom
import nl.valori.cvtool.backend.authorization.TestData.messageSearchCvData
import nl.valori.cvtool.backend.cv.CV_FETCH_ADDRESS
import nl.valori.cvtool.backend.cv.CV_SEARCH_ADDRESS
import nl.valori.cvtool.backend.persistence.ACCOUNT_DELETE_ADDRESS
import nl.valori.cvtool.backend.persistence.BRAND_DELETE_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_FETCH_ADDRESS
import nl.valori.cvtool.backend.persistence.MONGODB_SAVE_ADDRESS
import org.junit.jupiter.api.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal class IntentionReadAllAccountsTest {

    private val intentionToTest = IntentionReadAllAccounts

    @Test
    fun testNoBody() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, null, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, null, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, null, authInfoTom))
    }

    @Test
    fun testFetchAllAccounts() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchAllAccounts, authInfoTom))
        assertTrue(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchAllAccounts, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchAllAccounts, authInfoTom))
    }

    @Test
    fun testFetchAllBrands() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchAllBrands, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchAllBrands, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchAllBrands, authInfoTom))
    }

    @Test
    fun testFetchAllBusinessUnits() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchAllBusinessUnits, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchAllBusinessUnits, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchAllBusinessUnits, authInfoTom))
    }

    @Test
    fun testFetchAllAuthorizations() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchAllAuthorizations, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchAllAuthorizations, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchAllAuthorizations, authInfoTom))
    }

    @Test
    fun testFetchOwnAuthInfo() {
        assertFalse(intentionToTest.match(AUTH_INFO_FETCH_ADDRESS, messageFetchAuthInfoTom, authInfoTom))
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchAuthInfoTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchAuthInfoTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchAuthInfoTom, authInfoTom))
    }

    @Test
    fun testGenerateOwnCv() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageGenerateCvTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageGenerateCvTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageGenerateCvTom, authInfoTom))
    }

    @Test
    fun testFetchOwnCharacteristics() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchCharacteristicsByAccountIdTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchCharacteristicsByAccountIdTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchCharacteristicsByAccountIdTom, authInfoTom))
    }

    @Test
    fun testFetchOwnSkill() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchSkillTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchSkillTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchSkillTom, authInfoTom))
    }

    @Test
    fun testSaveOwnCharacteristics() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveCharacteristicsTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveCharacteristicsTom, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveCharacteristicsTom, authInfoTom))
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
    fun testSearchCvData() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSearchCvData, authInfoTom))
        assertFalse(intentionToTest.match(CV_SEARCH_ADDRESS, messageSearchCvData, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSearchCvData, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSearchCvData, authInfoTom))
    }

    @Test
    fun testFetchOtherCharacteristicsByAccountId() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchCharacteristicsByAccountIdPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchCharacteristicsByAccountIdPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchCharacteristicsByAccountIdPascal, authInfoTom))
    }

    @Test
    fun testFetchOtherSkill() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageFetchSkillPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageFetchSkillPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageFetchSkillPascal, authInfoTom))
    }

    @Test
    fun testSaveOtherCharacteristics() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveCharacteristicsPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveCharacteristicsPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveCharacteristicsPascal, authInfoTom))
    }

    @Test
    fun testSaveOtherSkill() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveSkillPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveSkillPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveSkillPascal, authInfoTom))
    }

    @Test
    fun testSaveBrand() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveBrand, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveBrand, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveBrand, authInfoTom))
    }

    @Test
    fun testSaveBusinessUnit() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveBusinessUnit, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveBusinessUnit, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveBusinessUnit, authInfoTom))
    }

    @Test
    fun testSaveAuthorization() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageSaveAuthorizationPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageSaveAuthorizationPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageSaveAuthorizationPascal, authInfoTom))
    }

    @Test
    fun testDeleteAccount() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageDeleteAccountPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageDeleteAccountPascal, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageDeleteAccountPascal, authInfoTom))
        assertFalse(intentionToTest.match(ACCOUNT_DELETE_ADDRESS, messageDeleteAccountPascal, authInfoTom))
    }

    @Test
    fun testDeleteBrand() {
        assertFalse(intentionToTest.match(CV_FETCH_ADDRESS, messageDeleteBrand, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_FETCH_ADDRESS, messageDeleteBrand, authInfoTom))
        assertFalse(intentionToTest.match(MONGODB_SAVE_ADDRESS, messageDeleteBrand, authInfoTom))
        assertFalse(intentionToTest.match(BRAND_DELETE_ADDRESS, messageDeleteBrand, authInfoTom))
    }
}