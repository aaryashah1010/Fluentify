import { jest } from '@jest/globals';

const mockRepo = {
  createPreferences: jest.fn(),
  findByLearnerId: jest.fn(),
  updatePreferences: jest.fn(),
  deletePreferences: jest.fn(),
};

await jest.unstable_mockModule('../../repositories/preferencesRepository.js', () => ({ default: mockRepo }));

// We don't need to spy on response helpers (ESM exports are read-only); just assert res.json was called
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

describe('preferencesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('savePreferences', () => {
    it('rejects non-learner role', async () => {
      const req = { user: { id: 1, role: 'admin' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.savePreferences(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('rejects missing fields', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en' } };
      const res = createRes();
      const next = createNext();
      await controller.savePreferences(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('creates preferences and returns createdResponse', async () => {
      mockRepo.createPreferences.mockResolvedValueOnce();
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();

      await controller.savePreferences(req, res, next);
      expect(mockRepo.createPreferences).toHaveBeenCalledWith(1, 'en', '3m');
      expect(res.json).toHaveBeenCalled();
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
    });
  });

  describe('getPreferences', () => {
    it('non-learner gets error', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const res = createRes();
      const next = createNext();
      await controller.getPreferences(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns listResponse with preferences', async () => {
      mockRepo.findByLearnerId.mockResolvedValueOnce([{ id: 1 }]);
      const req = { user: { id: 1, role: 'learner' } };
      const res = createRes();
      const next = createNext();
      await controller.getPreferences(req, res, next);
      expect(mockRepo.findByLearnerId).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updatePreferences', () => {
    it('non-learner rejected', async () => {
      const req = { user: { id: 1, role: 'admin' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.updatePreferences(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('missing fields rejected', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en' } };
      const res = createRes();
      const next = createNext();
      await controller.updatePreferences(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('updates preferences and returns updatedResponse', async () => {
      mockRepo.updatePreferences.mockResolvedValueOnce();
      const req = { user: { id: 1, role: 'learner' }, body: { language: 'en', expected_duration: '3m' } };
      const res = createRes();
      const next = createNext();
      await controller.updatePreferences(req, res, next);
      expect(mockRepo.updatePreferences).toHaveBeenCalledWith(1, 'en', '3m');
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deletePreferences', () => {
    it('non-learner rejected', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const res = createRes();
      const next = createNext();
      await controller.deletePreferences(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deletes preferences and returns deletedResponse', async () => {
      mockRepo.deletePreferences.mockResolvedValueOnce();
      const req = { user: { id: 1, role: 'learner' } };
      const res = createRes();
      const next = createNext();
      await controller.deletePreferences(req, res, next);
      expect(mockRepo.deletePreferences).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
