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
import db from '../config/db.js';
import googleSheetsService from '../services/googleSheetsService.js';

/**
 * Get all learners for email campaign
 * Returns name and email of all learners
 */
export const getLearnersForCampaign = async (req, res, next) => {
  if (stryMutAct_9fa48("1306")) {
    {}
  } else {
    stryCov_9fa48("1306");
    try {
      if (stryMutAct_9fa48("1307")) {
        {}
      } else {
        stryCov_9fa48("1307");
        const query = stryMutAct_9fa48("1308") ? `` : (stryCov_9fa48("1308"), `
      SELECT 
        name,
        email,
        created_at
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `);
        const result = await db.query(query);
        return res.status(200).json(stryMutAct_9fa48("1309") ? {} : (stryCov_9fa48("1309"), {
          success: stryMutAct_9fa48("1310") ? false : (stryCov_9fa48("1310"), true),
          data: stryMutAct_9fa48("1311") ? {} : (stryCov_9fa48("1311"), {
            learners: result.rows,
            count: result.rows.length
          }),
          message: stryMutAct_9fa48("1312") ? "" : (stryCov_9fa48("1312"), 'Learners fetched successfully')
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1313")) {
        {}
      } else {
        stryCov_9fa48("1313");
        console.error(stryMutAct_9fa48("1314") ? "" : (stryCov_9fa48("1314"), 'Error fetching learners:'), error);
        next(error);
      }
    }
  }
};

/**
 * Append learners to Google Sheet and trigger N8N workflow
 * Appends learner data to Google Sheet, then triggers N8N webhook
 */
export const triggerEmailCampaign = async (req, res, next) => {
  if (stryMutAct_9fa48("1315")) {
    {}
  } else {
    stryCov_9fa48("1315");
    try {
      if (stryMutAct_9fa48("1316")) {
        {}
      } else {
        stryCov_9fa48("1316");
        // Get all learners
        const query = stryMutAct_9fa48("1317") ? `` : (stryCov_9fa48("1317"), `
      SELECT 
        name,
        email,
        created_at
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `);
        const result = await db.query(query);
        const learners = result.rows;
        if (stryMutAct_9fa48("1320") ? learners.length !== 0 : stryMutAct_9fa48("1319") ? false : stryMutAct_9fa48("1318") ? true : (stryCov_9fa48("1318", "1319", "1320"), learners.length === 0)) {
          if (stryMutAct_9fa48("1321")) {
            {}
          } else {
            stryCov_9fa48("1321");
            return res.status(400).json(stryMutAct_9fa48("1322") ? {} : (stryCov_9fa48("1322"), {
              success: stryMutAct_9fa48("1323") ? true : (stryCov_9fa48("1323"), false),
              message: stryMutAct_9fa48("1324") ? "" : (stryCov_9fa48("1324"), 'No learners found to add to Google Sheet')
            }));
          }
        }
        console.log(stryMutAct_9fa48("1325") ? `` : (stryCov_9fa48("1325"), `📊 Appending ${learners.length} learners to Google Sheet`));

        // Append learners to Google Sheet
        const sheetResult = await googleSheetsService.appendLearnersToSheet(learners);
        console.log(stryMutAct_9fa48("1326") ? "" : (stryCov_9fa48("1326"), '✅ Learners appended to Google Sheet successfully'));

        // Trigger N8N webhook (without passing data)
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (stryMutAct_9fa48("1328") ? false : stryMutAct_9fa48("1327") ? true : (stryCov_9fa48("1327", "1328"), webhookUrl)) {
          if (stryMutAct_9fa48("1329")) {
            {}
          } else {
            stryCov_9fa48("1329");
            try {
              if (stryMutAct_9fa48("1330")) {
                {}
              } else {
                stryCov_9fa48("1330");
                console.log(stryMutAct_9fa48("1331") ? "" : (stryCov_9fa48("1331"), '🔔 Triggering N8N workflow...'));
                const response = await fetch(webhookUrl, stryMutAct_9fa48("1332") ? {} : (stryCov_9fa48("1332"), {
                  method: stryMutAct_9fa48("1333") ? "" : (stryCov_9fa48("1333"), 'POST'),
                  headers: stryMutAct_9fa48("1334") ? {} : (stryCov_9fa48("1334"), {
                    'Content-Type': stryMutAct_9fa48("1335") ? "" : (stryCov_9fa48("1335"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("1336") ? {} : (stryCov_9fa48("1336"), {
                    action: stryMutAct_9fa48("1337") ? "" : (stryCov_9fa48("1337"), 'email_campaign_triggered'),
                    timestamp: new Date().toISOString(),
                    learnerCount: learners.length,
                    source: stryMutAct_9fa48("1338") ? "" : (stryCov_9fa48("1338"), 'Fluentify Admin')
                  }))
                }));
                if (stryMutAct_9fa48("1340") ? false : stryMutAct_9fa48("1339") ? true : (stryCov_9fa48("1339", "1340"), response.ok)) {
                  if (stryMutAct_9fa48("1341")) {
                    {}
                  } else {
                    stryCov_9fa48("1341");
                    console.log(stryMutAct_9fa48("1342") ? "" : (stryCov_9fa48("1342"), '✅ N8N workflow triggered successfully'));
                  }
                } else {
                  if (stryMutAct_9fa48("1343")) {
                    {}
                  } else {
                    stryCov_9fa48("1343");
                    console.warn(stryMutAct_9fa48("1344") ? "" : (stryCov_9fa48("1344"), '⚠️ N8N webhook call failed, but data was added to sheet'));
                  }
                }
              }
            } catch (webhookError) {
              if (stryMutAct_9fa48("1345")) {
                {}
              } else {
                stryCov_9fa48("1345");
                console.warn(stryMutAct_9fa48("1346") ? "" : (stryCov_9fa48("1346"), '⚠️ N8N webhook error (data still added to sheet):'), webhookError.message);
              }
            }
          }
        }
        return res.status(200).json(stryMutAct_9fa48("1347") ? {} : (stryCov_9fa48("1347"), {
          success: stryMutAct_9fa48("1348") ? false : (stryCov_9fa48("1348"), true),
          data: stryMutAct_9fa48("1349") ? {} : (stryCov_9fa48("1349"), {
            learnerCount: learners.length,
            spreadsheetId: sheetResult.spreadsheetId,
            updatedRange: sheetResult.updatedRange,
            updatedRows: sheetResult.updatedRows
          }),
          message: stryMutAct_9fa48("1350") ? `` : (stryCov_9fa48("1350"), `Successfully appended ${learners.length} learners to Google Sheet`)
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1351")) {
        {}
      } else {
        stryCov_9fa48("1351");
        console.error(stryMutAct_9fa48("1352") ? "" : (stryCov_9fa48("1352"), '❌ Error in email campaign:'), error);

        // Provide more specific error messages
        if (stryMutAct_9fa48("1354") ? false : stryMutAct_9fa48("1353") ? true : (stryCov_9fa48("1353", "1354"), error.message.includes(stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), 'GOOGLE_SHEET_ID')))) {
          if (stryMutAct_9fa48("1356")) {
            {}
          } else {
            stryCov_9fa48("1356");
            return res.status(500).json(stryMutAct_9fa48("1357") ? {} : (stryCov_9fa48("1357"), {
              success: stryMutAct_9fa48("1358") ? true : (stryCov_9fa48("1358"), false),
              message: stryMutAct_9fa48("1359") ? "" : (stryCov_9fa48("1359"), 'Google Sheet not configured. Please set GOOGLE_SHEET_ID in environment variables.')
            }));
          }
        }
        if (stryMutAct_9fa48("1361") ? false : stryMutAct_9fa48("1360") ? true : (stryCov_9fa48("1360", "1361"), error.message.includes(stryMutAct_9fa48("1362") ? "" : (stryCov_9fa48("1362"), 'credentials')))) {
          if (stryMutAct_9fa48("1363")) {
            {}
          } else {
            stryCov_9fa48("1363");
            return res.status(500).json(stryMutAct_9fa48("1364") ? {} : (stryCov_9fa48("1364"), {
              success: stryMutAct_9fa48("1365") ? true : (stryCov_9fa48("1365"), false),
              message: stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), 'Google Service Account not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON in environment variables.')
            }));
          }
        }
        next(error);
      }
    }
  }
};

/**
 * Get learners in Google Sheets format (CSV)
 */
export const exportLearnersCSV = async (req, res, next) => {
  if (stryMutAct_9fa48("1367")) {
    {}
  } else {
    stryCov_9fa48("1367");
    try {
      if (stryMutAct_9fa48("1368")) {
        {}
      } else {
        stryCov_9fa48("1368");
        const query = stryMutAct_9fa48("1369") ? `` : (stryCov_9fa48("1369"), `
      SELECT 
        name,
        email
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `);
        const result = await db.query(query);
        const learners = result.rows;

        // Create CSV content
        let csv = stryMutAct_9fa48("1370") ? "" : (stryCov_9fa48("1370"), 'Name,Email\n');
        learners.forEach(learner => {
          if (stryMutAct_9fa48("1371")) {
            {}
          } else {
            stryCov_9fa48("1371");
            csv += stryMutAct_9fa48("1372") ? `` : (stryCov_9fa48("1372"), `${learner.name},${learner.email}\n`);
          }
        });
        res.setHeader(stryMutAct_9fa48("1373") ? "" : (stryCov_9fa48("1373"), 'Content-Type'), stryMutAct_9fa48("1374") ? "" : (stryCov_9fa48("1374"), 'text/csv'));
        res.setHeader(stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), 'Content-Disposition'), stryMutAct_9fa48("1376") ? "" : (stryCov_9fa48("1376"), 'attachment; filename=learners.csv'));
        return res.status(200).send(csv);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1377")) {
        {}
      } else {
        stryCov_9fa48("1377");
        console.error(stryMutAct_9fa48("1378") ? "" : (stryCov_9fa48("1378"), 'Error exporting learners:'), error);
        next(error);
      }
    }
  }
};
export default stryMutAct_9fa48("1379") ? {} : (stryCov_9fa48("1379"), {
  getLearnersForCampaign,
  triggerEmailCampaign,
  exportLearnersCSV
});