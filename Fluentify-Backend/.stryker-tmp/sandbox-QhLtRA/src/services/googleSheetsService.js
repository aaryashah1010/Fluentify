// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { google } from 'googleapis';

/**
 * Google Sheets Service
 * Handles appending learner data to Google Sheets
 */

class GoogleSheetsService {
  constructor() {
    if (stryMutAct_9fa48("717")) {
      {}
    } else {
      stryCov_9fa48("717");
      this.sheets = null;
      this.auth = null;
    }
  }

  /**
   * Initialize Google Sheets API with service account credentials
   */
  async initialize() {
    if (stryMutAct_9fa48("718")) {
      {}
    } else {
      stryCov_9fa48("718");
      try {
        if (stryMutAct_9fa48("719")) {
          {}
        } else {
          stryCov_9fa48("719");
          // Parse the service account JSON from environment variable
          const credentials = JSON.parse(stryMutAct_9fa48("722") ? process.env.GOOGLE_SERVICE_ACCOUNT_JSON && '{}' : stryMutAct_9fa48("721") ? false : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721", "722"), process.env.GOOGLE_SERVICE_ACCOUNT_JSON || (stryMutAct_9fa48("723") ? "" : (stryCov_9fa48("723"), '{}'))));
          if (stryMutAct_9fa48("726") ? !credentials.client_email && !credentials.private_key : stryMutAct_9fa48("725") ? false : stryMutAct_9fa48("724") ? true : (stryCov_9fa48("724", "725", "726"), (stryMutAct_9fa48("727") ? credentials.client_email : (stryCov_9fa48("727"), !credentials.client_email)) || (stryMutAct_9fa48("728") ? credentials.private_key : (stryCov_9fa48("728"), !credentials.private_key)))) {
            if (stryMutAct_9fa48("729")) {
              {}
            } else {
              stryCov_9fa48("729");
              throw new Error(stryMutAct_9fa48("730") ? "" : (stryCov_9fa48("730"), 'Invalid Google Service Account credentials'));
            }
          }

          // Create JWT auth client
          this.auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, stryMutAct_9fa48("731") ? [] : (stryCov_9fa48("731"), [stryMutAct_9fa48("732") ? "" : (stryCov_9fa48("732"), 'https://www.googleapis.com/auth/spreadsheets')]));

          // Initialize Sheets API
          this.sheets = google.sheets(stryMutAct_9fa48("733") ? {} : (stryCov_9fa48("733"), {
            version: stryMutAct_9fa48("734") ? "" : (stryCov_9fa48("734"), 'v4'),
            auth: this.auth
          }));
          console.log(stryMutAct_9fa48("735") ? "" : (stryCov_9fa48("735"), '✅ Google Sheets API initialized successfully'));
          return stryMutAct_9fa48("736") ? false : (stryCov_9fa48("736"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("737")) {
          {}
        } else {
          stryCov_9fa48("737");
          console.error(stryMutAct_9fa48("738") ? "" : (stryCov_9fa48("738"), '❌ Failed to initialize Google Sheets API:'), error.message);
          throw error;
        }
      }
    }
  }

  /**
   * Append learner data to Google Sheet
   * @param {Array} learners - Array of learner objects with name and email
   * @returns {Promise<Object>} - Result of the append operation
   */
  async appendLearnersToSheet(learners) {
    if (stryMutAct_9fa48("739")) {
      {}
    } else {
      stryCov_9fa48("739");
      try {
        if (stryMutAct_9fa48("740")) {
          {}
        } else {
          stryCov_9fa48("740");
          if (stryMutAct_9fa48("743") ? false : stryMutAct_9fa48("742") ? true : stryMutAct_9fa48("741") ? this.sheets : (stryCov_9fa48("741", "742", "743"), !this.sheets)) {
            if (stryMutAct_9fa48("744")) {
              {}
            } else {
              stryCov_9fa48("744");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("747") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("746") ? false : stryMutAct_9fa48("745") ? true : (stryCov_9fa48("745", "746", "747"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("748") ? "" : (stryCov_9fa48("748"), 'Sheet1!A:B'))); // Default range

          if (stryMutAct_9fa48("751") ? false : stryMutAct_9fa48("750") ? true : stryMutAct_9fa48("749") ? spreadsheetId : (stryCov_9fa48("749", "750", "751"), !spreadsheetId)) {
            if (stryMutAct_9fa48("752")) {
              {}
            } else {
              stryCov_9fa48("752");
              throw new Error(stryMutAct_9fa48("753") ? "" : (stryCov_9fa48("753"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Prepare data rows (name, email)
          const values = learners.map(stryMutAct_9fa48("754") ? () => undefined : (stryCov_9fa48("754"), learner => stryMutAct_9fa48("755") ? [] : (stryCov_9fa48("755"), [stryMutAct_9fa48("758") ? learner.name && '' : stryMutAct_9fa48("757") ? false : stryMutAct_9fa48("756") ? true : (stryCov_9fa48("756", "757", "758"), learner.name || (stryMutAct_9fa48("759") ? "Stryker was here!" : (stryCov_9fa48("759"), ''))), stryMutAct_9fa48("762") ? learner.email && '' : stryMutAct_9fa48("761") ? false : stryMutAct_9fa48("760") ? true : (stryCov_9fa48("760", "761", "762"), learner.email || (stryMutAct_9fa48("763") ? "Stryker was here!" : (stryCov_9fa48("763"), '')))])));

          // Append data to sheet
          const response = await this.sheets.spreadsheets.values.append(stryMutAct_9fa48("764") ? {} : (stryCov_9fa48("764"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("765") ? "" : (stryCov_9fa48("765"), 'USER_ENTERED'),
            insertDataOption: stryMutAct_9fa48("766") ? "" : (stryCov_9fa48("766"), 'INSERT_ROWS'),
            requestBody: stryMutAct_9fa48("767") ? {} : (stryCov_9fa48("767"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("768") ? `` : (stryCov_9fa48("768"), `✅ Appended ${values.length} learners to Google Sheet`));
          return stryMutAct_9fa48("769") ? {} : (stryCov_9fa48("769"), {
            success: stryMutAct_9fa48("770") ? false : (stryCov_9fa48("770"), true),
            updatedRows: response.data.updates.updatedRows,
            updatedRange: response.data.updates.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("771")) {
          {}
        } else {
          stryCov_9fa48("771");
          console.error(stryMutAct_9fa48("772") ? "" : (stryCov_9fa48("772"), '❌ Error appending to Google Sheet:'), error.message);
          throw error;
        }
      }
    }
  }

  /**
   * Clear existing data and write fresh learner data
   * @param {Array} learners - Array of learner objects
   * @returns {Promise<Object>} - Result of the operation
   */
  async replaceLearnersInSheet(learners) {
    if (stryMutAct_9fa48("773")) {
      {}
    } else {
      stryCov_9fa48("773");
      try {
        if (stryMutAct_9fa48("774")) {
          {}
        } else {
          stryCov_9fa48("774");
          if (stryMutAct_9fa48("777") ? false : stryMutAct_9fa48("776") ? true : stryMutAct_9fa48("775") ? this.sheets : (stryCov_9fa48("775", "776", "777"), !this.sheets)) {
            if (stryMutAct_9fa48("778")) {
              {}
            } else {
              stryCov_9fa48("778");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("781") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("780") ? false : stryMutAct_9fa48("779") ? true : (stryCov_9fa48("779", "780", "781"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("782") ? "" : (stryCov_9fa48("782"), 'Sheet1!A:B')));
          if (stryMutAct_9fa48("785") ? false : stryMutAct_9fa48("784") ? true : stryMutAct_9fa48("783") ? spreadsheetId : (stryCov_9fa48("783", "784", "785"), !spreadsheetId)) {
            if (stryMutAct_9fa48("786")) {
              {}
            } else {
              stryCov_9fa48("786");
              throw new Error(stryMutAct_9fa48("787") ? "" : (stryCov_9fa48("787"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Clear existing data first
          await this.sheets.spreadsheets.values.clear(stryMutAct_9fa48("788") ? {} : (stryCov_9fa48("788"), {
            spreadsheetId,
            range
          }));

          // Prepare data with headers
          const values = stryMutAct_9fa48("789") ? [] : (stryCov_9fa48("789"), [stryMutAct_9fa48("790") ? [] : (stryCov_9fa48("790"), [stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), 'Name'), stryMutAct_9fa48("792") ? "" : (stryCov_9fa48("792"), 'Email')]),
          // Header row
          ...learners.map(stryMutAct_9fa48("793") ? () => undefined : (stryCov_9fa48("793"), learner => stryMutAct_9fa48("794") ? [] : (stryCov_9fa48("794"), [stryMutAct_9fa48("797") ? learner.name && '' : stryMutAct_9fa48("796") ? false : stryMutAct_9fa48("795") ? true : (stryCov_9fa48("795", "796", "797"), learner.name || (stryMutAct_9fa48("798") ? "Stryker was here!" : (stryCov_9fa48("798"), ''))), stryMutAct_9fa48("801") ? learner.email && '' : stryMutAct_9fa48("800") ? false : stryMutAct_9fa48("799") ? true : (stryCov_9fa48("799", "800", "801"), learner.email || (stryMutAct_9fa48("802") ? "Stryker was here!" : (stryCov_9fa48("802"), '')))])))]);

          // Write new data
          const response = await this.sheets.spreadsheets.values.update(stryMutAct_9fa48("803") ? {} : (stryCov_9fa48("803"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), 'USER_ENTERED'),
            requestBody: stryMutAct_9fa48("805") ? {} : (stryCov_9fa48("805"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("806") ? `` : (stryCov_9fa48("806"), `✅ Replaced data with ${learners.length} learners in Google Sheet`));
          return stryMutAct_9fa48("807") ? {} : (stryCov_9fa48("807"), {
            success: stryMutAct_9fa48("808") ? false : (stryCov_9fa48("808"), true),
            updatedRows: response.data.updatedRows,
            updatedRange: response.data.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("809")) {
          {}
        } else {
          stryCov_9fa48("809");
          console.error(stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), '❌ Error replacing data in Google Sheet:'), error.message);
          throw error;
        }
      }
    }
  }

  /**
   * Get current data from Google Sheet
   * @returns {Promise<Array>} - Current sheet data
   */
  async getSheetData() {
    if (stryMutAct_9fa48("811")) {
      {}
    } else {
      stryCov_9fa48("811");
      try {
        if (stryMutAct_9fa48("812")) {
          {}
        } else {
          stryCov_9fa48("812");
          if (stryMutAct_9fa48("815") ? false : stryMutAct_9fa48("814") ? true : stryMutAct_9fa48("813") ? this.sheets : (stryCov_9fa48("813", "814", "815"), !this.sheets)) {
            if (stryMutAct_9fa48("816")) {
              {}
            } else {
              stryCov_9fa48("816");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("819") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("818") ? false : stryMutAct_9fa48("817") ? true : (stryCov_9fa48("817", "818", "819"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("820") ? "" : (stryCov_9fa48("820"), 'Sheet1!A:B')));
          const response = await this.sheets.spreadsheets.values.get(stryMutAct_9fa48("821") ? {} : (stryCov_9fa48("821"), {
            spreadsheetId,
            range
          }));
          return stryMutAct_9fa48("824") ? response.data.values && [] : stryMutAct_9fa48("823") ? false : stryMutAct_9fa48("822") ? true : (stryCov_9fa48("822", "823", "824"), response.data.values || (stryMutAct_9fa48("825") ? ["Stryker was here"] : (stryCov_9fa48("825"), [])));
        }
      } catch (error) {
        if (stryMutAct_9fa48("826")) {
          {}
        } else {
          stryCov_9fa48("826");
          console.error(stryMutAct_9fa48("827") ? "" : (stryCov_9fa48("827"), '❌ Error reading Google Sheet:'), error.message);
          throw error;
        }
      }
    }
  }
}

// Export singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;