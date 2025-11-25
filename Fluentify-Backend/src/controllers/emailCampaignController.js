import db from '../config/db.js';
import googleSheetsService from '../services/googleSheetsService.js';

/**
 * Get all learners for email campaign
 * Returns name and email of all learners
 */
export const getLearnersForCampaign = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        name,
        email,
        created_at
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `;

    const result = await db.query(query);

    return res.status(200).json({
      success: true,
      data: {
        learners: result.rows,
        count: result.rows.length
      },
      message: 'Learners fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching learners:', error);
    next(error);
  }
};

/**
 * Append learners to Google Sheet and trigger N8N workflow
 * Appends learner data to Google Sheet, then triggers N8N webhook
 */
export const triggerEmailCampaign = async (req, res, next) => {
  try {
    // Get all learners
    const query = `
      SELECT 
        name,
        email,
        created_at
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `;

    const result = await db.query(query);
    const learners = result.rows;

    if (learners.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No learners found to add to Google Sheet'
      });
    }

    console.log(`📊 Appending ${learners.length} learners to Google Sheet`);

    // Append learners to Google Sheet
    const sheetResult = await googleSheetsService.appendLearnersToSheet(learners);

    console.log('✅ Learners appended to Google Sheet successfully');

    // Trigger N8N webhook (without passing data)
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (webhookUrl) {
      try {
        console.log('🔔 Triggering N8N workflow...');
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'email_campaign_triggered',
            timestamp: new Date().toISOString(),
            learnerCount: learners.length,
            source: 'Fluentify Admin'
          })
        });

        if (response.ok) {
          console.log('✅ N8N workflow triggered successfully');
        } else {
          console.warn('⚠️ N8N webhook call failed, but data was added to sheet');
        }
      } catch (webhookError) {
        console.warn('⚠️ N8N webhook error (data still added to sheet):', webhookError.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        learnerCount: learners.length,
        spreadsheetId: sheetResult.spreadsheetId,
        updatedRange: sheetResult.updatedRange,
        updatedRows: sheetResult.updatedRows
      },
      message: `Successfully appended ${learners.length} learners to Google Sheet`
    });

  } catch (error) {
    console.error('❌ Error in email campaign:', error);
    
    // Provide more specific error messages
    if (error.message.includes('GOOGLE_SHEET_ID')) {
      return res.status(500).json({
        success: false,
        message: 'Google Sheet not configured. Please set GOOGLE_SHEET_ID in environment variables.'
      });
    }
    
    if (error.message.includes('credentials')) {
      return res.status(500).json({
        success: false,
        message: 'Google Service Account not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON in environment variables.'
      });
    }
    
    next(error);
  }
};

/**
 * Get learners in Google Sheets format (CSV)
 */
export const exportLearnersCSV = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        name,
        email
      FROM learners
      WHERE email IS NOT NULL
      ORDER BY created_at DESC
    `;

    const result = await db.query(query);
    const learners = result.rows;

    // Create CSV content
    let csv = 'Name,Email\n';
    learners.forEach(learner => {
      csv += `${learner.name},${learner.email}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=learners.csv');
    
    return res.status(200).send(csv);

  } catch (error) {
    console.error('Error exporting learners:', error);
    next(error);
  }
};

export default {
  getLearnersForCampaign,
  triggerEmailCampaign,
  exportLearnersCSV
};
