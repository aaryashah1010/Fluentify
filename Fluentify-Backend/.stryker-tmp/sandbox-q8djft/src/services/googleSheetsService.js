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
    if (stryMutAct_9fa48("3290")) {
      {}
    } else {
      stryCov_9fa48("3290");
      this.sheets = null;
      this.auth = null;
    }
  }

  /**
   * Initialize Google Sheets API with service account credentials
   */
  async initialize() {
    if (stryMutAct_9fa48("3291")) {
      {}
    } else {
      stryCov_9fa48("3291");
      try {
        if (stryMutAct_9fa48("3292")) {
          {}
        } else {
          stryCov_9fa48("3292");
          // Parse the service account JSON from environment variable
          const credentials = JSON.parse(stryMutAct_9fa48("3295") ? process.env.GOOGLE_SERVICE_ACCOUNT_JSON && '{}' : stryMutAct_9fa48("3294") ? false : stryMutAct_9fa48("3293") ? true : (stryCov_9fa48("3293", "3294", "3295"), process.env.GOOGLE_SERVICE_ACCOUNT_JSON || (stryMutAct_9fa48("3296") ? "" : (stryCov_9fa48("3296"), '{}'))));
          if (stryMutAct_9fa48("3299") ? !credentials.client_email && !credentials.private_key : stryMutAct_9fa48("3298") ? false : stryMutAct_9fa48("3297") ? true : (stryCov_9fa48("3297", "3298", "3299"), (stryMutAct_9fa48("3300") ? credentials.client_email : (stryCov_9fa48("3300"), !credentials.client_email)) || (stryMutAct_9fa48("3301") ? credentials.private_key : (stryCov_9fa48("3301"), !credentials.private_key)))) {
            if (stryMutAct_9fa48("3302")) {
              {}
            } else {
              stryCov_9fa48("3302");
              throw new Error(stryMutAct_9fa48("3303") ? "" : (stryCov_9fa48("3303"), 'Invalid Google Service Account credentials'));
            }
          }

          // Create JWT auth client
          this.auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, stryMutAct_9fa48("3304") ? [] : (stryCov_9fa48("3304"), [stryMutAct_9fa48("3305") ? "" : (stryCov_9fa48("3305"), 'https://www.googleapis.com/auth/spreadsheets')]));

          // Initialize Sheets API
          this.sheets = google.sheets(stryMutAct_9fa48("3306") ? {} : (stryCov_9fa48("3306"), {
            version: stryMutAct_9fa48("3307") ? "" : (stryCov_9fa48("3307"), 'v4'),
            auth: this.auth
          }));
          console.log(stryMutAct_9fa48("3308") ? "" : (stryCov_9fa48("3308"), '✅ Google Sheets API initialized successfully'));
          return stryMutAct_9fa48("3309") ? false : (stryCov_9fa48("3309"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3310")) {
          {}
        } else {
          stryCov_9fa48("3310");
          console.error(stryMutAct_9fa48("3311") ? "" : (stryCov_9fa48("3311"), '❌ Failed to initialize Google Sheets API:'), error.message);
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
    if (stryMutAct_9fa48("3312")) {
      {}
    } else {
      stryCov_9fa48("3312");
      try {
        if (stryMutAct_9fa48("3313")) {
          {}
        } else {
          stryCov_9fa48("3313");
          if (stryMutAct_9fa48("3316") ? false : stryMutAct_9fa48("3315") ? true : stryMutAct_9fa48("3314") ? this.sheets : (stryCov_9fa48("3314", "3315", "3316"), !this.sheets)) {
            if (stryMutAct_9fa48("3317")) {
              {}
            } else {
              stryCov_9fa48("3317");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3320") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3319") ? false : stryMutAct_9fa48("3318") ? true : (stryCov_9fa48("3318", "3319", "3320"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3321") ? "" : (stryCov_9fa48("3321"), 'Sheet1!A:B'))); // Default range

          if (stryMutAct_9fa48("3324") ? false : stryMutAct_9fa48("3323") ? true : stryMutAct_9fa48("3322") ? spreadsheetId : (stryCov_9fa48("3322", "3323", "3324"), !spreadsheetId)) {
            if (stryMutAct_9fa48("3325")) {
              {}
            } else {
              stryCov_9fa48("3325");
              throw new Error(stryMutAct_9fa48("3326") ? "" : (stryCov_9fa48("3326"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Prepare data rows (name, email)
          const values = learners.map(stryMutAct_9fa48("3327") ? () => undefined : (stryCov_9fa48("3327"), learner => stryMutAct_9fa48("3328") ? [] : (stryCov_9fa48("3328"), [stryMutAct_9fa48("3331") ? learner.name && '' : stryMutAct_9fa48("3330") ? false : stryMutAct_9fa48("3329") ? true : (stryCov_9fa48("3329", "3330", "3331"), learner.name || (stryMutAct_9fa48("3332") ? "Stryker was here!" : (stryCov_9fa48("3332"), ''))), stryMutAct_9fa48("3335") ? learner.email && '' : stryMutAct_9fa48("3334") ? false : stryMutAct_9fa48("3333") ? true : (stryCov_9fa48("3333", "3334", "3335"), learner.email || (stryMutAct_9fa48("3336") ? "Stryker was here!" : (stryCov_9fa48("3336"), '')))])));

          // Append data to sheet
          const response = await this.sheets.spreadsheets.values.append(stryMutAct_9fa48("3337") ? {} : (stryCov_9fa48("3337"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("3338") ? "" : (stryCov_9fa48("3338"), 'USER_ENTERED'),
            insertDataOption: stryMutAct_9fa48("3339") ? "" : (stryCov_9fa48("3339"), 'INSERT_ROWS'),
            requestBody: stryMutAct_9fa48("3340") ? {} : (stryCov_9fa48("3340"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("3341") ? `` : (stryCov_9fa48("3341"), `✅ Appended ${values.length} learners to Google Sheet`));
          return stryMutAct_9fa48("3342") ? {} : (stryCov_9fa48("3342"), {
            success: stryMutAct_9fa48("3343") ? false : (stryCov_9fa48("3343"), true),
            updatedRows: response.data.updates.updatedRows,
            updatedRange: response.data.updates.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3344")) {
          {}
        } else {
          stryCov_9fa48("3344");
          console.error(stryMutAct_9fa48("3345") ? "" : (stryCov_9fa48("3345"), '❌ Error appending to Google Sheet:'), error.message);
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
    if (stryMutAct_9fa48("3346")) {
      {}
    } else {
      stryCov_9fa48("3346");
      try {
        if (stryMutAct_9fa48("3347")) {
          {}
        } else {
          stryCov_9fa48("3347");
          if (stryMutAct_9fa48("3350") ? false : stryMutAct_9fa48("3349") ? true : stryMutAct_9fa48("3348") ? this.sheets : (stryCov_9fa48("3348", "3349", "3350"), !this.sheets)) {
            if (stryMutAct_9fa48("3351")) {
              {}
            } else {
              stryCov_9fa48("3351");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3354") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3353") ? false : stryMutAct_9fa48("3352") ? true : (stryCov_9fa48("3352", "3353", "3354"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3355") ? "" : (stryCov_9fa48("3355"), 'Sheet1!A:B')));
          if (stryMutAct_9fa48("3358") ? false : stryMutAct_9fa48("3357") ? true : stryMutAct_9fa48("3356") ? spreadsheetId : (stryCov_9fa48("3356", "3357", "3358"), !spreadsheetId)) {
            if (stryMutAct_9fa48("3359")) {
              {}
            } else {
              stryCov_9fa48("3359");
              throw new Error(stryMutAct_9fa48("3360") ? "" : (stryCov_9fa48("3360"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Clear existing data first
          await this.sheets.spreadsheets.values.clear(stryMutAct_9fa48("3361") ? {} : (stryCov_9fa48("3361"), {
            spreadsheetId,
            range
          }));

          // Prepare data with headers
          const values = stryMutAct_9fa48("3362") ? [] : (stryCov_9fa48("3362"), [stryMutAct_9fa48("3363") ? [] : (stryCov_9fa48("3363"), [stryMutAct_9fa48("3364") ? "" : (stryCov_9fa48("3364"), 'Name'), stryMutAct_9fa48("3365") ? "" : (stryCov_9fa48("3365"), 'Email')]),
          // Header row
          ...learners.map(stryMutAct_9fa48("3366") ? () => undefined : (stryCov_9fa48("3366"), learner => stryMutAct_9fa48("3367") ? [] : (stryCov_9fa48("3367"), [stryMutAct_9fa48("3370") ? learner.name && '' : stryMutAct_9fa48("3369") ? false : stryMutAct_9fa48("3368") ? true : (stryCov_9fa48("3368", "3369", "3370"), learner.name || (stryMutAct_9fa48("3371") ? "Stryker was here!" : (stryCov_9fa48("3371"), ''))), stryMutAct_9fa48("3374") ? learner.email && '' : stryMutAct_9fa48("3373") ? false : stryMutAct_9fa48("3372") ? true : (stryCov_9fa48("3372", "3373", "3374"), learner.email || (stryMutAct_9fa48("3375") ? "Stryker was here!" : (stryCov_9fa48("3375"), '')))])))]);

          // Write new data
          const response = await this.sheets.spreadsheets.values.update(stryMutAct_9fa48("3376") ? {} : (stryCov_9fa48("3376"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("3377") ? "" : (stryCov_9fa48("3377"), 'USER_ENTERED'),
            requestBody: stryMutAct_9fa48("3378") ? {} : (stryCov_9fa48("3378"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("3379") ? `` : (stryCov_9fa48("3379"), `✅ Replaced data with ${learners.length} learners in Google Sheet`));
          return stryMutAct_9fa48("3380") ? {} : (stryCov_9fa48("3380"), {
            success: stryMutAct_9fa48("3381") ? false : (stryCov_9fa48("3381"), true),
            updatedRows: response.data.updatedRows,
            updatedRange: response.data.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3382")) {
          {}
        } else {
          stryCov_9fa48("3382");
          console.error(stryMutAct_9fa48("3383") ? "" : (stryCov_9fa48("3383"), '❌ Error replacing data in Google Sheet:'), error.message);
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
    if (stryMutAct_9fa48("3384")) {
      {}
    } else {
      stryCov_9fa48("3384");
      try {
        if (stryMutAct_9fa48("3385")) {
          {}
        } else {
          stryCov_9fa48("3385");
          if (stryMutAct_9fa48("3388") ? false : stryMutAct_9fa48("3387") ? true : stryMutAct_9fa48("3386") ? this.sheets : (stryCov_9fa48("3386", "3387", "3388"), !this.sheets)) {
            if (stryMutAct_9fa48("3389")) {
              {}
            } else {
              stryCov_9fa48("3389");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3392") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3391") ? false : stryMutAct_9fa48("3390") ? true : (stryCov_9fa48("3390", "3391", "3392"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3393") ? "" : (stryCov_9fa48("3393"), 'Sheet1!A:B')));
          const response = await this.sheets.spreadsheets.values.get(stryMutAct_9fa48("3394") ? {} : (stryCov_9fa48("3394"), {
            spreadsheetId,
            range
          }));
          return stryMutAct_9fa48("3397") ? response.data.values && [] : stryMutAct_9fa48("3396") ? false : stryMutAct_9fa48("3395") ? true : (stryCov_9fa48("3395", "3396", "3397"), response.data.values || (stryMutAct_9fa48("3398") ? ["Stryker was here"] : (stryCov_9fa48("3398"), [])));
        }
      } catch (error) {
        if (stryMutAct_9fa48("3399")) {
          {}
        } else {
          stryCov_9fa48("3399");
          console.error(stryMutAct_9fa48("3400") ? "" : (stryCov_9fa48("3400"), '❌ Error reading Google Sheet:'), error.message);
          throw error;
        }
      }
    }
  }
}

// Export singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;