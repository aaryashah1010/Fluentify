import { jest } from '@jest/globals';

// Mocks for db and googleSheetsService
const mockDb = {
  query: jest.fn(),
};

const mockGoogleSheetsService = {
  appendLearnersToSheet: jest.fn(),
};

await jest.unstable_mockModule('../../config/db.js', () => ({ default: mockDb }));
await jest.unstable_mockModule('../../services/googleSheetsService.js', () => ({ default: mockGoogleSheetsService }));

const {
  getLearnersForCampaign,
  triggerEmailCampaign,
  exportLearnersCSV,
} = await import('../../controllers/emailCampaignController.js');

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.headers = {};
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  res.setHeader = jest.fn().mockImplementation((key, value) => {
    res.headers[key] = value;
    return res;
  });
  res.send = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() {
  return jest.fn();
}

describe('emailCampaignController', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLearnersForCampaign', () => {
    it('returns 200 with learners and count and uses correct SQL', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01' },
        { name: 'Bob', email: 'bob@example.com', created_at: '2024-01-02' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });

      const req = {};
      const res = createRes();
      const next = createNext();

      await getLearnersForCampaign(req, res, next);

      // ensure SQL contains the important clauses (guards against query -> '')
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('FROM learners'));
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('WHERE email IS NOT NULL'));
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY created_at DESC'));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          learners: rows,
          count: rows.length,
        },
        message: 'Learners fetched successfully',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next and logs the error', async () => {
      const err = new Error('db fail');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await getLearnersForCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching learners:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });

  describe('triggerEmailCampaign', () => {
    it('returns 400 when no learners are found', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({
        success: false,
        message: 'No learners found to add to Google Sheet',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('appends learners and triggers webhook successfully and logs steps', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });
      mockGoogleSheetsService.appendLearnersToSheet.mockResolvedValueOnce({
        spreadsheetId: 'sheet-1',
        updatedRange: 'Sheet1!A1:B2',
        updatedRows: 1,
      });

      process.env.N8N_WEBHOOK_URL = 'https://example.com/webhook';
      global.fetch.mockResolvedValueOnce({ ok: true });

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(mockDb.query).toHaveBeenCalledTimes(1);
      // SQL sanity checks
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('FROM learners'));
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY created_at DESC'));

      expect(mockGoogleSheetsService.appendLearnersToSheet).toHaveBeenCalledWith(rows);

      // Check fetch called with webhook and body contains expected data strings
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        }),
      );

      // Validate the body contains action, source and learnerCount
      const fetchCallBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchCallBody.action).toBe('email_campaign_triggered');
      expect(fetchCallBody.source).toBe('Fluentify Admin');
      expect(fetchCallBody.learnerCount).toBe(1);
      expect(typeof fetchCallBody.timestamp).toBe('string');

      // Ensure the controller logged the main steps (guards against emptying log strings)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📊 Appending 1 learners to Google Sheet'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('✅ Learners appended to Google Sheet successfully'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('🔔 Triggering N8N workflow...'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('✅ N8N workflow triggered successfully'));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          learnerCount: 1,
          spreadsheetId: 'sheet-1',
          updatedRange: 'Sheet1!A1:B2',
          updatedRows: 1,
        },
        message: 'Successfully appended 1 learners to Google Sheet',
      });
      expect(next).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('handles missing webhook URL and still succeeds (no fetch call)', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });
      mockGoogleSheetsService.appendLearnersToSheet.mockResolvedValueOnce({
        spreadsheetId: 'sheet-2',
        updatedRange: 'Sheet1!A1:B2',
        updatedRows: 1,
      });

      delete process.env.N8N_WEBHOOK_URL;

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.spreadsheetId).toBe('sheet-2');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📊 Appending 1 learners to Google Sheet'));
      consoleLogSpy.mockRestore();
    });

    it('returns specific 500 when GOOGLE_SHEET_ID is missing (and logs error)', async () => {
      const err = new Error('GOOGLE_SHEET_ID not configured');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error in email campaign:'), err);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Google Sheet not configured. Please set GOOGLE_SHEET_ID in environment variables.',
      });
      expect(next).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('returns specific 500 when credentials are missing (and logs error)', async () => {
      const err = new Error('credentials missing');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error in email campaign:'), err);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Google Service Account not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON in environment variables.',
      });
      expect(next).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('logs warning when webhook responds with non-ok status', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });
      mockGoogleSheetsService.appendLearnersToSheet.mockResolvedValueOnce({
        spreadsheetId: 'sheet-3',
        updatedRange: 'Sheet1!A1:B2',
        updatedRows: 1,
      });

      process.env.N8N_WEBHOOK_URL = 'https://example.com/webhook';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      global.fetch.mockResolvedValueOnce({ ok: false });

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️ N8N webhook call failed, but data was added to sheet'));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('logs warning when webhook call throws but still returns success', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });
      mockGoogleSheetsService.appendLearnersToSheet.mockResolvedValueOnce({
        spreadsheetId: 'sheet-4',
        updatedRange: 'Sheet1!A1:B2',
        updatedRows: 1,
      });

      process.env.N8N_WEBHOOK_URL = 'https://example.com/webhook';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      global.fetch.mockRejectedValueOnce(new Error('network fail'));

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️ N8N webhook error (data still added to sheet):'), expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('forwards unexpected errors via next and logs the error', async () => {
      const err = new Error('other error');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error in email campaign:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });

  describe('exportLearnersCSV', () => {
    it('returns CSV with learners and sets headers and uses correct SQL', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });

      const req = {};
      const res = createRes();
      const next = createNext();

      await exportLearnersCSV(req, res, next);

      // ensure SQL contains the important clauses
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('FROM learners'));
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY created_at DESC'));

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=learners.csv');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toBe('Name,Email\nAlice,alice@example.com\nBob,bob@example.com\n');
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next and logs the error', async () => {
      const err = new Error('db error');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await exportLearnersCSV(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error exporting learners:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });
});
