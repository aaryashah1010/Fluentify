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
    if (stryMutAct_9fa48("3273")) {
      {}
    } else {
      stryCov_9fa48("3273");
      this.sheets = null;
      this.auth = null;
    }
  }

  /**
   * Initialize Google Sheets API with service account credentials
   */
  async initialize() {
    if (stryMutAct_9fa48("3274")) {
      {}
    } else {
      stryCov_9fa48("3274");
      try {
        if (stryMutAct_9fa48("3275")) {
          {}
        } else {
          stryCov_9fa48("3275");
          // Parse the service account JSON from environment variable
          const credentials = JSON.parse(stryMutAct_9fa48("3278") ? process.env.GOOGLE_SERVICE_ACCOUNT_JSON && '{}' : stryMutAct_9fa48("3277") ? false : stryMutAct_9fa48("3276") ? true : (stryCov_9fa48("3276", "3277", "3278"), process.env.GOOGLE_SERVICE_ACCOUNT_JSON || (stryMutAct_9fa48("3279") ? "" : (stryCov_9fa48("3279"), '{}'))));
          if (stryMutAct_9fa48("3282") ? !credentials.client_email && !credentials.private_key : stryMutAct_9fa48("3281") ? false : stryMutAct_9fa48("3280") ? true : (stryCov_9fa48("3280", "3281", "3282"), (stryMutAct_9fa48("3283") ? credentials.client_email : (stryCov_9fa48("3283"), !credentials.client_email)) || (stryMutAct_9fa48("3284") ? credentials.private_key : (stryCov_9fa48("3284"), !credentials.private_key)))) {
            if (stryMutAct_9fa48("3285")) {
              {}
            } else {
              stryCov_9fa48("3285");
              throw new Error(stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), 'Invalid Google Service Account credentials'));
            }
          }

          // Create JWT auth client
          this.auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, stryMutAct_9fa48("3287") ? [] : (stryCov_9fa48("3287"), [stryMutAct_9fa48("3288") ? "" : (stryCov_9fa48("3288"), 'https://www.googleapis.com/auth/spreadsheets')]));

          // Initialize Sheets API
          this.sheets = google.sheets(stryMutAct_9fa48("3289") ? {} : (stryCov_9fa48("3289"), {
            version: stryMutAct_9fa48("3290") ? "" : (stryCov_9fa48("3290"), 'v4'),
            auth: this.auth
          }));
          console.log(stryMutAct_9fa48("3291") ? "" : (stryCov_9fa48("3291"), '✅ Google Sheets API initialized successfully'));
          return stryMutAct_9fa48("3292") ? false : (stryCov_9fa48("3292"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3293")) {
          {}
        } else {
          stryCov_9fa48("3293");
          console.error(stryMutAct_9fa48("3294") ? "" : (stryCov_9fa48("3294"), '❌ Failed to initialize Google Sheets API:'), error.message);
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
    if (stryMutAct_9fa48("3295")) {
      {}
    } else {
      stryCov_9fa48("3295");
      try {
        if (stryMutAct_9fa48("3296")) {
          {}
        } else {
          stryCov_9fa48("3296");
          if (stryMutAct_9fa48("3299") ? false : stryMutAct_9fa48("3298") ? true : stryMutAct_9fa48("3297") ? this.sheets : (stryCov_9fa48("3297", "3298", "3299"), !this.sheets)) {
            if (stryMutAct_9fa48("3300")) {
              {}
            } else {
              stryCov_9fa48("3300");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3303") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3302") ? false : stryMutAct_9fa48("3301") ? true : (stryCov_9fa48("3301", "3302", "3303"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3304") ? "" : (stryCov_9fa48("3304"), 'Sheet1!A:B'))); // Default range

          if (stryMutAct_9fa48("3307") ? false : stryMutAct_9fa48("3306") ? true : stryMutAct_9fa48("3305") ? spreadsheetId : (stryCov_9fa48("3305", "3306", "3307"), !spreadsheetId)) {
            if (stryMutAct_9fa48("3308")) {
              {}
            } else {
              stryCov_9fa48("3308");
              throw new Error(stryMutAct_9fa48("3309") ? "" : (stryCov_9fa48("3309"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Prepare data rows (name, email)
          const values = learners.map(stryMutAct_9fa48("3310") ? () => undefined : (stryCov_9fa48("3310"), learner => stryMutAct_9fa48("3311") ? [] : (stryCov_9fa48("3311"), [stryMutAct_9fa48("3314") ? learner.name && '' : stryMutAct_9fa48("3313") ? false : stryMutAct_9fa48("3312") ? true : (stryCov_9fa48("3312", "3313", "3314"), learner.name || (stryMutAct_9fa48("3315") ? "Stryker was here!" : (stryCov_9fa48("3315"), ''))), stryMutAct_9fa48("3318") ? learner.email && '' : stryMutAct_9fa48("3317") ? false : stryMutAct_9fa48("3316") ? true : (stryCov_9fa48("3316", "3317", "3318"), learner.email || (stryMutAct_9fa48("3319") ? "Stryker was here!" : (stryCov_9fa48("3319"), '')))])));

          // Append data to sheet
          const response = await this.sheets.spreadsheets.values.append(stryMutAct_9fa48("3320") ? {} : (stryCov_9fa48("3320"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("3321") ? "" : (stryCov_9fa48("3321"), 'USER_ENTERED'),
            insertDataOption: stryMutAct_9fa48("3322") ? "" : (stryCov_9fa48("3322"), 'INSERT_ROWS'),
            requestBody: stryMutAct_9fa48("3323") ? {} : (stryCov_9fa48("3323"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("3324") ? `` : (stryCov_9fa48("3324"), `✅ Appended ${values.length} learners to Google Sheet`));
          return stryMutAct_9fa48("3325") ? {} : (stryCov_9fa48("3325"), {
            success: stryMutAct_9fa48("3326") ? false : (stryCov_9fa48("3326"), true),
            updatedRows: response.data.updates.updatedRows,
            updatedRange: response.data.updates.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3327")) {
          {}
        } else {
          stryCov_9fa48("3327");
          console.error(stryMutAct_9fa48("3328") ? "" : (stryCov_9fa48("3328"), '❌ Error appending to Google Sheet:'), error.message);
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
    if (stryMutAct_9fa48("3329")) {
      {}
    } else {
      stryCov_9fa48("3329");
      try {
        if (stryMutAct_9fa48("3330")) {
          {}
        } else {
          stryCov_9fa48("3330");
          if (stryMutAct_9fa48("3333") ? false : stryMutAct_9fa48("3332") ? true : stryMutAct_9fa48("3331") ? this.sheets : (stryCov_9fa48("3331", "3332", "3333"), !this.sheets)) {
            if (stryMutAct_9fa48("3334")) {
              {}
            } else {
              stryCov_9fa48("3334");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3337") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3336") ? false : stryMutAct_9fa48("3335") ? true : (stryCov_9fa48("3335", "3336", "3337"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3338") ? "" : (stryCov_9fa48("3338"), 'Sheet1!A:B')));
          if (stryMutAct_9fa48("3341") ? false : stryMutAct_9fa48("3340") ? true : stryMutAct_9fa48("3339") ? spreadsheetId : (stryCov_9fa48("3339", "3340", "3341"), !spreadsheetId)) {
            if (stryMutAct_9fa48("3342")) {
              {}
            } else {
              stryCov_9fa48("3342");
              throw new Error(stryMutAct_9fa48("3343") ? "" : (stryCov_9fa48("3343"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Clear existing data first
          await this.sheets.spreadsheets.values.clear(stryMutAct_9fa48("3344") ? {} : (stryCov_9fa48("3344"), {
            spreadsheetId,
            range
          }));

          // Prepare data with headers
          const values = stryMutAct_9fa48("3345") ? [] : (stryCov_9fa48("3345"), [stryMutAct_9fa48("3346") ? [] : (stryCov_9fa48("3346"), [stryMutAct_9fa48("3347") ? "" : (stryCov_9fa48("3347"), 'Name'), stryMutAct_9fa48("3348") ? "" : (stryCov_9fa48("3348"), 'Email')]),
          // Header row
          ...learners.map(stryMutAct_9fa48("3349") ? () => undefined : (stryCov_9fa48("3349"), learner => stryMutAct_9fa48("3350") ? [] : (stryCov_9fa48("3350"), [stryMutAct_9fa48("3353") ? learner.name && '' : stryMutAct_9fa48("3352") ? false : stryMutAct_9fa48("3351") ? true : (stryCov_9fa48("3351", "3352", "3353"), learner.name || (stryMutAct_9fa48("3354") ? "Stryker was here!" : (stryCov_9fa48("3354"), ''))), stryMutAct_9fa48("3357") ? learner.email && '' : stryMutAct_9fa48("3356") ? false : stryMutAct_9fa48("3355") ? true : (stryCov_9fa48("3355", "3356", "3357"), learner.email || (stryMutAct_9fa48("3358") ? "Stryker was here!" : (stryCov_9fa48("3358"), '')))])))]);

          // Write new data
          const response = await this.sheets.spreadsheets.values.update(stryMutAct_9fa48("3359") ? {} : (stryCov_9fa48("3359"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("3360") ? "" : (stryCov_9fa48("3360"), 'USER_ENTERED'),
            requestBody: stryMutAct_9fa48("3361") ? {} : (stryCov_9fa48("3361"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("3362") ? `` : (stryCov_9fa48("3362"), `✅ Replaced data with ${learners.length} learners in Google Sheet`));
          return stryMutAct_9fa48("3363") ? {} : (stryCov_9fa48("3363"), {
            success: stryMutAct_9fa48("3364") ? false : (stryCov_9fa48("3364"), true),
            updatedRows: response.data.updatedRows,
            updatedRange: response.data.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3365")) {
          {}
        } else {
          stryCov_9fa48("3365");
          console.error(stryMutAct_9fa48("3366") ? "" : (stryCov_9fa48("3366"), '❌ Error replacing data in Google Sheet:'), error.message);
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
    if (stryMutAct_9fa48("3367")) {
      {}
    } else {
      stryCov_9fa48("3367");
      try {
        if (stryMutAct_9fa48("3368")) {
          {}
        } else {
          stryCov_9fa48("3368");
          if (stryMutAct_9fa48("3371") ? false : stryMutAct_9fa48("3370") ? true : stryMutAct_9fa48("3369") ? this.sheets : (stryCov_9fa48("3369", "3370", "3371"), !this.sheets)) {
            if (stryMutAct_9fa48("3372")) {
              {}
            } else {
              stryCov_9fa48("3372");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3375") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3374") ? false : stryMutAct_9fa48("3373") ? true : (stryCov_9fa48("3373", "3374", "3375"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3376") ? "" : (stryCov_9fa48("3376"), 'Sheet1!A:B')));
          const response = await this.sheets.spreadsheets.values.get(stryMutAct_9fa48("3377") ? {} : (stryCov_9fa48("3377"), {
            spreadsheetId,
            range
          }));
          return stryMutAct_9fa48("3380") ? response.data.values && [] : stryMutAct_9fa48("3379") ? false : stryMutAct_9fa48("3378") ? true : (stryCov_9fa48("3378", "3379", "3380"), response.data.values || (stryMutAct_9fa48("3381") ? ["Stryker was here"] : (stryCov_9fa48("3381"), [])));
        }
      } catch (error) {
        if (stryMutAct_9fa48("3382")) {
          {}
        } else {
          stryCov_9fa48("3382");
          console.error(stryMutAct_9fa48("3383") ? "" : (stryCov_9fa48("3383"), '❌ Error reading Google Sheet:'), error.message);
          throw error;
        }
      }
    }
  }
}

// Export singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;