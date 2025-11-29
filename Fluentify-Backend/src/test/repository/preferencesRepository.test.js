import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/preferencesRepository.js')).default;

describe('preferencesRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryMock.mockReset();
  });

  it('findByLearnerId returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const res = await repo.findByLearnerId(7);
    expect(queryMock).toHaveBeenCalledWith('SELECT * FROM learner_preferences WHERE learner_id = $1', [7]);
    expect(res).toEqual([{ id: 1 }]);
  });

  it('createPreferences inserts row', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.createPreferences(7, 'English', '3 months');
    expect(queryMock).toHaveBeenCalledWith(
      'INSERT INTO learner_preferences (learner_id, language, expected_duration) VALUES ($1, $2, $3)',
      [7, 'English', '3 months']
    );
  });

  it('updatePreferences updates row', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updatePreferences(7, 'French', '6 months');
    expect(queryMock).toHaveBeenCalledWith(
      'UPDATE learner_preferences SET language = $2, expected_duration = $3, updated_at = NOW() WHERE learner_id = $1',
      [7, 'French', '6 months']
    );
  });

  it('deletePreferences deletes rows', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.deletePreferences(7);
    expect(queryMock).toHaveBeenCalledWith(
      'DELETE FROM learner_preferences WHERE learner_id = $1',
      [7]
    );
  });

  it('preferencesExist returns boolean flag', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ exists: true }] });
    const first = await repo.preferencesExist(7);
    expect(first).toBe(true);
    const [sql1, params1] = queryMock.mock.calls[0];
    expect(sql1).toBe('SELECT EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = $1) as exists');
    expect(params1).toEqual([7]);
    queryMock.mockResolvedValueOnce({ rows: [{ exists: false }] });
    const second = await repo.preferencesExist(7);
    expect(second).toBe(false);
    const [sql2, params2] = queryMock.mock.calls[1];
    expect(sql2).toBe('SELECT EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = $1) as exists');
    expect(params2).toEqual([7]);
  });
});
