import type { Locator, Page } from "@playwright/test";
import CommonActions from "../../CommonActions.js";
import { getViewPageLocators, type ViewPage_OR } from "./ViewPage_OR.js";
import { ValueAssertionType, AssertionType } from "playpom";
import { getAudioDurationInSeconds } from 'get-audio-duration';

/**
 * Interface representing the data structure for verification on the View page.
 */
export interface ViewDetails {
  ClaimNumber: string;
  INSfirstName: string;
  INSlastName: string;
  inter_FirstName: string;
  inter_LastName: string;
  DOL: string;
  IntervieweeType: string;
  Adjuster: "Arpit Desai";
  Office: "Shared Services (Codal)";
}

/**
 * Page Object class for the View page.
 * Contains methods for interacting with and verifying elements on the page.
 */
export default class ViewPage extends CommonActions {
  protected readonly locators: ViewPage_OR;

  constructor(page: Page) {
    super(page);
    this.locators = getViewPageLocators(page);
  }

  /**
   * Verifies all the key details of a claim on the View page.
   * @param expectedData An object containing the expected data to verify.
   * @param audioFilePath The local path to the audio file for duration comparison.
   */
  async verifyDetails(expectedData: ViewDetails, audioFilePath: string): Promise<void> {
    // Verify Claim Number
    const file = 'Data/Login/Upload/UploadStatusManagement.txt'
    const dataMap: Map<string, string> = await this.FILE.getData(file);
    // const data = this.FILE.getStringData(file);
    console.log("This is txt file ClaimNumber: "+dataMap.get("ClaimNumber"))
    const claimNumberLocator: Locator = this.locators.claimNumberByText(expectedData.ClaimNumber).first();
    await this.ASSERT.hardAssert(claimNumberLocator, AssertionType.TO_HAVE_TEXT, `Claim #: ${expectedData.ClaimNumber}`, "'Claim Number' should match");

    // Verify Insured Name
    const fullInsuredName = `${expectedData.INSfirstName} ${expectedData.INSlastName}`;
    await this.ASSERT.hardAssert(this.locators.insuredValue, AssertionType.TO_HAVE_TEXT, fullInsuredName, "'Insured Name' should match");

    // Verify Interviewee Name
    const fullIntervieweeName = `${expectedData.inter_FirstName} ${expectedData.inter_LastName}`;
    await this.ASSERT.hardAssert(this.locators.intervieweeValue, AssertionType.TO_HAVE_TEXT, fullIntervieweeName, "'Interviewee Name' should match");
    
    // Verify Interviewee Type
    await this.ASSERT.hardAssert(this.locators.intervieweeTypeValue, AssertionType.TO_HAVE_TEXT, `Witness`, "'Interviewee Type' should match");

    // Verify Date of Loss (DOI)
    await this.ASSERT.hardAssert(this.locators.dateOfIncidentValue, AssertionType.TO_HAVE_TEXT, expectedData.DOL, "'Date of Loss' should match");

    // Verify Adjuster
    await this.ASSERT.hardAssert(this.locators.adjusterValue, AssertionType.TO_HAVE_TEXT, expectedData.Adjuster, "'Adjuster' should match");

    // Verify Office
    await this.ASSERT.hardAssert(this.locators.officeValue, AssertionType.TO_HAVE_TEXT, expectedData.Office, "'Office' should match");

    // Verify Audio Length
    await this.verifyAudioDuration(audioFilePath, this.locators.audioDurationText);
  }

  /**
   * Compares the duration of a local audio file with the duration displayed in the UI.
   * @param filePath The local path to the audio file.
   * @param durationElement The Playwright Locator for the element showing the duration in the UI.
   * @private
   */
  private async verifyAudioDuration(filePath: string, durationElement: Locator): Promise<void> {
    console.log(`Verifying audio duration for: ${filePath}`);

    const expectedDurationSeconds = await this.getExpectedAudioDuration(filePath);
    const expectedMinutes = Math.floor(expectedDurationSeconds / 60);
    const expectedSeconds = Math.round(expectedDurationSeconds % 60);
    const expectedDurationDisplay = `${expectedMinutes}:${expectedSeconds.toString().padStart(2, '0')}`;

    console.log(`✅ Expected Duration: ${expectedDurationDisplay}`);

    const actualDurationText = await durationElement.innerText();
    console.log(`⚛️ Actual UI Duration: ${actualDurationText}`);

    await this.ASSERT.hardAssertValue(actualDurationText, ValueAssertionType.TO_BE, expectedDurationDisplay, "Audio file length should match the UI display");
    console.log(`🎉 Verification successful! UI duration matches file duration.`);
  }

  /**
   * Gets the duration of a local audio file using a Node.js library.
   * This serves as the expected "source of truth" value.
   * @param filePath The local path to the audio file.
   * @returns A promise that resolves to the duration in seconds.
   * @private
   */
  private async getExpectedAudioDuration(filePath: string): Promise<number> {
    try {
      const duration = await getAudioDurationInSeconds(filePath);
      return duration;
    } catch (error) {
      console.error(`Error getting audio duration for ${filePath}:`, error);
      throw new Error(`Failed to determine expected audio duration. Original error: ${error.message}`);
    }
  }
}
