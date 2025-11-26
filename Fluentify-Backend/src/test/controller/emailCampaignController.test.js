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
    it('returns 200 with learners and count', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01' },
        { name: 'Bob', email: 'bob@example.com', created_at: '2024-01-02' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });

      const req = {};
      const res = createRes();
      const next = createNext();

      await getLearnersForCampaign(req, res, next);

      expect(mockDb.query).toHaveBeenCalledTimes(1);
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

    it('forwards errors via next', async () => {
      const err = new Error('db fail');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await getLearnersForCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
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

    it('appends learners and triggers webhook successfully', async () => {
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

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockGoogleSheetsService.appendLearnersToSheet).toHaveBeenCalledWith(rows);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
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
    });

    it('handles missing webhook URL and still succeeds', async () => {
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

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns specific 500 when GOOGLE_SHEET_ID is missing', async () => {
      const err = new Error('GOOGLE_SHEET_ID not configured');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Google Sheet not configured. Please set GOOGLE_SHEET_ID in environment variables.',
      });
      expect(next).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('returns specific 500 when credentials are missing', async () => {
      const err = new Error('credentials missing');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
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
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      global.fetch.mockResolvedValueOnce({ ok: false });

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
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
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      global.fetch.mockRejectedValueOnce(new Error('network fail'));

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('forwards unexpected errors via next', async () => {
      const err = new Error('other error');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await triggerEmailCampaign(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });

  describe('exportLearnersCSV', () => {
    it('returns CSV with learners and sets headers', async () => {
      const rows = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows });

      const req = {};
      const res = createRes();
      const next = createNext();

      await exportLearnersCSV(req, res, next);

      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=learners.csv');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toBe('Name,Email\nAlice,alice@example.com\nBob,bob@example.com\n');
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next', async () => {
      const err = new Error('db error');
      mockDb.query.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = {};
      const res = createRes();
      const next = createNext();

      await exportLearnersCSV(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });
});
