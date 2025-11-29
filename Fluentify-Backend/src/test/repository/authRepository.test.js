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
      const result1 = await repo.findLearnerByEmail('  A@MAIL.COM  ');
      expect(result1).toEqual({ id: 1, email: 'a@mail.com', has_preferences: false });
      const [sql1, params1] = queryMock.mock.calls[0];
      expect(sql1).toContain('SELECT l.*,');
      expect(sql1).toContain('FROM learners l');
      expect(sql1).toContain('WHERE LOWER(l.email) = LOWER($1)');
      // email should be lowercased and trimmed
      expect(params1).toEqual(['a@mail.com']);
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findLearnerByEmail('x@mail.com')).toBeNull();
      // branch where email is falsy (no normalization)
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.findLearnerByEmail(null)).toBeNull();
    });
    it('findAdminByEmail normalizes and returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 9, email: 'a@mail.com' } ] });
      const result1 = await repo.findAdminByEmail('  A@MAIL.COM  ');
      expect(result1).toEqual({ id: 9, email: 'a@mail.com' });
      const [sql1, params1] = queryMock.mock.calls[0];
      expect(sql1).toBe('SELECT * FROM admins WHERE LOWER(email) = LOWER($1)');
      expect(params1).toEqual(['a@mail.com']);
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

      // verify SQL strings and parameters for learner/admin by id
      const [sqlLearner, paramsLearner] = queryMock.mock.calls[0];
      expect(sqlLearner).toBe('SELECT * FROM learners WHERE id = $1');
      expect(paramsLearner).toEqual([2]);
      const [sqlAdmin, paramsAdmin] = queryMock.mock.calls[2];
      expect(sqlAdmin).toBe('SELECT * FROM admins WHERE id = $1');
      expect(paramsAdmin).toEqual([3]);
    });
  });

  describe('create accounts', () => {
    it('createLearner lowercases email', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, email: 'a@mail.com' } ] });
      const r = await repo.createLearner('N', '  A@MAIL.COM  ', 'h');
      expect(r).toEqual({ id: 1, email: 'a@mail.com' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO learners');
      expect(sql).toContain('(name, email, password_hash, created_at, updated_at)');
      expect(sql).toContain('VALUES ($1, $2, $3, NOW(), NOW())');
      expect(params).toEqual(['N', 'a@mail.com', 'h']);
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
      const r = await repo.createAdmin('N', '  A@MAIL.COM  ', 'h');
      expect(r.email).toBe('a@mail.com');
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO admins');
      expect(sql).toContain('(name, email, password_hash, created_at, updated_at)');
      expect(sql).toContain('RETURNING *');
      expect(params).toEqual(['N', 'a@mail.com', 'h']);
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
      const baseDate = new Date('2025-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(baseDate);
      // store
      queryMock.mockResolvedValueOnce({ rows: [ { id: 11, email: 'e@mail.com' } ] });
      const stored = await repo.storeOTP('e@mail.com', '123456', 'signup', 'learner');
      expect(stored.id).toBe(11);
      const [sqlStore, paramsStore] = queryMock.mock.calls[0];
      expect(sqlStore).toContain('INSERT INTO otp_codes (email, otp_code, otp_type, user_type, expires_at, created_at)');
      expect(sqlStore).toContain('VALUES (LOWER($1), $2, $3, $4, $5, NOW())');
      expect(paramsStore[0]).toBe('e@mail.com');
      expect(paramsStore[1]).toBe('123456');
      expect(paramsStore[2]).toBe('signup');
      expect(paramsStore[3]).toBe('learner');
      expect(paramsStore[4]).toEqual(new Date(baseDate.getTime() + 2 * 60 * 1000));
      // getLatest
      queryMock.mockResolvedValueOnce({ rows: [ { id: 11, created_at: new Date().toISOString() } ] });
      expect(await repo.getLatestOTP('e@mail.com', 'signup', 'learner')).toBeTruthy();
      const [sqlLatest, paramsLatest] = queryMock.mock.calls[1];
      expect(sqlLatest).toContain('SELECT id, created_at FROM otp_codes');
      expect(sqlLatest).toContain('WHERE LOWER(email) = LOWER($1)');
      expect(sqlLatest).toContain('AND otp_type = $2');
      expect(sqlLatest).toContain('AND user_type = $3');
      expect(sqlLatest).toContain('ORDER BY created_at DESC');
      expect(sqlLatest).toContain('LIMIT 1');
      expect(paramsLatest).toEqual(['e@mail.com', 'signup', 'learner']);
      // verify
      queryMock.mockResolvedValueOnce({ rows: [ { id: 11 } ] });
      expect(await repo.verifyOTP('e@mail.com', '123456', 'signup', 'learner')).toEqual({ id: 11 });
      const [sqlVerify, paramsVerify] = queryMock.mock.calls[2];
      expect(sqlVerify).toContain('SELECT * FROM otp_codes');
      expect(sqlVerify).toContain('WHERE LOWER(email) = LOWER($1)');
      expect(sqlVerify).toContain('AND otp_code = $2');
      expect(sqlVerify).toContain('AND otp_type = $3');
      expect(sqlVerify).toContain('AND user_type = $4');
      expect(sqlVerify).toContain('AND is_used = false');
      expect(sqlVerify).toContain('AND expires_at > NOW()');
      expect(sqlVerify).toContain('ORDER BY created_at DESC');
      expect(sqlVerify).toContain('LIMIT 1');
      expect(paramsVerify).toEqual(['e@mail.com', '123456', 'signup', 'learner']);
      // mark used
      queryMock.mockResolvedValueOnce({});
      await repo.markOTPAsUsed(11);
      expect(queryMock).toHaveBeenLastCalledWith('UPDATE otp_codes SET is_used = true WHERE id = $1', [11]);
      // delete by email
      queryMock.mockResolvedValueOnce({});
      await repo.deleteOTPsByEmail('e@mail.com', 'signup', 'learner');
      const [sqlDelete, lastParams] = queryMock.mock.calls.at(-1);
      expect(sqlDelete).toBe('DELETE FROM otp_codes WHERE LOWER(email) = LOWER($1) AND otp_type = $2 AND user_type = $3');
      expect(lastParams).toEqual(['e@mail.com', 'signup', 'learner']);

      jest.useRealTimers();
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
      const learner = await repo.markLearnerEmailVerified('  A@MAIL.COM  ');
      expect(learner.is_email_verified).toBe(true);
      const [sqlLearner, paramsLearner] = queryMock.mock.calls[0];
      expect(sqlLearner).toContain('UPDATE learners');
      expect(sqlLearner).toContain('SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW()');
      expect(sqlLearner).toContain('WHERE LOWER(email) = LOWER($1)');
      expect(sqlLearner).toContain('RETURNING *');
      expect(paramsLearner).toEqual(['a@mail.com']);
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, is_email_verified: true } ] });
      const admin = await repo.markAdminEmailVerified('  A@MAIL.COM  ');
      expect(admin.is_email_verified).toBe(true);
      const [sqlAdmin, paramsAdmin] = queryMock.mock.calls[1];
      expect(sqlAdmin).toContain('UPDATE admins');
      expect(sqlAdmin).toContain('SET is_email_verified = true, email_verified_at = NOW(), updated_at = NOW()');
      expect(sqlAdmin).toContain('WHERE LOWER(email) = LOWER($1)');
      expect(sqlAdmin).toContain('RETURNING *');
      expect(paramsAdmin).toEqual(['a@mail.com']);
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
      const learner = await repo.updateLearnerPassword('  A@MAIL.COM  ', 'h');
      expect(learner).toEqual({ id: 1 });
      const [sqlLearner, paramsLearner] = queryMock.mock.calls[0];
      expect(sqlLearner).toContain('UPDATE learners');
      expect(sqlLearner).toContain('SET password_hash = $1, updated_at = NOW()');
      expect(sqlLearner).toContain('WHERE LOWER(email) = LOWER($2)');
      expect(sqlLearner).toContain('RETURNING *');
      expect(paramsLearner).toEqual(['h', 'a@mail.com']);
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2 } ] });
      const admin = await repo.updateAdminPassword('  A@MAIL.COM  ', 'h');
      expect(admin).toEqual({ id: 2 });
      const [sqlAdmin, paramsAdmin] = queryMock.mock.calls[1];
      expect(sqlAdmin).toContain('UPDATE admins');
      expect(sqlAdmin).toContain('SET password_hash = $1, updated_at = NOW()');
      expect(sqlAdmin).toContain('WHERE LOWER(email) = LOWER($2)');
      expect(sqlAdmin).toContain('RETURNING *');
      expect(paramsAdmin).toEqual(['h', 'a@mail.com']);
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

      const [sqlLearner, paramsLearner] = queryMock.mock.calls[0];
      expect(sqlLearner).toContain('SELECT id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at');
      expect(sqlLearner).toContain('FROM learners');
      expect(sqlLearner).toContain('WHERE id = $1');
      expect(paramsLearner).toEqual([1]);
      const [sqlAdmin, paramsAdmin] = queryMock.mock.calls[2];
      expect(sqlAdmin).toContain('SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at');
      expect(sqlAdmin).toContain('FROM admins');
      expect(sqlAdmin).toContain('WHERE id = $1');
      expect(paramsAdmin).toEqual([2]);
    });

    it('updateLearnerProfile builds dynamic query and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, name: 'New', contest_name: 'C' } ] });
      const r = await repo.updateLearnerProfile(1, { name: 'New', contest_name: 'C' });
      expect(r).toEqual({ id: 1, name: 'New', contest_name: 'C' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE learners');
      expect(sql).toContain('SET name = $1, contest_name = $2, updated_at = NOW()');
      expect(sql).toContain('WHERE id = $3');
      expect(sql).toContain('RETURNING id, name, email, contest_name, created_at, updated_at, is_email_verified, email_verified_at');
      expect(params).toEqual(['New', 'C', 1]);
    });

    it('updateLearnerProfile with only name builds correct query', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, name: 'OnlyName' } ] });
      const r = await repo.updateLearnerProfile(1, { name: 'OnlyName' });
      expect(r).toEqual({ id: 1, name: 'OnlyName' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE learners');
      expect(sql).toContain('SET name = $1, updated_at = NOW()');
      expect(sql).toContain('WHERE id = $2');
      expect(params).toEqual(['OnlyName', 1]);
    });

    it('updateLearnerProfile with only contest_name builds correct query', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, contest_name: 'OnlyContest' } ] });
      const r = await repo.updateLearnerProfile(1, { contest_name: 'OnlyContest' });
      expect(r).toEqual({ id: 1, contest_name: 'OnlyContest' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE learners');
      expect(sql).toContain('SET contest_name = $1, updated_at = NOW()');
      expect(sql).toContain('WHERE id = $2');
      expect(params).toEqual(['OnlyContest', 1]);
    });

    it('updateLearnerProfile with no fields returns current profile', async () => {
      const getProfileSpy = jest.spyOn(repo, 'getFullLearnerProfile').mockResolvedValue({ id: 1 });
      const r = await repo.updateLearnerProfile(1, {});
      expect(r).toEqual({ id: 1 });
      expect(getProfileSpy).toHaveBeenCalledWith(1);
      // When there are no fields to update, dynamic UPDATE should not be executed
      expect(queryMock).not.toHaveBeenCalled();
      getProfileSpy.mockRestore();
    });

    it('updateAdminProfile returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, name: 'Admin' } ] });
      const r = await repo.updateAdminProfile(2, 'Admin');
      expect(r).toEqual({ id: 2, name: 'Admin' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE admins');
      expect(sql).toContain('SET name = $1, updated_at = NOW()');
      expect(sql).toContain('WHERE id = $2');
      expect(sql).toContain('RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at');
      expect(params).toEqual(['Admin', 2]);
    });
  });
});
