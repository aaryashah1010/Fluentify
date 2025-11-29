import { jest } from '@jest/globals';

// Preserve original env
const ORIGINAL_ENV = { ...process.env };

// Mocks for internal sheets client used by googleSheetsService
const mockAppend = jest.fn();
const mockClear = jest.fn();
const mockUpdate = jest.fn();
const mockGet = jest.fn();

const mockSheetsInstance = {
  spreadsheets: {
    values: {
      append: mockAppend,
      clear: mockClear,
      update: mockUpdate,
      get: mockGet,
    },
  },
};


await jest.unstable_mockModule('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn(function MockJWT(clientEmail, keyFile, privateKey, scopes) {
        this.clientEmail = clientEmail;
        this.keyFile = keyFile;
        this.privateKey = privateKey;
        this.scopes = scopes;
      }),
    },
    sheets: jest.fn(() => mockSheetsInstance),
  },
}));

const { google } = await import('googleapis');
const googleSheetsService = (await import('../../services/googleSheetsService.js')).default;

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('googleSheetsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('starts with null sheets and auth from constructor', () => {
    expect(googleSheetsService.sheets).toBeNull();
    expect(googleSheetsService.auth).toBeNull();
  });

  describe('initialize', () => {
    it('initializes sheets client successfully with valid credentials', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
        client_email: 'test@service-account.iam.gserviceaccount.com',
        private_key: '-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----\n',
      });

      // Force re-initialize internal client
      googleSheetsService.sheets = null;

      const result = await googleSheetsService.initialize();

      expect(result).toBe(true);
      expect(googleSheetsService.sheets).toBeTruthy();
      expect(google.auth.JWT).toHaveBeenCalledWith(
        'test@service-account.iam.gserviceaccount.iam.gserviceaccount.com' ? 'test@service-account.iam.gserviceaccount.com' : 'test',
        null,
        '-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----\n',
        ['https://www.googleapis.com/auth/spreadsheets'],
      );
      const authInstance = google.auth.JWT.mock.results[0]?.value || googleSheetsService.auth;
      expect(google.sheets).toHaveBeenCalledWith({ version: 'v4', auth: authInstance });
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Google Sheets API initialized successfully');
    });

    it('throws error when credentials are invalid / missing', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({});

      googleSheetsService.sheets = null;

      await expect(googleSheetsService.initialize()).rejects.toThrow(
        'Invalid Google Service Account credentials',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to initialize Google Sheets API:', 'Invalid Google Service Account credentials');
    });

    it('requires both client_email and private_key in credentials', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({ client_email: 'only-email@svc.com' });
      googleSheetsService.sheets = null;

      await expect(googleSheetsService.initialize()).rejects.toThrow('Invalid Google Service Account credentials');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to initialize Google Sheets API:', 'Invalid Google Service Account credentials');
    });

    it('throws error when GOOGLE_SERVICE_ACCOUNT_JSON is not set (uses default {})', async () => {
      delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      googleSheetsService.sheets = null;

      await expect(googleSheetsService.initialize()).rejects.toThrow(
        'Invalid Google Service Account credentials',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to initialize Google Sheets API:', 'Invalid Google Service Account credentials');
    });
  });

  describe('appendLearnersToSheet', () => {
    const learners = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ];

    it('initializes sheets when not already set and uses default range', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
        client_email: 'test@service-account.iam.gserviceaccount.com',
        private_key: 'key',
      });
      delete process.env.GOOGLE_SHEET_RANGE; // trigger default 'Sheet1!A:B'
      process.env.GOOGLE_SHEET_ID = 'sheet-id-init-1';

      googleSheetsService.sheets = null;

      mockAppend.mockResolvedValueOnce({
        data: {
          updates: {
            updatedRows: 1,
            updatedRange: 'Sheet1!A2:B2',
          },
        },
      });

      const res = await googleSheetsService.appendLearnersToSheet([
        { name: 'Init', email: 'init@example.com' },
      ]);

      expect(res.success).toBe(true);
      expect(mockAppend).toHaveBeenCalledWith(
        expect.objectContaining({
          spreadsheetId: 'sheet-id-init-1',
          range: 'Sheet1!A:B',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
        }),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Appended 1 learners to Google Sheet');
    });

    it('initializes if needed and appends learners successfully', async () => {
      // Bypass real initialize by injecting mocked sheets client
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-123';
      process.env.GOOGLE_SHEET_RANGE = 'Sheet1!A:B';

      mockAppend.mockResolvedValueOnce({
        data: {
          updates: {
            updatedRows: 2,
            updatedRange: 'Sheet1!A2:B3',
          },
        },
      });

      const res = await googleSheetsService.appendLearnersToSheet(learners);

      expect(mockAppend).toHaveBeenCalledWith(
        expect.objectContaining({
          spreadsheetId: 'sheet-id-123',
          range: 'Sheet1!A:B',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [
              ['Alice', 'alice@example.com'],
              ['Bob', 'bob@example.com'],
            ],
          },
        }),
      );
      expect(res).toEqual({
        success: true,
        updatedRows: 2,
        updatedRange: 'Sheet1!A2:B3',
        spreadsheetId: 'sheet-id-123',
      });
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Appended 2 learners to Google Sheet');
    });

    it('throws when GOOGLE_SHEET_ID is missing', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      delete process.env.GOOGLE_SHEET_ID;

      await expect(googleSheetsService.appendLearnersToSheet(learners)).rejects.toThrow(
        'GOOGLE_SHEET_ID not configured in environment variables',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error appending to Google Sheet:', 'GOOGLE_SHEET_ID not configured in environment variables');
    });

    it('propagates error from sheets.append', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-123';

      mockAppend.mockRejectedValueOnce(new Error('append failed'));

      await expect(googleSheetsService.appendLearnersToSheet(learners)).rejects.toThrow(
        'append failed',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error appending to Google Sheet:', 'append failed');
    });

    it('maps missing learner name/email to empty strings', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-blank-1';
      process.env.GOOGLE_SHEET_RANGE = 'Sheet1!A:B';

      mockAppend.mockResolvedValueOnce({
        data: {
          updates: {
            updatedRows: 1,
            updatedRange: 'Sheet1!A2:B2',
          },
        },
      });

      await googleSheetsService.appendLearnersToSheet([
        {},
      ]);

      expect(mockAppend).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: {
            values: [['', '']],
          },
        }),
      );
    });
  });

  describe('replaceLearnersInSheet', () => {
    const learners = [
      { name: 'Carol', email: 'carol@example.com' },
    ];

    it('initializes sheets when not already set and uses default range', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
        client_email: 'test@service-account.iam.gserviceaccount.com',
        private_key: 'key',
      });
      delete process.env.GOOGLE_SHEET_RANGE; // trigger default 'Sheet1!A:B'
      process.env.GOOGLE_SHEET_ID = 'sheet-id-init-2';

      googleSheetsService.sheets = null;

      mockClear.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({
        data: {
          updatedRows: 1,
          updatedRange: 'Sheet1!A1:B2',
        },
      });

      const res = await googleSheetsService.replaceLearnersInSheet(learners);

      expect(mockClear).toHaveBeenCalledWith({
        spreadsheetId: 'sheet-id-init-2',
        range: 'Sheet1!A:B',
      });
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          spreadsheetId: 'sheet-id-init-2',
          range: 'Sheet1!A:B',
          valueInputOption: 'USER_ENTERED',
        }),
      );
      expect(res.success).toBe(true);
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Replaced data with 1 learners in Google Sheet');
    });

    it('clears and replaces learners successfully', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-456';
      process.env.GOOGLE_SHEET_RANGE = 'Sheet1!A:B';

      mockClear.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({
        data: {
          updatedRows: 2,
          updatedRange: 'Sheet1!A1:B2',
        },
      });

      const res = await googleSheetsService.replaceLearnersInSheet(learners);

      expect(mockClear).toHaveBeenCalledWith({
        spreadsheetId: 'sheet-id-456',
        range: 'Sheet1!A:B',
      });
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          spreadsheetId: 'sheet-id-456',
          range: 'Sheet1!A:B',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              ['Name', 'Email'],
              ['Carol', 'carol@example.com'],
            ],
          },
        }),
      );

      expect(res).toEqual({
        success: true,
        updatedRows: 2,
        updatedRange: 'Sheet1!A1:B2',
        spreadsheetId: 'sheet-id-456',
      });
    });

    it('throws when GOOGLE_SHEET_ID is missing', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
        client_email: 'test@service-account.iam.gserviceaccount.com',
        private_key: 'key',
      });
      delete process.env.GOOGLE_SHEET_ID;

      await expect(googleSheetsService.replaceLearnersInSheet(learners)).rejects.toThrow(
        'GOOGLE_SHEET_ID not configured in environment variables',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error replacing data in Google Sheet:', 'GOOGLE_SHEET_ID not configured in environment variables');
    });

    it('propagates error from clear or update', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-456';

      mockClear.mockRejectedValueOnce(new Error('clear failed'));

      await expect(googleSheetsService.replaceLearnersInSheet(learners)).rejects.toThrow(
        'clear failed',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error replacing data in Google Sheet:', 'clear failed');
    });

    it('maps missing learner name/email to empty strings in replace', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-blank-2';
      process.env.GOOGLE_SHEET_RANGE = 'Sheet1!A:B';

      mockClear.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({
        data: {
          updatedRows: 1,
          updatedRange: 'Sheet1!A1:B2',
        },
      });

      await googleSheetsService.replaceLearnersInSheet([
        {},
      ]);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: {
            values: [
              ['Name', 'Email'],
              ['', ''],
            ],
          },
        }),
      );
    });
  });

  describe('getSheetData', () => {
    it('returns sheet data values or empty array', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-789';

      mockGet.mockResolvedValueOnce({ data: { values: [['Name', 'Email']] } });

      const res = await googleSheetsService.getSheetData();
      expect(mockGet).toHaveBeenCalledWith({
        spreadsheetId: 'sheet-id-789',
        range: expect.any(String),
      });
      expect(res).toEqual([['Name', 'Email']]);

      mockGet.mockResolvedValueOnce({ data: {} });
      const res2 = await googleSheetsService.getSheetData();
      expect(res2).toEqual([]);
    });

    it('initializes sheets when not already set and uses default range', async () => {
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
        client_email: 'test@service-account.iam.gserviceaccount.com',
        private_key: 'key',
      });
      delete process.env.GOOGLE_SHEET_RANGE; // trigger default range
      process.env.GOOGLE_SHEET_ID = 'sheet-id-init-3';

      googleSheetsService.sheets = null;

      mockGet.mockResolvedValueOnce({ data: { values: [['Only', 'One']] } });

      const res = await googleSheetsService.getSheetData();
      expect(mockGet).toHaveBeenCalledWith({
        spreadsheetId: 'sheet-id-init-3',
        range: 'Sheet1!A:B',
      });
      expect(res).toEqual([['Only', 'One']]);
    });

    it('propagates error from get', async () => {
      googleSheetsService.sheets = mockSheetsInstance;
      process.env.GOOGLE_SHEET_ID = 'sheet-id-789';

      mockGet.mockRejectedValueOnce(new Error('get failed'));

      await expect(googleSheetsService.getSheetData()).rejects.toThrow('get failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error reading Google Sheet:', 'get failed');
    });
  });
});

afterAll(() => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});
