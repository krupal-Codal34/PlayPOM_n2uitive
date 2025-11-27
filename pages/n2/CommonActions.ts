import { BasePage, getLogger, type Logger, type Page } from "playpom";
import { type Common_OR, getCommonLocators } from "./Common_OR.js";
import * as fs from 'fs/promises';
import * as path from 'path';

export default class CommonActions extends BasePage {
  protected initialPage: Page;
  protected commonLocators: Common_OR;
  protected logger: Logger;
  private uniqueTag = "[COMMON-ACTION]";

  constructor(page: Page) {
    // Initialization if needed
    super(page);
    this.initialPage = page;
    this.logger = getLogger();
    this.commonLocators = getCommonLocators(page);
  }


  /**
 * Stores a JavaScript object or array into a pretty-printed JSON file.
 * @param data The object or array to store.
 * @param fileName The name of the file (e.g., 'testResults.json').
 * @param outputDir The directory to save the file in (default: 'test-output').
 */
  async writeDataToJson(
  data: object | Array<any>,
  fileName: string,
  outputDir: string = 'test-output'
): Promise<void> {

  // Validate inputs early
  if (!data || typeof data !== 'object') {
    throw new Error(`writeDataToJson: "data" must be an object or array. Instead received: ${typeof data}`);
  }

  if (!fileName.endsWith('.json')) {
    fileName += '.json';
  }

  const filePath = path.join(process.cwd(), outputDir, fileName);

  try {
    // Make sure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Pretty JSON output
    const jsonString = JSON.stringify(data, null, 2);

    await fs.writeFile(filePath, jsonString, {
      encoding: 'utf-8',
      flag: 'w' // overwrite by default
    });

    console.log(`✅ JSON written: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to write JSON at ${filePath}:`, error);
    throw error; // bubble up so tests fail
  }
}


}
