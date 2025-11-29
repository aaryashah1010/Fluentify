// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
class RequestError extends Error {
  constructor(message, code, statusCode) {
    if (stryMutAct_9fa48("3893")) {
      {}
    } else {
      stryCov_9fa48("3893");
      super(message);
      this.name = stryMutAct_9fa48("3894") ? "" : (stryCov_9fa48("3894"), 'RequestError');
      this.code = code;
      this.statusCode = statusCode;

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (stryMutAct_9fa48("3896") ? false : stryMutAct_9fa48("3895") ? true : (stryCov_9fa48("3895", "3896"), Error.captureStackTrace)) {
        if (stryMutAct_9fa48("3897")) {
          {}
        } else {
          stryCov_9fa48("3897");
          Error.captureStackTrace(this, RequestError);
        }
      }
    }
  }
}

/*
HTTP Status Codes Reference:
200 OK - Response to a successful GET, PUT, PATCH or DELETE
201 Created - Response to a POST that results in a creation
204 No Content - Response to a successful request that won't be returning a body
304 Not Modified - Used when HTTP caching headers are in play
400 Bad Request - The request is malformed, such as if the body does not parse
401 Unauthorized - When no or invalid authentication details are provided
403 Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
404 Not Found - When a non-existent resource is requested
405 Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
410 Gone - Indicates that the resource at this end point is no longer available
415 Unsupported Media Type - If incorrect content type was provided as part of the request
422 Unprocessable Entity - Used for validation errors
429 Too Many Requests - When a request is rejected due to rate limiting
500 Internal Server Error - This is either a system or application error
503 Service Unavailable - The server is unable to handle the request for a service due to temporary maintenance
*/

/*
Error Code Convention:
- 1xxxx: Common/General errors
- 2xxxx: Authentication & Authorization errors  
- 3xxxx: Course management errors
- 4xxxx: Lesson management errors
- 5xxxx: Progress tracking errors
- 6xxxx: User preferences errors
- 7xxxx: Unit management errors
- 8xxxx: Retell AI integration errors
*/

