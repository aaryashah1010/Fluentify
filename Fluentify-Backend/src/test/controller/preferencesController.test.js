import { jest } from '@jest/globals';

const mockRepo = {
  createPreferences: jest.fn(),
  findByLearnerId: jest.fn(),
  updatePreferences: jest.fn(),
  deletePreferences: jest.fn(),
};

await jest.unstable_mockModule('../../repositories/preferencesRepository.js', () => ({ default: mockRepo }));

const { ERRORS } = await import('../../utils/error.js');
const controller = (await import('../../controllers/preferencesController.js')).default;

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() {
  return jest.fn();
}

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('preferencesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('savePreferences', () => {
    it('rejects non-learner role and logs error', async () => {
      const req = { user: { id: 1, role: 'admin' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.savePreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.LEARNER_ONLY_ROUTE);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving preferences:', ERRORS.LEARNER_ONLY_ROUTE);
    });

    it('rejects missing fields and logs error', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en' } };
      const res = createRes();
      const next = createNext();
      await controller.savePreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving preferences:', ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('creates preferences and returns createdResponse', async () => {
      mockRepo.createPreferences.mockResolvedValueOnce();
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();

      await controller.savePreferences(req, res, next);
      expect(mockRepo.createPreferences).toHaveBeenCalledWith(1, 'en', '3m');
      expect(res.body).toEqual(expect.objectContaining({
        success: true,
        message: 'Preferences saved successfully',
        data: { language: 'en', expected_duration: '3m' },
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards repository error via next (catch block)', async () => {
      const err = new Error('db');
      mockRepo.createPreferences.mockRejectedValueOnce(err);
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.savePreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving preferences:', err);
    });
  });

  describe('getPreferences', () => {
    it('non-learner gets error and logs', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const res = createRes();
      const next = createNext();
      await controller.getPreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.LEARNER_ONLY_ROUTE);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching preferences:', ERRORS.LEARNER_ONLY_ROUTE);
    });

    it('returns listResponse with preferences', async () => {
      mockRepo.findByLearnerId.mockResolvedValueOnce([{ id: 1 }]);
      const req = { user: { id: 1, role: 'learner' } };
      const res = createRes();
      const next = createNext();
      await controller.getPreferences(req, res, next);
      expect(mockRepo.findByLearnerId).toHaveBeenCalledWith(1);
      expect(res.body).toEqual(expect.objectContaining({
        success: true,
        message: 'Preferences retrieved successfully',
        data: [{ id: 1 }],
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('updatePreferences', () => {
    it('non-learner rejected and logs', async () => {
      const req = { user: { id: 1, role: 'admin' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.updatePreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.LEARNER_ONLY_ROUTE);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating preferences:', ERRORS.LEARNER_ONLY_ROUTE);
    });

    it('missing fields rejected and logs', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en' } };
      const res = createRes();
      const next = createNext();
      await controller.updatePreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating preferences:', ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('updates preferences and returns updatedResponse', async () => {
      mockRepo.updatePreferences.mockResolvedValueOnce();
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.updatePreferences(req, res, next);
      expect(mockRepo.updatePreferences).toHaveBeenCalledWith(1, 'en', '3m');
      expect(res.body).toEqual(expect.objectContaining({
        success: true,
        message: 'Preferences updated successfully',
        data: { language: 'en', expected_duration: '3m' },
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('deletePreferences', () => {
    it('non-learner rejected and logs', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const res = createRes();
      const next = createNext();
      await controller.deletePreferences(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.LEARNER_ONLY_ROUTE);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting preferences:', ERRORS.LEARNER_ONLY_ROUTE);
    });

    it('deletes preferences and returns deletedResponse', async () => {
      mockRepo.deletePreferences.mockResolvedValueOnce();
      const req = { user: { id: 1, role: 'learner' } };
      const res = createRes();
      const next = createNext();
      await controller.deletePreferences(req, res, next);
      expect(mockRepo.deletePreferences).toHaveBeenCalledWith(1);
      expect(res.body).toEqual(expect.objectContaining({
        success: true,
        message: 'Preferences deleted successfully',
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });
});
