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
    if (stryMutAct_9fa48("3619")) {
      {}
    } else {
      stryCov_9fa48("3619");
      this.sheets = null;
      this.auth = null;
    }
  }

  /**
   * Initialize Google Sheets API with service account credentials
   */
  async initialize() {
    if (stryMutAct_9fa48("3620")) {
      {}
    } else {
      stryCov_9fa48("3620");
      try {
        if (stryMutAct_9fa48("3621")) {
          {}
        } else {
          stryCov_9fa48("3621");
          // Parse the service account JSON from environment variable
          const credentials = JSON.parse(stryMutAct_9fa48("3624") ? process.env.GOOGLE_SERVICE_ACCOUNT_JSON && '{}' : stryMutAct_9fa48("3623") ? false : stryMutAct_9fa48("3622") ? true : (stryCov_9fa48("3622", "3623", "3624"), process.env.GOOGLE_SERVICE_ACCOUNT_JSON || (stryMutAct_9fa48("3625") ? "" : (stryCov_9fa48("3625"), '{}'))));
          if (stryMutAct_9fa48("3628") ? !credentials.client_email && !credentials.private_key : stryMutAct_9fa48("3627") ? false : stryMutAct_9fa48("3626") ? true : (stryCov_9fa48("3626", "3627", "3628"), (stryMutAct_9fa48("3629") ? credentials.client_email : (stryCov_9fa48("3629"), !credentials.client_email)) || (stryMutAct_9fa48("3630") ? credentials.private_key : (stryCov_9fa48("3630"), !credentials.private_key)))) {
            if (stryMutAct_9fa48("3631")) {
              {}
            } else {
              stryCov_9fa48("3631");
              throw new Error(stryMutAct_9fa48("3632") ? "" : (stryCov_9fa48("3632"), 'Invalid Google Service Account credentials'));
            }
          }

          // Create JWT auth client
          this.auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, stryMutAct_9fa48("3633") ? [] : (stryCov_9fa48("3633"), [stryMutAct_9fa48("3634") ? "" : (stryCov_9fa48("3634"), 'https://www.googleapis.com/auth/spreadsheets')]));

          // Initialize Sheets API
          this.sheets = google.sheets(stryMutAct_9fa48("3635") ? {} : (stryCov_9fa48("3635"), {
            version: stryMutAct_9fa48("3636") ? "" : (stryCov_9fa48("3636"), 'v4'),
            auth: this.auth
          }));
          console.log(stryMutAct_9fa48("3637") ? "" : (stryCov_9fa48("3637"), '✅ Google Sheets API initialized successfully'));
          return stryMutAct_9fa48("3638") ? false : (stryCov_9fa48("3638"), true);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3639")) {
          {}
        } else {
          stryCov_9fa48("3639");
          console.error(stryMutAct_9fa48("3640") ? "" : (stryCov_9fa48("3640"), '❌ Failed to initialize Google Sheets API:'), error.message);
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
    if (stryMutAct_9fa48("3641")) {
      {}
    } else {
      stryCov_9fa48("3641");
      try {
        if (stryMutAct_9fa48("3642")) {
          {}
        } else {
          stryCov_9fa48("3642");
          if (stryMutAct_9fa48("3645") ? false : stryMutAct_9fa48("3644") ? true : stryMutAct_9fa48("3643") ? this.sheets : (stryCov_9fa48("3643", "3644", "3645"), !this.sheets)) {
            if (stryMutAct_9fa48("3646")) {
              {}
            } else {
              stryCov_9fa48("3646");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3649") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3648") ? false : stryMutAct_9fa48("3647") ? true : (stryCov_9fa48("3647", "3648", "3649"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3650") ? "" : (stryCov_9fa48("3650"), 'Sheet1!A:B'))); // Default range

          if (stryMutAct_9fa48("3653") ? false : stryMutAct_9fa48("3652") ? true : stryMutAct_9fa48("3651") ? spreadsheetId : (stryCov_9fa48("3651", "3652", "3653"), !spreadsheetId)) {
            if (stryMutAct_9fa48("3654")) {
              {}
            } else {
              stryCov_9fa48("3654");
              throw new Error(stryMutAct_9fa48("3655") ? "" : (stryCov_9fa48("3655"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Prepare data rows (name, email)
          const values = learners.map(stryMutAct_9fa48("3656") ? () => undefined : (stryCov_9fa48("3656"), learner => stryMutAct_9fa48("3657") ? [] : (stryCov_9fa48("3657"), [stryMutAct_9fa48("3660") ? learner.name && '' : stryMutAct_9fa48("3659") ? false : stryMutAct_9fa48("3658") ? true : (stryCov_9fa48("3658", "3659", "3660"), learner.name || (stryMutAct_9fa48("3661") ? "Stryker was here!" : (stryCov_9fa48("3661"), ''))), stryMutAct_9fa48("3664") ? learner.email && '' : stryMutAct_9fa48("3663") ? false : stryMutAct_9fa48("3662") ? true : (stryCov_9fa48("3662", "3663", "3664"), learner.email || (stryMutAct_9fa48("3665") ? "Stryker was here!" : (stryCov_9fa48("3665"), '')))])));

          // Append data to sheet
          const response = await this.sheets.spreadsheets.values.append(stryMutAct_9fa48("3666") ? {} : (stryCov_9fa48("3666"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("3667") ? "" : (stryCov_9fa48("3667"), 'USER_ENTERED'),
            insertDataOption: stryMutAct_9fa48("3668") ? "" : (stryCov_9fa48("3668"), 'INSERT_ROWS'),
            requestBody: stryMutAct_9fa48("3669") ? {} : (stryCov_9fa48("3669"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("3670") ? `` : (stryCov_9fa48("3670"), `✅ Appended ${values.length} learners to Google Sheet`));
          return stryMutAct_9fa48("3671") ? {} : (stryCov_9fa48("3671"), {
            success: stryMutAct_9fa48("3672") ? false : (stryCov_9fa48("3672"), true),
            updatedRows: response.data.updates.updatedRows,
            updatedRange: response.data.updates.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3673")) {
          {}
        } else {
          stryCov_9fa48("3673");
          console.error(stryMutAct_9fa48("3674") ? "" : (stryCov_9fa48("3674"), '❌ Error appending to Google Sheet:'), error.message);
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
    if (stryMutAct_9fa48("3675")) {
      {}
    } else {
      stryCov_9fa48("3675");
      try {
        if (stryMutAct_9fa48("3676")) {
          {}
        } else {
          stryCov_9fa48("3676");
          if (stryMutAct_9fa48("3679") ? false : stryMutAct_9fa48("3678") ? true : stryMutAct_9fa48("3677") ? this.sheets : (stryCov_9fa48("3677", "3678", "3679"), !this.sheets)) {
            if (stryMutAct_9fa48("3680")) {
              {}
            } else {
              stryCov_9fa48("3680");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3683") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3682") ? false : stryMutAct_9fa48("3681") ? true : (stryCov_9fa48("3681", "3682", "3683"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3684") ? "" : (stryCov_9fa48("3684"), 'Sheet1!A:B')));
          if (stryMutAct_9fa48("3687") ? false : stryMutAct_9fa48("3686") ? true : stryMutAct_9fa48("3685") ? spreadsheetId : (stryCov_9fa48("3685", "3686", "3687"), !spreadsheetId)) {
            if (stryMutAct_9fa48("3688")) {
              {}
            } else {
              stryCov_9fa48("3688");
              throw new Error(stryMutAct_9fa48("3689") ? "" : (stryCov_9fa48("3689"), 'GOOGLE_SHEET_ID not configured in environment variables'));
            }
          }

          // Clear existing data first
          await this.sheets.spreadsheets.values.clear(stryMutAct_9fa48("3690") ? {} : (stryCov_9fa48("3690"), {
            spreadsheetId,
            range
          }));

          // Prepare data with headers
          const values = stryMutAct_9fa48("3691") ? [] : (stryCov_9fa48("3691"), [stryMutAct_9fa48("3692") ? [] : (stryCov_9fa48("3692"), [stryMutAct_9fa48("3693") ? "" : (stryCov_9fa48("3693"), 'Name'), stryMutAct_9fa48("3694") ? "" : (stryCov_9fa48("3694"), 'Email')]),
          // Header row
          ...learners.map(stryMutAct_9fa48("3695") ? () => undefined : (stryCov_9fa48("3695"), learner => stryMutAct_9fa48("3696") ? [] : (stryCov_9fa48("3696"), [stryMutAct_9fa48("3699") ? learner.name && '' : stryMutAct_9fa48("3698") ? false : stryMutAct_9fa48("3697") ? true : (stryCov_9fa48("3697", "3698", "3699"), learner.name || (stryMutAct_9fa48("3700") ? "Stryker was here!" : (stryCov_9fa48("3700"), ''))), stryMutAct_9fa48("3703") ? learner.email && '' : stryMutAct_9fa48("3702") ? false : stryMutAct_9fa48("3701") ? true : (stryCov_9fa48("3701", "3702", "3703"), learner.email || (stryMutAct_9fa48("3704") ? "Stryker was here!" : (stryCov_9fa48("3704"), '')))])))]);

          // Write new data
          const response = await this.sheets.spreadsheets.values.update(stryMutAct_9fa48("3705") ? {} : (stryCov_9fa48("3705"), {
            spreadsheetId,
            range,
            valueInputOption: stryMutAct_9fa48("3706") ? "" : (stryCov_9fa48("3706"), 'USER_ENTERED'),
            requestBody: stryMutAct_9fa48("3707") ? {} : (stryCov_9fa48("3707"), {
              values
            })
          }));
          console.log(stryMutAct_9fa48("3708") ? `` : (stryCov_9fa48("3708"), `✅ Replaced data with ${learners.length} learners in Google Sheet`));
          return stryMutAct_9fa48("3709") ? {} : (stryCov_9fa48("3709"), {
            success: stryMutAct_9fa48("3710") ? false : (stryCov_9fa48("3710"), true),
            updatedRows: response.data.updatedRows,
            updatedRange: response.data.updatedRange,
            spreadsheetId
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3711")) {
          {}
        } else {
          stryCov_9fa48("3711");
          console.error(stryMutAct_9fa48("3712") ? "" : (stryCov_9fa48("3712"), '❌ Error replacing data in Google Sheet:'), error.message);
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
    if (stryMutAct_9fa48("3713")) {
      {}
    } else {
      stryCov_9fa48("3713");
      try {
        if (stryMutAct_9fa48("3714")) {
          {}
        } else {
          stryCov_9fa48("3714");
          if (stryMutAct_9fa48("3717") ? false : stryMutAct_9fa48("3716") ? true : stryMutAct_9fa48("3715") ? this.sheets : (stryCov_9fa48("3715", "3716", "3717"), !this.sheets)) {
            if (stryMutAct_9fa48("3718")) {
              {}
            } else {
              stryCov_9fa48("3718");
              await this.initialize();
            }
          }
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = stryMutAct_9fa48("3721") ? process.env.GOOGLE_SHEET_RANGE && 'Sheet1!A:B' : stryMutAct_9fa48("3720") ? false : stryMutAct_9fa48("3719") ? true : (stryCov_9fa48("3719", "3720", "3721"), process.env.GOOGLE_SHEET_RANGE || (stryMutAct_9fa48("3722") ? "" : (stryCov_9fa48("3722"), 'Sheet1!A:B')));
          const response = await this.sheets.spreadsheets.values.get(stryMutAct_9fa48("3723") ? {} : (stryCov_9fa48("3723"), {
            spreadsheetId,
            range
          }));
          return stryMutAct_9fa48("3726") ? response.data.values && [] : stryMutAct_9fa48("3725") ? false : stryMutAct_9fa48("3724") ? true : (stryCov_9fa48("3724", "3725", "3726"), response.data.values || (stryMutAct_9fa48("3727") ? ["Stryker was here"] : (stryCov_9fa48("3727"), [])));
        }
      } catch (error) {
        if (stryMutAct_9fa48("3728")) {
          {}
        } else {
          stryCov_9fa48("3728");
          console.error(stryMutAct_9fa48("3729") ? "" : (stryCov_9fa48("3729"), '❌ Error reading Google Sheet:'), error.message);
          throw error;
        }
      }
    }
  }
}

// Export singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;