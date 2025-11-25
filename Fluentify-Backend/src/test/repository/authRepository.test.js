import { jest } from '@jest/globals';

// Mock db module
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/authRepository.js')).default;

describe('authRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('find by email/id', () => {
    it('findLearnerByEmail normalizes and returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, email: 'a@mail.com', has_preferences: false } ] });
      expect(await repo.findLearnerByEmail('A@MAIL.COM')).toEqual({ id: 1, email: 'a@mail.com', has_preferences: false });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findLearnerByEmail('x@mail.com')).toBeNull();
      // branch where email is falsy (no normalization)
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findLearnerByEmail(null)).toBeNull();
    });
    it('findAdminByEmail normalizes and returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 9, email: 'a@mail.com' } ] });
      expect(await repo.findAdminByEmail('A@MAIL.COM')).toEqual({ id: 9, email: 'a@mail.com' });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findAdminByEmail('x@mail.com')).toBeNull();
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findAdminByEmail(null)).toBeNull();
    });
    it('find by id returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2 } ] });
      expect(await repo.findLearnerById(2)).toEqual({ id: 2 });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findLearnerById(2)).toBeNull();
      queryMock.mockResolvedValueOnce({ rows: [ { id: 3 } ] });
      expect(await repo.findAdminById(3)).toEqual({ id: 3 });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findAdminById(3)).toBeNull();
    });
  });

  describe('create accounts', () => {
    it('createLearner lowercases email', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, email: 'a@mail.com' } ] });
      const r = await repo.createLearner('N', 'A@MAIL.COM', 'h');
      expect(r).toEqual({ id: 1, email: 'a@mail.com' });
      expect(queryMock.mock.calls[0][1][1]).toBe('a@mail.com');
    });
    it('createLearner handles falsy email without normalization', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, email: null } ] });
      const r = await repo.createLearner('N', null, 'h');
      expect(r).toEqual({ id: 2, email: null });
      const params = queryMock.mock.calls[0][1];
      expect(params[1]).toBeNull();
    });
    it('createAdmin lowercases email', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, email: 'a@mail.com' } ] });
      const r = await repo.createAdmin('N', 'A@MAIL.COM', 'h');
      expect(r.email).toBe('a@mail.com');
    });
    it('createAdmin handles falsy email without normalization', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 3, email: null } ] });
      const r = await repo.createAdmin('N', null, 'h');
      expect(r).toEqual({ id: 3, email: null });
      const params = queryMock.mock.calls[0][1];
      expect(params[1]).toBeNull();
    });
  });

  describe('transactions', () => {
    it('begin/commit/rollback call correct queries', async () => {
      queryMock.mockResolvedValue({});
      await repo.beginTransaction();
      await repo.commitTransaction();
      await repo.rollbackTransaction();
      expect(queryMock).toHaveBeenCalledWith('BEGIN');
      expect(queryMock).toHaveBeenCalledWith('COMMIT');
      expect(queryMock).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('OTP operations', () => {
    it('store/getLatest/verify/mark/delete OTPs', async () => {
      // store
      queryMock.mockResolvedValueOnce({ rows: [ { id: 11, email: 'e@mail.com' } ] });
      const stored = await repo.storeOTP('e@mail.com', '123456', 'signup', 'learner');
      expect(stored.id).toBe(11);
      // getLatest
      queryMock.mockResolvedValueOnce({ rows: [ { id: 11, created_at: new Date().toISOString() } ] });
      expect(await repo.getLatestOTP('e@mail.com', 'signup', 'learner')).toBeTruthy();
      // verify
      queryMock.mockResolvedValueOnce({ rows: [ { id: 11 } ] });
      expect(await repo.verifyOTP('e@mail.com', '123456', 'signup', 'learner')).toEqual({ id: 11 });
      // mark used
      queryMock.mockResolvedValueOnce({});
      await repo.markOTPAsUsed(11);
      expect(queryMock).toHaveBeenLastCalledWith('UPDATE otp_codes SET is_used = true WHERE id = $1', [11]);
      // delete by email
      queryMock.mockResolvedValueOnce({});
      await repo.deleteOTPsByEmail('e@mail.com', 'signup', 'learner');
      const lastParams = queryMock.mock.calls.at(-1)[1];
      expect(lastParams).toEqual(['e@mail.com', 'signup', 'learner']);
    });

    it('getLatestOTP and verifyOTP return null when no rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getLatestOTP('e@mail.com', 'signup', 'learner')).toBeNull();
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.verifyOTP('e@mail.com', '123456', 'signup', 'learner')).toBeNull();
    });
  });

  describe('verify flags and passwords', () => {
    it('mark email verified for learner/admin returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, is_email_verified: true } ] });
      expect((await repo.markLearnerEmailVerified('A@MAIL.COM')).is_email_verified).toBe(true);
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, is_email_verified: true } ] });
      expect((await repo.markAdminEmailVerified('A@MAIL.COM')).is_email_verified).toBe(true);
    });
    it('mark email verified handles falsy email without normalization', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 3, is_email_verified: true } ] });
      const learner = await repo.markLearnerEmailVerified(null);
      expect(learner).toEqual({ id: 3, is_email_verified: true });

      queryMock.mockResolvedValueOnce({ rows: [ { id: 4, is_email_verified: true } ] });
      const admin = await repo.markAdminEmailVerified(null);
      expect(admin).toEqual({ id: 4, is_email_verified: true });
    });
    it('update passwords for learner/admin return row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1 } ] });
      expect(await repo.updateLearnerPassword('A@MAIL.COM', 'h')).toEqual({ id: 1 });
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2 } ] });
      expect(await repo.updateAdminPassword('A@MAIL.COM', 'h')).toEqual({ id: 2 });
    });
    it('update passwords handle falsy email without normalization', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 5 } ] });
      expect(await repo.updateLearnerPassword(null, 'h')).toEqual({ id: 5 });
      queryMock.mockResolvedValueOnce({ rows: [ { id: 6 } ] });
      expect(await repo.updateAdminPassword(null, 'h')).toEqual({ id: 6 });
    });
  });

  describe('profiles', () => {
    it('getFull profile learners/admin returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1 } ] });
      expect(await repo.getFullLearnerProfile(1)).toEqual({ id: 1 });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getFullLearnerProfile(1)).toBeNull();
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2 } ] });
      expect(await repo.getFullAdminProfile(2)).toEqual({ id: 2 });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getFullAdminProfile(2)).toBeNull();
    });

    it('updateLearnerProfile builds dynamic query and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, name: 'New', contest_name: 'C' } ] });
      const r = await repo.updateLearnerProfile(1, { name: 'New', contest_name: 'C' });
      expect(r).toEqual({ id: 1, name: 'New', contest_name: 'C' });
    });

    it('updateLearnerProfile with no fields returns current profile', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1 } ] });
      const r = await repo.updateLearnerProfile(1, {});
      expect(r).toEqual({ id: 1 });
    });

    it('updateAdminProfile returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, name: 'Admin' } ] });
      expect(await repo.updateAdminProfile(2, 'Admin')).toEqual({ id: 2, name: 'Admin' });
    });
  });
});
