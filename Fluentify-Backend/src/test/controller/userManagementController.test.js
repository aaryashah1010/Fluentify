import { jest } from '@jest/globals';

const mockService = {
  getUsersList: jest.fn(),
  findUsers: jest.fn(),
  getUserWithProgress: jest.fn(),
  updateUserData: jest.fn(),
  deleteUser: jest.fn(),
};

const emailServiceMock = {
  sendAdminProfileChangeNotification: jest.fn(),
};

await jest.unstable_mockModule('../../services/userManagementService.js', () => ({ default: mockService }));
await jest.unstable_mockModule('../../utils/emailService.js', () => ({ default: emailServiceMock }));
// Mock express-validator so validationResult is a jest.fn we can control
await jest.unstable_mockModule('express-validator', () => ({
  validationResult: jest.fn(),
}));
const { validationResult } = await import('express-validator');
const controller = (await import('../../controllers/userManagementController.js')).default;

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() { return jest.fn(); }

describe('UserManagementController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllUsers returns list and handles error', async () => {
    mockService.getUsersList.mockResolvedValueOnce({ users: [] });
    const req = { query: { page: '1', limit: '10' } };
    const res = createRes();
    const next = createNext();
    await controller.getAllUsers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);

    // error path
    jest.clearAllMocks();
    const err = new Error('db');
    mockService.getUsersList.mockRejectedValueOnce(err);
    await controller.getAllUsers(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('getAllUsers uses default page and limit when not provided', async () => {
    mockService.getUsersList.mockResolvedValueOnce({ users: [] });
    const req = { query: {} };
    const res = createRes();
    const next = createNext();

    await controller.getAllUsers(req, res, next);

    expect(mockService.getUsersList).toHaveBeenCalledWith(1, 20);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('searchUsers validates query and calls service', async () => {
    const reqMissing = { query: {} };
    const resMissing = createRes();
    const nextMissing = createNext();
    await controller.searchUsers(reqMissing, resMissing, nextMissing);
    expect(resMissing.status).toHaveBeenCalledWith(400);
    expect(resMissing.json).toHaveBeenCalledWith({ message: 'Search query is required' });
    expect(nextMissing).not.toHaveBeenCalled();

    mockService.findUsers.mockResolvedValueOnce([{ id: 1 }]);
    const req = { query: { q: 'john' } };
    const res = createRes();
    const next = createNext();
    await controller.searchUsers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body[0].id).toBe(1);
    // error path
    jest.clearAllMocks();
    const err = new Error('db');
    mockService.findUsers.mockRejectedValueOnce(err);
    await controller.searchUsers(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('getUserDetails returns user or 404 and handles error', async () => {
    mockService.getUserWithProgress.mockResolvedValueOnce(null);
    const req = { params: { userId: '1' } };
    const res = createRes();
    const next = createNext();
    await controller.getUserDetails(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.body).toEqual({ message: 'User not found' });
    expect(next).not.toHaveBeenCalled();

    jest.clearAllMocks();
    mockService.getUserWithProgress.mockResolvedValueOnce({ user: { id: 1 } });
    await controller.getUserDetails(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);

    jest.clearAllMocks();
    const err = new Error('db');
    mockService.getUserWithProgress.mockRejectedValueOnce(err);
    await controller.getUserDetails(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('updateUser validates input, handles not-found and sends email on changes', async () => {
    // validation error
    const errorsObj = { isEmpty: () => false, array: () => [{ msg: 'error' }] };
    validationResult.mockReturnValueOnce(errorsObj);

    const reqInvalid = { params: { userId: '1' }, body: {} };
    const resInvalid = createRes();
    const nextInvalid = createNext();
    await controller.updateUser(reqInvalid, resInvalid, nextInvalid);
    expect(resInvalid.status).toHaveBeenCalledWith(400);
    expect(resInvalid.body).toEqual({ errors: errorsObj.array() });
    expect(nextInvalid).not.toHaveBeenCalled();

    // not found
    validationResult.mockReturnValueOnce({ isEmpty: () => true });
    mockService.getUserWithProgress.mockResolvedValueOnce(null);
    const resNF = createRes();
    await controller.updateUser({ params: { userId: '1' }, body: {} }, resNF, createNext());
    expect(resNF.status).toHaveBeenCalledWith(404);
    expect(resNF.body).toEqual({ message: 'User not found' });

    // success with changes
    validationResult.mockReturnValueOnce({ isEmpty: () => true });
    mockService.getUserWithProgress.mockResolvedValueOnce({ user: { name: 'Old', email: 'old@mail.com' } });
    mockService.updateUserData.mockResolvedValueOnce({ user: { id: 1 } });
    emailServiceMock.sendAdminProfileChangeNotification.mockResolvedValueOnce({ success: true });
    const req = { params: { userId: '1' }, body: { name: 'New', email: 'new@mail.com' } };
    const res = createRes();
    const next = createNext();
    await controller.updateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(emailServiceMock.sendAdminProfileChangeNotification).toHaveBeenCalledWith(
      'new@mail.com',
      'New',
      {
        name: { old: 'Old', new: 'New' },
        email: { old: 'old@mail.com', new: 'new@mail.com' },
      },
    );
  });

  it('updateUser does not send email when there are no changes', async () => {
    validationResult.mockReturnValueOnce({ isEmpty: () => true });
    mockService.getUserWithProgress.mockResolvedValueOnce({ user: { name: 'Same', email: 'same@mail.com' } });
    mockService.updateUserData.mockResolvedValueOnce({ user: { id: 1 } });

    const req = { params: { userId: '1' }, body: { name: 'Same', email: 'same@mail.com' } };
    const res = createRes();
    const next = createNext();

    await controller.updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(emailServiceMock.sendAdminProfileChangeNotification).not.toHaveBeenCalled();
  });

  it('updateUser sends email when only email changes and keeps original name', async () => {
    validationResult.mockReturnValueOnce({ isEmpty: () => true });
    mockService.getUserWithProgress.mockResolvedValueOnce({ user: { name: 'Old', email: 'old@mail.com' } });
    mockService.updateUserData.mockResolvedValueOnce({ user: { id: 1 } });
    emailServiceMock.sendAdminProfileChangeNotification.mockResolvedValueOnce({ success: true });

    const req = { params: { userId: '1' }, body: { email: 'new@mail.com' } };
    const res = createRes();
    const next = createNext();

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await controller.updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(emailServiceMock.sendAdminProfileChangeNotification).toHaveBeenCalledWith(
      'new@mail.com',
      'Old',
      { email: { old: 'old@mail.com', new: 'new@mail.com' } },
    );

    // wait for async notification handler and assert success log content
    await new Promise((r) => setImmediate(r));
    expect(logSpy).toHaveBeenCalledWith('✅ Profile update notification sent to:', 'new@mail.com');
    logSpy.mockRestore();
  });

  it('updateUser: email notification result.success=false path', async () => {
    validationResult.mockReturnValueOnce({ isEmpty: () => true });
    mockService.getUserWithProgress.mockResolvedValueOnce({ user: { name: 'Old', email: 'old@mail.com' } });
    mockService.updateUserData.mockResolvedValueOnce({ user: { id: 1 } });
    emailServiceMock.sendAdminProfileChangeNotification.mockResolvedValueOnce({ success: false, error: 'smtp' });

    const req = { params: { userId: '1' }, body: { name: 'New' } };
    const res = createRes();
    const next = createNext();

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await controller.updateUser(req, res, next);
    await new Promise((r) => setImmediate(r));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(logSpy).toHaveBeenCalledWith('⚠️ Failed to send notification email:', 'smtp');
    logSpy.mockRestore();
  });

  it('updateUser: email notification catch branch when promise rejects', async () => {
    validationResult.mockReturnValueOnce({ isEmpty: () => true });
    mockService.getUserWithProgress.mockResolvedValueOnce({ user: { name: 'Old', email: 'old@mail.com' } });
    mockService.updateUserData.mockResolvedValueOnce({ user: { id: 1 } });
    emailServiceMock.sendAdminProfileChangeNotification.mockRejectedValueOnce(new Error('smtp down'));

    const req = { params: { userId: '1' }, body: { name: 'New' } };
    const res = createRes();
    const next = createNext();

    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await controller.updateUser(req, res, next);
    await new Promise((r) => setImmediate(r));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(errSpy).toHaveBeenCalledWith('❌ Email notification error:', expect.any(Error));
    errSpy.mockRestore();
  });

  it('updateUser forwards unexpected errors to next', async () => {
    const err = new Error('unexpected');
    // First call to validationResult throws synchronously inside handler
    validationResult.mockImplementationOnce(() => { throw err; });

    const req = { params: { userId: '1' }, body: { name: 'X' } };
    const res = createRes();
    const next = createNext();

    await controller.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('deleteUser calls service and handles error', async () => {
    mockService.deleteUser.mockResolvedValueOnce();
    const req = { params: { userId: '1' } };
    const res = createRes();
    const next = createNext();
    await controller.deleteUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body).toEqual({ message: 'User deleted successfully' });

    jest.clearAllMocks();
    const err = new Error('db');
    mockService.deleteUser.mockRejectedValueOnce(err);
    await controller.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
