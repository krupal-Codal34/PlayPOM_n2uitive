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

  /**
     * Write data to JSON file safely.
     *
     * @param data         Object or array to save
     * @param fileName     File name (auto-add .json)
     * @param outputDir    Target folder (default: test-output)
     */
  async writeDataToJson(
    data: object | Array<any>,
    fileName: string,
    outputDir: string = 'test-output'
  ): Promise<void> {

    if (!data || typeof data !== 'object') {
      throw new Error(`writeDataToJson: "data" must be an object or array.`);
    }

    if (!fileName.endsWith('.json')) {
      fileName += '.json';
    }

    const filePath = path.join(process.cwd(), outputDir, fileName);

    try {
      // Ensure folder exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Clone the data to avoid mutation issues
      const safeCopy = JSON.parse(JSON.stringify(data));

      // Convert to pretty JSON
      const jsonString = JSON.stringify(safeCopy, null, 2);

      // Write file (overwrite)
      await fs.writeFile(filePath, jsonString, {
        encoding: 'utf-8',
        flag: 'w'
      });

      // Force FS flush to avoid stale caching
      await fs.utimes(filePath, new Date(), new Date());

      console.log(`✅ JSON written fresh at: ${filePath}`);

    } catch (error) {
      console.error(`❌ Failed to write JSON at ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Read JSON without using require() cache.
   *
   * @param fileName   JSON file name
   * @param outputDir  Directory (default: test-output)
   */
   async readJson(
    fileName: string,
    outputDir: string = './'
  ): Promise<any> {

    if (!fileName.endsWith('.json')) {
      fileName += '.json';
    }

    const filePath = path.join(process.cwd(), outputDir, fileName);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);

    } catch (error) {
      console.error(`❌ Failed to read JSON at ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Generate unique JSON filename to avoid parallel-worker conflicts.
   * Recommended for Playwright parallel runs.
   */
  async uniqueFile(testId: string, baseName: string) {
    return `${baseName}_${testId}.json`;
  }
}