const ERRORS = stryMutAct_9fa48("3898") ? {} : (stryCov_9fa48("3898"), {
  // Common Errors (1xxxx)
  DATABASE_ERROR: new RequestError(stryMutAct_9fa48("3899") ? "" : (stryCov_9fa48("3899"), "Database operation failed"), 10001, 500),
  INVALID_REQUEST_BODY: new RequestError(stryMutAct_9fa48("3900") ? "" : (stryCov_9fa48("3900"), "Invalid request body"), 10002, 400),
  INVALID_QUERY_PARAMETER: new RequestError(stryMutAct_9fa48("3901") ? "" : (stryCov_9fa48("3901"), "Invalid query parameters"), 10003, 400),
  UNHANDLED_ERROR: new RequestError(stryMutAct_9fa48("3902") ? "" : (stryCov_9fa48("3902"), "An unexpected error occurred"), 10004, 500),
  INTERNAL_SERVER_ERROR: new RequestError(stryMutAct_9fa48("3903") ? "" : (stryCov_9fa48("3903"), "Internal server error"), 10005, 500),
  RESOURCE_NOT_FOUND: new RequestError(stryMutAct_9fa48("3904") ? "" : (stryCov_9fa48("3904"), "Resource not found"), 10006, 404),
  INVALID_PARAMS: new RequestError(stryMutAct_9fa48("3905") ? "" : (stryCov_9fa48("3905"), "Invalid parameters"), 10007, 400),
  VALIDATION_ERROR: new RequestError(stryMutAct_9fa48("3906") ? "" : (stryCov_9fa48("3906"), "Validation failed"), 10008, 422),
  DUPLICATE_RESOURCE: new RequestError(stryMutAct_9fa48("3907") ? "" : (stryCov_9fa48("3907"), "Resource already exists"), 10009, 409),
  RESOURCE_IN_USE: new RequestError(stryMutAct_9fa48("3908") ? "" : (stryCov_9fa48("3908"), "Resource is in use and cannot be deleted"), 10010, 400),
  MISSING_REQUIRED_FIELDS: new RequestError(stryMutAct_9fa48("3909") ? "" : (stryCov_9fa48("3909"), "Missing required fields"), 10011, 400),
  INVALID_JSON: new RequestError(stryMutAct_9fa48("3910") ? "" : (stryCov_9fa48("3910"), "Invalid JSON in request body"), 10012, 400),
  // Authentication & Authorization Errors (2xxxx)
  NO_TOKEN_PROVIDED: new RequestError(stryMutAct_9fa48("3911") ? "" : (stryCov_9fa48("3911"), "No authentication token provided"), 20001, 401),
  INVALID_AUTH_TOKEN: new RequestError(stryMutAct_9fa48("3912") ? "" : (stryCov_9fa48("3912"), "Invalid authentication token"), 20002, 401),
  TOKEN_EXPIRED: new RequestError(stryMutAct_9fa48("3913") ? "" : (stryCov_9fa48("3913"), "Authentication token has expired"), 20003, 401),
  UNAUTHORIZED: new RequestError(stryMutAct_9fa48("3914") ? "" : (stryCov_9fa48("3914"), "Unauthorized access"), 20004, 401),
  FORBIDDEN: new RequestError(stryMutAct_9fa48("3915") ? "" : (stryCov_9fa48("3915"), "Access forbidden"), 20005, 403),
  INVALID_CREDENTIALS: new RequestError(stryMutAct_9fa48("3916") ? "" : (stryCov_9fa48("3916"), "Invalid email or password"), 20006, 401),
  EMAIL_ALREADY_EXISTS: new RequestError(stryMutAct_9fa48("3917") ? "" : (stryCov_9fa48("3917"), "Email already exists"), 20007, 409),
  USER_NOT_FOUND: new RequestError(stryMutAct_9fa48("3918") ? "" : (stryCov_9fa48("3918"), "User not found"), 20008, 404),
  ADMIN_ONLY_ROUTE: new RequestError(stryMutAct_9fa48("3919") ? "" : (stryCov_9fa48("3919"), "Admin access required"), 20009, 403),
  LEARNER_ONLY_ROUTE: new RequestError(stryMutAct_9fa48("3920") ? "" : (stryCov_9fa48("3920"), "Learner access required"), 20010, 403),
  SIGNUP_FAILED: new RequestError(stryMutAct_9fa48("3921") ? "" : (stryCov_9fa48("3921"), "Signup failed"), 20011, 400),
  LOGIN_FAILED: new RequestError(stryMutAct_9fa48("3922") ? "" : (stryCov_9fa48("3922"), "Login failed"), 20012, 400),
  EMAIL_NOT_REGISTERED_LEARNER: new RequestError(stryMutAct_9fa48("3923") ? "" : (stryCov_9fa48("3923"), "Credentials are wrong. Please try again"), 20013, 401),
  EMAIL_NOT_REGISTERED_ADMIN: new RequestError(stryMutAct_9fa48("3924") ? "" : (stryCov_9fa48("3924"), "Credentials are wrong. Please try again"), 20014, 401),
  INCORRECT_PASSWORD: new RequestError(stryMutAct_9fa48("3925") ? "" : (stryCov_9fa48("3925"), "Credentials are wrong. Please try again"), 20015, 401),
  // Course Management Errors (3xxxx) 
  COURSE_NOT_FOUND: new RequestError(stryMutAct_9fa48("3926") ? "" : (stryCov_9fa48("3926"), "Course not found"), 30001, 404),
  COURSE_CREATION_FAILED: new RequestError(stryMutAct_9fa48("3927") ? "" : (stryCov_9fa48("3927"), "Failed to create course"), 30002, 500),
  COURSE_UPDATE_FAILED: new RequestError(stryMutAct_9fa48("3928") ? "" : (stryCov_9fa48("3928"), "Failed to update course"), 30003, 500),
  COURSE_DELETION_FAILED: new RequestError(stryMutAct_9fa48("3929") ? "" : (stryCov_9fa48("3929"), "Failed to delete course"), 30004, 500),
  DUPLICATE_ACTIVE_COURSE: new RequestError(stryMutAct_9fa48("3930") ? "" : (stryCov_9fa48("3930"), "You already have an active course for this language"), 30005, 409),
  INVALID_LANGUAGE: new RequestError(stryMutAct_9fa48("3931") ? "" : (stryCov_9fa48("3931"), "Invalid language specified"), 30006, 400),
  INVALID_DURATION: new RequestError(stryMutAct_9fa48("3932") ? "" : (stryCov_9fa48("3932"), "Invalid expected duration"), 30007, 400),
  LANGUAGE_REQUIRED: new RequestError(stryMutAct_9fa48("3933") ? "" : (stryCov_9fa48("3933"), "Language is required"), 30008, 400),
  DURATION_REQUIRED: new RequestError(stryMutAct_9fa48("3934") ? "" : (stryCov_9fa48("3934"), "Expected duration is required"), 30009, 400),
  COURSE_GENERATION_FAILED: new RequestError(stryMutAct_9fa48("3935") ? "" : (stryCov_9fa48("3935"), "Failed to generate course content"), 30010, 500),
  INVALID_COURSE_DATA: new RequestError(stryMutAct_9fa48("3936") ? "" : (stryCov_9fa48("3936"), "Invalid course data"), 30011, 500),
  COURSE_FETCH_FAILED: new RequestError(stryMutAct_9fa48("3937") ? "" : (stryCov_9fa48("3937"), "Failed to fetch courses"), 30012, 500),
  // Lesson Management Errors (4xxxx)
  LESSON_NOT_FOUND: new RequestError(stryMutAct_9fa48("3938") ? "" : (stryCov_9fa48("3938"), "Lesson not found"), 40001, 404),
  LESSON_ALREADY_COMPLETED: new RequestError(stryMutAct_9fa48("3939") ? "" : (stryCov_9fa48("3939"), "Lesson already completed"), 40002, 400),
  LESSON_COMPLETION_FAILED: new RequestError(stryMutAct_9fa48("3940") ? "" : (stryCov_9fa48("3940"), "Failed to complete lesson"), 40003, 500),
  LESSON_LOCKED: new RequestError(stryMutAct_9fa48("3941") ? "" : (stryCov_9fa48("3941"), "Lesson is locked. Complete previous lessons first"), 40004, 403),
  INVALID_LESSON_SCORE: new RequestError(stryMutAct_9fa48("3942") ? "" : (stryCov_9fa48("3942"), "Invalid lesson score"), 40005, 400),
  LESSON_FETCH_FAILED: new RequestError(stryMutAct_9fa48("3943") ? "" : (stryCov_9fa48("3943"), "Failed to fetch lesson details"), 40006, 500),
  // Progress Tracking Errors (5xxxx)
  PROGRESS_NOT_FOUND: new RequestError(stryMutAct_9fa48("3944") ? "" : (stryCov_9fa48("3944"), "Progress not found"), 50001, 404),
  PROGRESS_UPDATE_FAILED: new RequestError(stryMutAct_9fa48("3945") ? "" : (stryCov_9fa48("3945"), "Failed to update progress"), 50002, 500),
  PROGRESS_FETCH_FAILED: new RequestError(stryMutAct_9fa48("3946") ? "" : (stryCov_9fa48("3946"), "Failed to fetch progress"), 50003, 500),
  UNIT_NOT_FOUND: new RequestError(stryMutAct_9fa48("3947") ? "" : (stryCov_9fa48("3947"), "Unit not found"), 50004, 404),
  UNIT_LOCKED: new RequestError(stryMutAct_9fa48("3948") ? "" : (stryCov_9fa48("3948"), "Unit is locked. Complete previous units first"), 50005, 403),
  INVALID_XP_VALUE: new RequestError(stryMutAct_9fa48("3949") ? "" : (stryCov_9fa48("3949"), "Invalid XP value"), 50006, 400),
  STATS_UPDATE_FAILED: new RequestError(stryMutAct_9fa48("3950") ? "" : (stryCov_9fa48("3950"), "Failed to update user statistics"), 50007, 500),
  PROGRESS_INITIALIZATION_FAILED: new RequestError(stryMutAct_9fa48("3951") ? "" : (stryCov_9fa48("3951"), "Failed to initialize course progress"), 50008, 500),
  // User Preferences Errors (6xxxx)
  PREFERENCES_NOT_FOUND: new RequestError(stryMutAct_9fa48("3952") ? "" : (stryCov_9fa48("3952"), "Preferences not found"), 60001, 404),
  PREFERENCES_SAVE_FAILED: new RequestError(stryMutAct_9fa48("3953") ? "" : (stryCov_9fa48("3953"), "Failed to save preferences"), 60002, 500),
  PREFERENCES_FETCH_FAILED: new RequestError(stryMutAct_9fa48("3954") ? "" : (stryCov_9fa48("3954"), "Failed to fetch preferences"), 60003, 500),
  DUPLICATE_PREFERENCES: new RequestError(stryMutAct_9fa48("3955") ? "" : (stryCov_9fa48("3955"), "Preferences already exist"), 60004, 409),
  INVALID_PREFERENCE_VALUE: new RequestError(stryMutAct_9fa48("3956") ? "" : (stryCov_9fa48("3956"), "Invalid preference value"), 60005, 400),
  // Retell AI Integration Errors (8xxxx)
  RETELL_AGENT_ID_REQUIRED: new RequestError(stryMutAct_9fa48("3957") ? "" : (stryCov_9fa48("3957"), "Retell agent ID is required"), 80001, 400),
  RETELL_API_NOT_CONFIGURED: new RequestError(stryMutAct_9fa48("3958") ? "" : (stryCov_9fa48("3958"), "Retell AI service is not configured"), 80002, 500),
  RETELL_AUTHENTICATION_FAILED: new RequestError(stryMutAct_9fa48("3959") ? "" : (stryCov_9fa48("3959"), "Retell AI authentication failed"), 80003, 401),
  RETELL_RATE_LIMIT: new RequestError(stryMutAct_9fa48("3960") ? "" : (stryCov_9fa48("3960"), "Retell AI rate limit exceeded. Please try again later"), 80004, 429),
  RETELL_INVALID_AGENT: new RequestError(stryMutAct_9fa48("3961") ? "" : (stryCov_9fa48("3961"), "Invalid Retell agent ID"), 80005, 400),
  RETELL_CALL_CREATION_FAILED: new RequestError(stryMutAct_9fa48("3962") ? "" : (stryCov_9fa48("3962"), "Failed to create Retell AI call"), 80006, 500),
  RETELL_API_ERROR: new RequestError(stryMutAct_9fa48("3963") ? "" : (stryCov_9fa48("3963"), "Retell AI service error"), 80007, 500),
  // Contest Errors (9xxxx)
  CONTEST_NOT_FOUND: new RequestError(stryMutAct_9fa48("3964") ? "" : (stryCov_9fa48("3964"), "Contest not found"), 90001, 404),
  CONTEST_ALREADY_SUBMITTED: new RequestError(stryMutAct_9fa48("3965") ? "" : (stryCov_9fa48("3965"), "You have already submitted this contest"), 90002, 400),
  CONTEST_NOT_ACTIVE: new RequestError(stryMutAct_9fa48("3966") ? "" : (stryCov_9fa48("3966"), "Contest is not currently active"), 90003, 403),
  CONTEST_ENDED: new RequestError(stryMutAct_9fa48("3967") ? "" : (stryCov_9fa48("3967"), "Contest has ended"), 90004, 403),
  INVALID_INPUT: new RequestError(stryMutAct_9fa48("3968") ? "" : (stryCov_9fa48("3968"), "Invalid input provided"), 90005, 400),
  NOT_FOUND: new RequestError(stryMutAct_9fa48("3969") ? "" : (stryCov_9fa48("3969"), "Resource not found"), 90006, 404),
  FORBIDDEN: new RequestError(stryMutAct_9fa48("3970") ? "" : (stryCov_9fa48("3970"), "Access forbidden"), 90007, 403)
});
export { RequestError, ERRORS };