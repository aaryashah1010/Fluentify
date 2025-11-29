import { jest } from '@jest/globals';

const { RequestError, ERRORS } = await import('../../utils/error.js');

describe('utils/error', () => {
  it('RequestError sets name, code, status', () => {
    const err = new RequestError('msg', 123, 418);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('RequestError');
    expect(err.message).toBe('msg');
    expect(err.code).toBe(123);
    expect(err.statusCode).toBe(418);
  });

  it('RequestError uses captureStackTrace when available', () => {
    const original = Error.captureStackTrace;
    const spy = jest.fn();
    // eslint-disable-next-line no-global-assign
    Error.captureStackTrace = spy;
    const err = new RequestError('msg', 123, 418);
    expect(spy).toHaveBeenCalledWith(err, RequestError);
    Error.captureStackTrace = original;
  });

  it('RequestError handles environments without captureStackTrace', () => {
    const original = Error.captureStackTrace;
    // simulate environments without captureStackTrace
    // eslint-disable-next-line no-global-assign
    Error.captureStackTrace = undefined;
    const err = new RequestError('x', 1, 400);
    expect(err.name).toBe('RequestError');
    Error.captureStackTrace = original;
  });

  it('ERRORS contain expected instances', () => {
    expect(ERRORS.MISSING_REQUIRED_FIELDS).toBeInstanceOf(RequestError);
    expect(ERRORS.COURSE_NOT_FOUND.statusCode).toBe(404);
    expect(ERRORS.INVALID_CREDENTIALS.code).toBe(20006);
  });

  it('ERRORS have correct messages for each code', () => {
    const expectedMessages = {
      // Common Errors (1xxxx)
      DATABASE_ERROR: 'Database operation failed',
      INVALID_REQUEST_BODY: 'Invalid request body',
      INVALID_QUERY_PARAMETER: 'Invalid query parameters',
      UNHANDLED_ERROR: 'An unexpected error occurred',
      INTERNAL_SERVER_ERROR: 'Internal server error',
      RESOURCE_NOT_FOUND: 'Resource not found',
      INVALID_PARAMS: 'Invalid parameters',
      VALIDATION_ERROR: 'Validation failed',
      DUPLICATE_RESOURCE: 'Resource already exists',
      RESOURCE_IN_USE: 'Resource is in use and cannot be deleted',
      MISSING_REQUIRED_FIELDS: 'Missing required fields',
      INVALID_JSON: 'Invalid JSON in request body',

      // Authentication & Authorization Errors (2xxxx)
      NO_TOKEN_PROVIDED: 'No authentication token provided',
      INVALID_AUTH_TOKEN: 'Invalid authentication token',
      TOKEN_EXPIRED: 'Authentication token has expired',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Access forbidden',
      INVALID_CREDENTIALS: 'Invalid email or password',
      EMAIL_ALREADY_EXISTS: 'Email already exists',
      USER_NOT_FOUND: 'User not found',
      ADMIN_ONLY_ROUTE: 'Admin access required',
      LEARNER_ONLY_ROUTE: 'Learner access required',
      SIGNUP_FAILED: 'Signup failed',
      LOGIN_FAILED: 'Login failed',
      EMAIL_NOT_REGISTERED_LEARNER: 'Credentials are wrong. Please try again',
      EMAIL_NOT_REGISTERED_ADMIN: 'Credentials are wrong. Please try again',
      INCORRECT_PASSWORD: 'Credentials are wrong. Please try again',

      // Course Management Errors (3xxxx)
      COURSE_NOT_FOUND: 'Course not found',
      COURSE_CREATION_FAILED: 'Failed to create course',
      COURSE_UPDATE_FAILED: 'Failed to update course',
      COURSE_DELETION_FAILED: 'Failed to delete course',
      DUPLICATE_ACTIVE_COURSE: 'You already have an active course for this language',
      INVALID_LANGUAGE: 'Invalid language specified',
      INVALID_DURATION: 'Invalid expected duration',
      LANGUAGE_REQUIRED: 'Language is required',
      DURATION_REQUIRED: 'Expected duration is required',
      COURSE_GENERATION_FAILED: 'Failed to generate course content',
      INVALID_COURSE_DATA: 'Invalid course data',
      COURSE_FETCH_FAILED: 'Failed to fetch courses',

      // Lesson Management Errors (4xxxx)
      LESSON_NOT_FOUND: 'Lesson not found',
      LESSON_ALREADY_COMPLETED: 'Lesson already completed',
      LESSON_COMPLETION_FAILED: 'Failed to complete lesson',
      LESSON_LOCKED: 'Lesson is locked. Complete previous lessons first',
      INVALID_LESSON_SCORE: 'Invalid lesson score',
      LESSON_FETCH_FAILED: 'Failed to fetch lesson details',

      // Progress Tracking Errors (5xxxx)
      PROGRESS_NOT_FOUND: 'Progress not found',
      PROGRESS_UPDATE_FAILED: 'Failed to update progress',
      PROGRESS_FETCH_FAILED: 'Failed to fetch progress',
      UNIT_NOT_FOUND: 'Unit not found',
      UNIT_LOCKED: 'Unit is locked. Complete previous units first',
      INVALID_XP_VALUE: 'Invalid XP value',
      STATS_UPDATE_FAILED: 'Failed to update user statistics',
      PROGRESS_INITIALIZATION_FAILED: 'Failed to initialize course progress',

      // User Preferences Errors (6xxxx)
      PREFERENCES_NOT_FOUND: 'Preferences not found',
      PREFERENCES_SAVE_FAILED: 'Failed to save preferences',
      PREFERENCES_FETCH_FAILED: 'Failed to fetch preferences',
      DUPLICATE_PREFERENCES: 'Preferences already exist',
      INVALID_PREFERENCE_VALUE: 'Invalid preference value',

      // Retell AI Integration Errors (8xxxx)
      RETELL_AGENT_ID_REQUIRED: 'Retell agent ID is required',
      RETELL_API_NOT_CONFIGURED: 'Retell AI service is not configured',
      RETELL_AUTHENTICATION_FAILED: 'Retell AI authentication failed',
      RETELL_RATE_LIMIT: 'Retell AI rate limit exceeded. Please try again later',
      RETELL_INVALID_AGENT: 'Invalid Retell agent ID',
      RETELL_CALL_CREATION_FAILED: 'Failed to create Retell AI call',
      RETELL_API_ERROR: 'Retell AI service error',

      // Contest Errors (9xxxx)
      CONTEST_NOT_FOUND: 'Contest not found',
      CONTEST_ALREADY_SUBMITTED: 'You have already submitted this contest',
      CONTEST_NOT_ACTIVE: 'Contest is not currently active',
      CONTEST_ENDED: 'Contest has ended',
      INVALID_INPUT: 'Invalid input provided',
      NOT_FOUND: 'Resource not found',
      FORBIDDEN_CONTEST: 'Access forbidden',
    };

    // Map FORBIDDEN_CONTEST helper key to actual ERRORS.FORBIDDEN entry (contest scope)
    const keyMapping = {
      FORBIDDEN_CONTEST: 'FORBIDDEN',
    };

    for (const [key, message] of Object.entries(expectedMessages)) {
      const actualKey = keyMapping[key] || key;
      const err = ERRORS[actualKey];
      expect(err).toBeInstanceOf(RequestError);
      expect(err.message).toBe(message);
    }
  });
});
