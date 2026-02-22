import { jest } from '@jest/globals';

// --- ESM MOCKING SETUP ---
// Mock emailService (ESM-safe) BEFORE importing the controller
const emailServiceMock = { sendAdminProfileChangeNotification: jest.fn() };
await jest.unstable_mockModule('../../utils/emailService.js', () => ({
    default: emailServiceMock,
}));

// Import modules after mocks are set up
const responseUtils = await import('../../utils/response.js');
const validation = await import('../../utils/validation.js'); // Assuming validation is imported for its side effects/use
const { ERRORS } = await import('../../utils/error.js');
const adminUserRepository = (await import('../../repositories/adminUserRepository.js')).default;
const courseRepository = (await import('../../repositories/courseRepository.js')).default;
const adminUserController = (await import('../../controllers/adminUserController.js')).default;

// --- MOCK UTILITIES ---

/** Creates a mock Express response object. */
function createMockRes() {
    const res = {};
    res.statusCode = 200;
    res.status = jest.fn().mockImplementation((code) => {
        res.statusCode = code;
        return res;
    });
    res.json = jest.fn();
    return res;
}

/** Creates a mock Express next function. */
function createMockNext() {
    return jest.fn();
}

// --- TEST SUITE ---

describe('AdminUserController', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
        emailServiceMock.sendAdminProfileChangeNotification.mockReset();
    });

    // ----------------------------------------------------------------
    // listLearners (Pagination and Retrieval)
    // ----------------------------------------------------------------
    describe('listLearners', () => {
        it('should return paginated list with **defaults (page 1, limit 20)**', async () => {
            const req = { query: {} };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'findLearners').mockResolvedValue([{ id: 1 }, { id: 2 }]);
            jest.spyOn(adminUserRepository, 'countLearners').mockResolvedValue(2);
            await adminUserController.listLearners(req, res, next);

            expect(adminUserRepository.findLearners).toHaveBeenCalledWith({ search: '', limit: 20, offset: 0 });
            expect(adminUserRepository.countLearners).toHaveBeenCalledWith({ search: '' });
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].data).toEqual([{ id: 1 }, { id: 2 }]);
            expect(next).not.toHaveBeenCalled();
        });

        it('should **apply query params** and forward **repository errors** to next()', async () => {
            const req = { query: { page: '2', limit: '5', search: 'john ' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'findLearners').mockRejectedValue(new Error('db failed'));
            jest.spyOn(adminUserRepository, 'countLearners').mockResolvedValue(0);

            await adminUserController.listLearners(req, res, next);

            // Expect parameters to be sanitized and calculated (search trimmed, offset = (2-1)*5 = 5)
            expect(adminUserRepository.findLearners).toHaveBeenCalledWith({ search: 'john', limit: 5, offset: 5 });
            expect(next).toHaveBeenCalled();
        });

        it('should **clamp page/limit** to minimum **1** when given zeros or invalid values', async () => {
            const req = { query: { page: '0', limit: '0', search: '   ' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'findLearners').mockResolvedValue([]);
            jest.spyOn(adminUserRepository, 'countLearners').mockResolvedValue(0);

            await adminUserController.listLearners(req, res, next);

            // Expect limit=1 and offset=0 (page 1)
            expect(adminUserRepository.findLearners).toHaveBeenCalledWith({ search: '', limit: 1, offset: 0 });
            expect(next).not.toHaveBeenCalled();
        });

        it('should **cap limit at 100** and normalize **negative page** to 1', async () => {
            const req = { query: { page: '-5', limit: '150', search: 'abc' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'findLearners').mockResolvedValue([]);
            jest.spyOn(adminUserRepository, 'countLearners').mockResolvedValue(0);

            await adminUserController.listLearners(req, res, next);

            // Expect limit=100 and offset=0 (page 1)
            expect(adminUserRepository.findLearners).toHaveBeenCalledWith({ search: 'abc', limit: 100, offset: 0 });
            expect(next).not.toHaveBeenCalled();
        });
    });

    // ----------------------------------------------------------------
    // getLearnerDetails (Retrieval)
    // ----------------------------------------------------------------
    describe('getLearnerDetails', () => {
        it('should throw **USER_NOT_FOUND** when learner basic info is null', async () => {
            const req = { params: { id: '123' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue(null);

            await adminUserController.getLearnerDetails(req, res, next);

            expect(next).toHaveBeenCalledWith(ERRORS.USER_NOT_FOUND);
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should return **full details** (basic, summary, courses) on success', async () => {
            const req = { params: { id: '123' } };
            const res = createMockRes();
            const next = createMockNext();
            const expectedData = { user: { id: 123, name: 'A' }, summary: { total_xp: 10 }, courses: [{ id: 9 }] };

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue(expectedData.user);
            jest.spyOn(adminUserRepository, 'getLearnerProgressSummary').mockResolvedValue(expectedData.summary);
            jest.spyOn(courseRepository, 'findLearnerCoursesWithStats').mockResolvedValue(expectedData.courses);

            await adminUserController.getLearnerDetails(req, res, next);

            expect(adminUserRepository.getLearnerProgressSummary).toHaveBeenCalledWith('123');
            expect(courseRepository.findLearnerCoursesWithStats).toHaveBeenCalledWith('123');
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].data).toEqual(expectedData);
            expect(next).not.toHaveBeenCalled();
        });

        it('should forward **unexpected repository error** to next()', async () => {
            const req = { params: { id: 'e' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockRejectedValue(new Error('boom'));

            await adminUserController.getLearnerDetails(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    // ----------------------------------------------------------------
    // updateLearner (Update and Email Notification)
    // ----------------------------------------------------------------
    describe('updateLearner', () => {
        it('should return **400** when request body is empty or undefined (nothing to update)', async () => {
            const res = createMockRes();
            const next = createMockNext();

            // Case 1: Empty object
            await adminUserController.updateLearner({ params: { id: '1' }, body: {} }, res, next);
            expect(res.status).toHaveBeenCalledWith(400);

            // Case 2: Undefined body (covers req.body || {} branch)
            await adminUserController.updateLearner({ params: { id: '1' } }, res, next);
            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json.mock.calls[0][0].message).toBe('Nothing to update');
            expect(next).not.toHaveBeenCalled();
        });

        it('should return **400** on **invalid name** input', async () => {
            const req = { params: { id: '1' }, body: { name: '1' } }; // '1' is invalid name
            const res = createMockRes();
            const next = createMockNext();

            await adminUserController.updateLearner(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json.mock.calls[0][0].success).toBe(false);
            expect(next).not.toHaveBeenCalled();
        });

        it('should return **400** on **invalid email** input', async () => {
            const req = { params: { id: '1' }, body: { email: 'bad' } }; // 'bad' is invalid email
            const res = createMockRes();
            const next = createMockNext();

            await adminUserController.updateLearner(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json.mock.calls[0][0].success).toBe(false);
            expect(next).not.toHaveBeenCalled();
        });

        it('should forward **USER_NOT_FOUND** when fetching current data fails', async () => {
            const req = { params: { id: '2' }, body: { name: 'John' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue(null);

            await adminUserController.updateLearner(req, res, next);

            expect(next).toHaveBeenCalledWith(ERRORS.USER_NOT_FOUND);
        });

        it('should forward **USER_NOT_FOUND** when update query returns null', async () => {
            const req = { params: { id: '3' }, body: { name: 'John' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue({ id: '3', name: 'Prev', email: 'a@b.com' });
            jest.spyOn(adminUserRepository, 'updateLearnerProfile').mockResolvedValue(null);

            await adminUserController.updateLearner(req, res, next);

            expect(next).toHaveBeenCalledWith(ERRORS.USER_NOT_FOUND);
        });

        it('should **update successfully**, detect **changes** (name + email), and send email', async () => {
            const req = { params: { id: '4' }, body: { name: 'New', email: 'new@mail.com' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue({ id: '4', name: 'Old', email: 'old@mail.com' });
            jest.spyOn(adminUserRepository, 'updateLearnerProfile').mockResolvedValue({ id: '4', name: 'New', email: 'new@mail.com' });
            emailServiceMock.sendAdminProfileChangeNotification.mockResolvedValue({ success: true });

            await adminUserController.updateLearner(req, res, next);

            expect(adminUserRepository.updateLearnerProfile).toHaveBeenCalledWith('4', { name: 'New', email: 'new@mail.com' });
            expect(emailServiceMock.sendAdminProfileChangeNotification).toHaveBeenCalledWith(
                'new@mail.com', 'New', [
                    { field: 'Name', from: 'Old', to: 'New' },
                    { field: 'Email', from: 'old@mail.com', to: 'new@mail.com' }
                ]
            );

            expect(res.json).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('should update successfully when **only email is provided** (skips name change detection)', async () => {
            const req = { params: { id: '8' }, body: { email: 'only@mail.com' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue({ id: '8', name: 'Name', email: 'old@mail.com' });
            jest.spyOn(adminUserRepository, 'updateLearnerProfile').mockResolvedValue({ id: '8', name: 'Name', email: 'only@mail.com' });
            emailServiceMock.sendAdminProfileChangeNotification.mockResolvedValue({ success: true });

            await adminUserController.updateLearner(req, res, next);

            // Expect name to be undefined in the update payload
            expect(adminUserRepository.updateLearnerProfile).toHaveBeenCalledWith('8', { name: undefined, email: 'only@mail.com' });
            expect(res.json.mock.calls[0][0].data.user.email).toBe('only@mail.com');
            expect(next).not.toHaveBeenCalled();
        });

        it('should **handle email service failure (Async)** without breaking response', async () => {
            const req = { params: { id: '5' }, body: { name: 'New', email: 'new@mail.com' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue({ id: '5', name: 'Old', email: 'old@mail.com' });
            jest.spyOn(adminUserRepository, 'updateLearnerProfile').mockResolvedValue({ id: '5', name: 'New', email: 'new@mail.com' });
            emailServiceMock.sendAdminProfileChangeNotification.mockRejectedValue(new Error('mail down')); // Async failure

            await adminUserController.updateLearner(req, res, next);
            // Wait for microtask queue to clear and handle the rejected promise
            await new Promise((r) => setImmediate(r)); 

            // Response should still be sent successfully
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].success).toBe(true);
            expect(next).not.toHaveBeenCalled();
        });

        it('should **cover inner try-catch** when email service throws **synchronously**', async () => {
            const req = { params: { id: '7' }, body: { name: 'Newer', email: 'newer@mail.com' } };
            const res = createMockRes();
            const next = createMockNext();

            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue({ id: '7', name: 'Old', email: 'old@mail.com' });
            jest.spyOn(adminUserRepository, 'updateLearnerProfile').mockResolvedValue({ id: '7', name: 'Newer', email: 'newer@mail.com' });
            emailServiceMock.sendAdminProfileChangeNotification.mockImplementation(() => { throw new Error('sync boom'); }); // Sync failure

            await adminUserController.updateLearner(req, res, next);

            // Response should still be sent successfully
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0].success).toBe(true);
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should update successfully with **no actual changes** (change items list is empty)', async () => {
            const req = { params: { id: '6' }, body: { name: 'Keep', email: 'keep@mail.com' } };
            const res = createMockRes();
            const next = createMockNext();

            // before has SAME values, triggering the 'no actual change' branch but still calling update
            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockResolvedValue({ id: '6', name: 'Keep', email: 'keep@mail.com' });
            jest.spyOn(adminUserRepository, 'updateLearnerProfile').mockResolvedValue({ id: '6', name: 'Keep', email: 'keep@mail.com' });
            emailServiceMock.sendAdminProfileChangeNotification.mockResolvedValue({ success: true });

            await adminUserController.updateLearner(req, res, next);

            expect(adminUserRepository.updateLearnerProfile).toHaveBeenCalledWith('6', { name: 'Keep', email: 'keep@mail.com' });
            // Email should be sent with an empty change list []
            expect(emailServiceMock.sendAdminProfileChangeNotification).toHaveBeenCalledWith('keep@mail.com', 'Keep', []);
            expect(res.json.mock.calls[0][0].success).toBe(true);
            expect(next).not.toHaveBeenCalled();
        });

        it('should forward **unexpected error** from outer try-catch to next()', async () => {
            const req = { params: { id: 'err' }, body: { name: 'Test' } };
            const res = createMockRes();
            const next = createMockNext();
            const expectedError = new Error('Unexpected DB failure');

            // Cause failure in the initial getLearnerBasicById call
            jest.spyOn(adminUserRepository, 'getLearnerBasicById').mockRejectedValue(expectedError);

            await adminUserController.updateLearner(req, res, next);

            expect(next).toHaveBeenCalledWith(expectedError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});