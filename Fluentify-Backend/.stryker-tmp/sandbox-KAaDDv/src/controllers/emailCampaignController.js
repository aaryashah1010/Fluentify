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
  if (stryMutAct_9fa48("1285")) {
    {}
  } else {
    stryCov_9fa48("1285");
    try {
      if (stryMutAct_9fa48("1286")) {
        {}
      } else {
        stryCov_9fa48("1286");
        const query = stryMutAct_9fa48("1287") ? `` : (stryCov_9fa48("1287"), `
      SELECT 
        name,
        email,
        created_at
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `);
        const result = await db.query(query);
        return res.status(200).json(stryMutAct_9fa48("1288") ? {} : (stryCov_9fa48("1288"), {
          success: stryMutAct_9fa48("1289") ? false : (stryCov_9fa48("1289"), true),
          data: stryMutAct_9fa48("1290") ? {} : (stryCov_9fa48("1290"), {
            learners: result.rows,
            count: result.rows.length
          }),
          message: stryMutAct_9fa48("1291") ? "" : (stryCov_9fa48("1291"), 'Learners fetched successfully')
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1292")) {
        {}
      } else {
        stryCov_9fa48("1292");
        console.error(stryMutAct_9fa48("1293") ? "" : (stryCov_9fa48("1293"), 'Error fetching learners:'), error);
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
  if (stryMutAct_9fa48("1294")) {
    {}
  } else {
    stryCov_9fa48("1294");
    try {
      if (stryMutAct_9fa48("1295")) {
        {}
      } else {
        stryCov_9fa48("1295");
        // Get all learners
        const query = stryMutAct_9fa48("1296") ? `` : (stryCov_9fa48("1296"), `
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
        if (stryMutAct_9fa48("1299") ? learners.length !== 0 : stryMutAct_9fa48("1298") ? false : stryMutAct_9fa48("1297") ? true : (stryCov_9fa48("1297", "1298", "1299"), learners.length === 0)) {
          if (stryMutAct_9fa48("1300")) {
            {}
          } else {
            stryCov_9fa48("1300");
            return res.status(400).json(stryMutAct_9fa48("1301") ? {} : (stryCov_9fa48("1301"), {
              success: stryMutAct_9fa48("1302") ? true : (stryCov_9fa48("1302"), false),
              message: stryMutAct_9fa48("1303") ? "" : (stryCov_9fa48("1303"), 'No learners found to add to Google Sheet')
            }));
          }
        }
        console.log(stryMutAct_9fa48("1304") ? `` : (stryCov_9fa48("1304"), `📊 Appending ${learners.length} learners to Google Sheet`));

        // Append learners to Google Sheet
        const sheetResult = await googleSheetsService.appendLearnersToSheet(learners);
        console.log(stryMutAct_9fa48("1305") ? "" : (stryCov_9fa48("1305"), '✅ Learners appended to Google Sheet successfully'));

        // Trigger N8N webhook (without passing data)
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (stryMutAct_9fa48("1307") ? false : stryMutAct_9fa48("1306") ? true : (stryCov_9fa48("1306", "1307"), webhookUrl)) {
          if (stryMutAct_9fa48("1308")) {
            {}
          } else {
            stryCov_9fa48("1308");
            try {
              if (stryMutAct_9fa48("1309")) {
                {}
              } else {
                stryCov_9fa48("1309");
                console.log(stryMutAct_9fa48("1310") ? "" : (stryCov_9fa48("1310"), '🔔 Triggering N8N workflow...'));
                const response = await fetch(webhookUrl, stryMutAct_9fa48("1311") ? {} : (stryCov_9fa48("1311"), {
                  method: stryMutAct_9fa48("1312") ? "" : (stryCov_9fa48("1312"), 'POST'),
                  headers: stryMutAct_9fa48("1313") ? {} : (stryCov_9fa48("1313"), {
                    'Content-Type': stryMutAct_9fa48("1314") ? "" : (stryCov_9fa48("1314"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("1315") ? {} : (stryCov_9fa48("1315"), {
                    action: stryMutAct_9fa48("1316") ? "" : (stryCov_9fa48("1316"), 'email_campaign_triggered'),
                    timestamp: new Date().toISOString(),
                    learnerCount: learners.length,
                    source: stryMutAct_9fa48("1317") ? "" : (stryCov_9fa48("1317"), 'Fluentify Admin')
                  }))
                }));
                if (stryMutAct_9fa48("1319") ? false : stryMutAct_9fa48("1318") ? true : (stryCov_9fa48("1318", "1319"), response.ok)) {
                  if (stryMutAct_9fa48("1320")) {
                    {}
                  } else {
                    stryCov_9fa48("1320");
                    console.log(stryMutAct_9fa48("1321") ? "" : (stryCov_9fa48("1321"), '✅ N8N workflow triggered successfully'));
                  }
                } else {
                  if (stryMutAct_9fa48("1322")) {
                    {}
                  } else {
                    stryCov_9fa48("1322");
                    console.warn(stryMutAct_9fa48("1323") ? "" : (stryCov_9fa48("1323"), '⚠️ N8N webhook call failed, but data was added to sheet'));
                  }
                }
              }
            } catch (webhookError) {
              if (stryMutAct_9fa48("1324")) {
                {}
              } else {
                stryCov_9fa48("1324");
                console.warn(stryMutAct_9fa48("1325") ? "" : (stryCov_9fa48("1325"), '⚠️ N8N webhook error (data still added to sheet):'), webhookError.message);
              }
            }
          }
        }
        return res.status(200).json(stryMutAct_9fa48("1326") ? {} : (stryCov_9fa48("1326"), {
          success: stryMutAct_9fa48("1327") ? false : (stryCov_9fa48("1327"), true),
          data: stryMutAct_9fa48("1328") ? {} : (stryCov_9fa48("1328"), {
            learnerCount: learners.length,
            spreadsheetId: sheetResult.spreadsheetId,
            updatedRange: sheetResult.updatedRange,
            updatedRows: sheetResult.updatedRows
          }),
          message: stryMutAct_9fa48("1329") ? `` : (stryCov_9fa48("1329"), `Successfully appended ${learners.length} learners to Google Sheet`)
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1330")) {
        {}
      } else {
        stryCov_9fa48("1330");
        console.error(stryMutAct_9fa48("1331") ? "" : (stryCov_9fa48("1331"), '❌ Error in email campaign:'), error);

        // Provide more specific error messages
        if (stryMutAct_9fa48("1333") ? false : stryMutAct_9fa48("1332") ? true : (stryCov_9fa48("1332", "1333"), error.message.includes(stryMutAct_9fa48("1334") ? "" : (stryCov_9fa48("1334"), 'GOOGLE_SHEET_ID')))) {
          if (stryMutAct_9fa48("1335")) {
            {}
          } else {
            stryCov_9fa48("1335");
            return res.status(500).json(stryMutAct_9fa48("1336") ? {} : (stryCov_9fa48("1336"), {
              success: stryMutAct_9fa48("1337") ? true : (stryCov_9fa48("1337"), false),
              message: stryMutAct_9fa48("1338") ? "" : (stryCov_9fa48("1338"), 'Google Sheet not configured. Please set GOOGLE_SHEET_ID in environment variables.')
            }));
          }
        }
        if (stryMutAct_9fa48("1340") ? false : stryMutAct_9fa48("1339") ? true : (stryCov_9fa48("1339", "1340"), error.message.includes(stryMutAct_9fa48("1341") ? "" : (stryCov_9fa48("1341"), 'credentials')))) {
          if (stryMutAct_9fa48("1342")) {
            {}
          } else {
            stryCov_9fa48("1342");
            return res.status(500).json(stryMutAct_9fa48("1343") ? {} : (stryCov_9fa48("1343"), {
              success: stryMutAct_9fa48("1344") ? true : (stryCov_9fa48("1344"), false),
              message: stryMutAct_9fa48("1345") ? "" : (stryCov_9fa48("1345"), 'Google Service Account not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON in environment variables.')
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
  if (stryMutAct_9fa48("1346")) {
    {}
  } else {
    stryCov_9fa48("1346");
    try {
      if (stryMutAct_9fa48("1347")) {
        {}
      } else {
        stryCov_9fa48("1347");
        const query = stryMutAct_9fa48("1348") ? `` : (stryCov_9fa48("1348"), `
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
        let csv = stryMutAct_9fa48("1349") ? "" : (stryCov_9fa48("1349"), 'Name,Email\n');
        learners.forEach(learner => {
          if (stryMutAct_9fa48("1350")) {
            {}
          } else {
            stryCov_9fa48("1350");
            csv += stryMutAct_9fa48("1351") ? `` : (stryCov_9fa48("1351"), `${learner.name},${learner.email}\n`);
          }
        });
        res.setHeader(stryMutAct_9fa48("1352") ? "" : (stryCov_9fa48("1352"), 'Content-Type'), stryMutAct_9fa48("1353") ? "" : (stryCov_9fa48("1353"), 'text/csv'));
        res.setHeader(stryMutAct_9fa48("1354") ? "" : (stryCov_9fa48("1354"), 'Content-Disposition'), stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), 'attachment; filename=learners.csv'));
        return res.status(200).send(csv);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1356")) {
        {}
      } else {
        stryCov_9fa48("1356");
        console.error(stryMutAct_9fa48("1357") ? "" : (stryCov_9fa48("1357"), 'Error exporting learners:'), error);
        next(error);
      }
    }
  }
};
export default stryMutAct_9fa48("1358") ? {} : (stryCov_9fa48("1358"), {
  getLearnersForCampaign,
  triggerEmailCampaign,
  exportLearnersCSV
});