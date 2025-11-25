import { google } from 'googleapis';

/**
 * Google Sheets Service
 * Handles appending learner data to Google Sheets
 */

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.auth = null;
  }

  /**
   * Initialize Google Sheets API with service account credentials
   */
  async initialize() {
    try {
      // Parse the service account JSON from environment variable
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');
      
      if (!credentials.client_email || !credentials.private_key) {
        throw new Error('Invalid Google Service Account credentials');
      }

      // Create JWT auth client
      this.auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      // Initialize Sheets API
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      console.log('✅ Google Sheets API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets API:', error.message);
      throw error;
    }
  }

  /**
   * Append learner data to Google Sheet
   * @param {Array} learners - Array of learner objects with name and email
   * @returns {Promise<Object>} - Result of the append operation
   */
  async appendLearnersToSheet(learners) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:B'; // Default range

      if (!spreadsheetId) {
        throw new Error('GOOGLE_SHEET_ID not configured in environment variables');
      }

      // Prepare data rows (name, email)
      const values = learners.map(learner => [
        learner.name || '',
        learner.email || ''
      ]);

      // Append data to sheet
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values
        }
      });

      console.log(`✅ Appended ${values.length} learners to Google Sheet`);
      
      return {
        success: true,
        updatedRows: response.data.updates.updatedRows,
        updatedRange: response.data.updates.updatedRange,
        spreadsheetId
      };
    } catch (error) {
      console.error('❌ Error appending to Google Sheet:', error.message);
      throw error;
    }
  }

  /**
   * Clear existing data and write fresh learner data
   * @param {Array} learners - Array of learner objects
   * @returns {Promise<Object>} - Result of the operation
   */
  async replaceLearnersInSheet(learners) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:B';

      if (!spreadsheetId) {
        throw new Error('GOOGLE_SHEET_ID not configured in environment variables');
      }

      // Clear existing data first
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId,
        range
      });

      // Prepare data with headers
      const values = [
        ['Name', 'Email'], // Header row
        ...learners.map(learner => [
          learner.name || '',
          learner.email || ''
        ])
      ];

      // Write new data
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values
        }
      });

      console.log(`✅ Replaced data with ${learners.length} learners in Google Sheet`);
      
      return {
        success: true,
        updatedRows: response.data.updatedRows,
        updatedRange: response.data.updatedRange,
        spreadsheetId
      };
    } catch (error) {
      console.error('❌ Error replacing data in Google Sheet:', error.message);
      throw error;
    }
  }

  /**
   * Get current data from Google Sheet
   * @returns {Promise<Array>} - Current sheet data
   */
  async getSheetData() {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:B';

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });

      return response.data.values || [];
    } catch (error) {
      console.error('❌ Error reading Google Sheet:', error.message);
      throw error;
    }
  }
}

// Export singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
