import { jest } from '@jest/globals';

const { successResponse, errorResponse, listResponse, createdResponse, updatedResponse, deletedResponse, authResponse } = await import('../../utils/response.js');

describe('utils/response', () => {
  it('successResponse returns shape and default message', () => {
    const res = successResponse({ a: 1 });
    expect(res.success).toBe(true);
    expect(res.message).toBe('Operation successful');
    expect(res.data).toEqual({ a: 1 });
    expect(typeof res.timestamp).toBe('string');
  });

  it('errorResponse returns shape and allows custom code', () => {
    const res = errorResponse('Bad', 40001);
    expect(res.success).toBe(false);
    expect(res.error).toEqual({ code: 40001, message: 'Bad' });
    expect(typeof res.timestamp).toBe('string');
  });

  it('errorResponse uses default code when not provided', () => {
    const res = errorResponse('Bad');
    expect(res.error.code).toBe(10000);
  });

  it('listResponse defaults meta.count and message', () => {
    const res = listResponse([1,2,3]);
    expect(res.success).toBe(true);
    expect(res.meta).toEqual({ count: 3 });
    expect(res.message).toBe('Data retrieved successfully');
  });

  it('createdResponse and updatedResponse include data and default messages', () => {
    const c = createdResponse({ id: 1 });
    expect(c.message).toBe('Resource created successfully');
    expect(c.data).toEqual({ id: 1 });
    const u = updatedResponse({ id: 1 });
    expect(u.message).toBe('Resource updated successfully');
    expect(u.data).toEqual({ id: 1 });
  });

  it('deletedResponse returns default message', () => {
    const d = deletedResponse();
    expect(d.success).toBe(true);
    expect(d.message).toBe('Resource deleted successfully');
  });

  it('authResponse wraps user and token and uses default message', () => {
    const a = authResponse({ user: { id: 1 }, token: 't' });
    expect(a.success).toBe(true);
    expect(a.data).toEqual({ user: { id: 1 }, token: 't' });
    expect(a.message).toBe('Authentication successful');
  });

  it('authResponse allows overriding message', () => {
    const a = authResponse({ user: { id: 2 }, token: 'tok' }, 'Logged in successfully');
    expect(a.success).toBe(true);
    expect(a.data).toEqual({ user: { id: 2 }, token: 'tok' });
    expect(a.message).toBe('Logged in successfully');
  });
});
