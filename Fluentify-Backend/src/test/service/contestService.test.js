/**
 * Stable & deterministic contestService tests
 * Fixes all date-related and mock-related failures
 */

import { jest } from "@jest/globals";

// ------------------------------
// Global fixed date for stability
// ------------------------------
beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2025-01-01T10:00:00Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

// ------------------------------
// Repository mock
// ------------------------------
const mockRepo = {
  adminCreateContest: jest.fn(),
  getContestById: jest.fn(),
  adminAddQuestion: jest.fn(),
  adminUpdateContest: jest.fn(),
  learnerGetContestQuestions: jest.fn(),
  adminPublishContest: jest.fn(),
  adminGetAllContests: jest.fn(),
  adminGetContestById: jest.fn(),
  adminDeleteContest: jest.fn(),
  learnerGetAvailableContests: jest.fn(),
  updateContestStatus: jest.fn(),
  hasUserSubmitted: jest.fn(),
  getCorrectAnswers: jest.fn(),
  saveContestScore: jest.fn(),
  saveContestSubmissions: jest.fn(),
  getUserContestResult: jest.fn(),
  getLeaderboard: jest.fn(),
  getUserContests: jest.fn(),
  getUserSubmissions: jest.fn(),
};

// mock module BEFORE importing service
await jest.unstable_mockModule(
  "../../repositories/contestRepository.js",
  () => ({ default: mockRepo })
);

const { ERRORS } = await import("../../utils/error.js");
const service = (await import("../../services/contestService.js")).default;

// ------------------------------
// Test Suite
// ------------------------------
describe("contestService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Also reset implementations/queued return values so each test starts clean
    Object.values(mockRepo).forEach((fn) => fn.mockReset());
  });

  // ----------------------------------------------------
  // createContest
  // ----------------------------------------------------
  describe("createContest", () => {
    it("throws if end before start", async () => {
      const start = "2025-01-02T00:00:00Z";
      const end = "2025-01-01T00:00:00Z";

      await expect(
        service.createContest("T", "D", start, end)
      ).rejects.toThrow("End time must be after start time");
    });

    it("throws when start equals end (boundary guard)", async () => {
      const start = "2025-01-02T00:00:00Z";
      await expect(
        service.createContest("T", "D", start, start)
      ).rejects.toThrow("End time must be after start time");
    });

    it("throws if start in past", async () => {
      const start = "2024-12-31T00:00:00Z"; // past relative to fixed time
      const end = "2025-01-02T00:00:00Z";

      await expect(service.createContest("T", "D", start, end))
        .rejects.toThrow("Start time cannot be in the past");
    });

    it("allows start time equal to current time", async () => {
      mockRepo.adminCreateContest.mockResolvedValueOnce({ id: 42 });
      const start = "2025-01-01T10:00:00Z"; // exactly now
      const end = "2025-01-02T00:00:00Z";

      const result = await service.createContest("T", "D", start, end);
      expect(result).toEqual({ id: 42 });
      expect(mockRepo.adminCreateContest).toHaveBeenCalled();
    });

    it("calls repository when valid", async () => {
      mockRepo.adminCreateContest.mockResolvedValueOnce({ id: 1 });

      const r = await service.createContest(
        "T",
        "D",
        "2025-01-02T00:00:00Z",
        "2025-01-03T00:00:00Z"
      );

      expect(r).toEqual({ id: 1 });
    });
  });

  // ----------------------------------------------------
  // addQuestion
  // ----------------------------------------------------
  describe("addQuestion", () => {
    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.addQuestion(1, "Q", [], 1))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("throws INVALID_INPUT when contest not DRAFT even with valid options", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "ACTIVE" });

      await expect(
        service.addQuestion(1, "Q", [{ id: 1 }, { id: 2 }], 1)
      ).rejects.toBe(ERRORS.INVALID_INPUT);
      expect(mockRepo.adminAddQuestion).not.toHaveBeenCalled();
    });

    it("throws INVALID_INPUT for missing/invalid options", async () => {
      mockRepo.getContestById.mockResolvedValue({ id: 1, status: "DRAFT" });

      await expect(service.addQuestion(1, "Q", [], 1))
        .rejects.toBe(ERRORS.INVALID_INPUT);

      await expect(service.addQuestion(1, "Q", [{ id: 1 }], 2))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("throws INVALID_INPUT when options is not an array", async () => {
      mockRepo.getContestById.mockResolvedValue({ id: 1, status: "DRAFT" });

      await expect(service.addQuestion(1, "Q", null, 1))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("throws INVALID_INPUT when correctOptionId not in options list", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "DRAFT" });

      const options = [{ id: 1 }, { id: 2 }];

      await expect(service.addQuestion(1, "Q", options, 3))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("rejects single-option question even when correctOptionId matches", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "DRAFT" });

      const options = [{ id: 1 }];

      await expect(
        service.addQuestion(1, "Q", options, 1)
      ).rejects.toBe(ERRORS.INVALID_INPUT);

      expect(mockRepo.adminAddQuestion).not.toHaveBeenCalled();
    });

    it("calls adminAddQuestion when valid", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "DRAFT" });
      mockRepo.adminAddQuestion.mockResolvedValueOnce({ id: 2 });

      const r = await service.addQuestion(
        1,
        "Q",
        [{ id: 1 }, { id: 2 }],
        2
      );

      expect(r).toEqual({ id: 2 });
    });
  });

  // ----------------------------------------------------
  // updateContest
  // ----------------------------------------------------
  describe("updateContest", () => {
    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.updateContest(1, {}))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("validates time", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });

      await expect(
        service.updateContest(1, {
          start_time: "2025-01-05",
          end_time: "2025-01-04",
        })
      ).rejects.toThrow("End time must be after start time");
    });

    it("throws when start equals end", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });

      await expect(
        service.updateContest(1, {
          start_time: "2025-02-01",
          end_time: "2025-02-01",
        })
      ).rejects.toThrow("End time must be after start time");
    });

    it("calls adminUpdateContest", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });
      mockRepo.adminUpdateContest.mockResolvedValueOnce({ id: 1, title: "N" });

      const r = await service.updateContest(1, { title: "N" });

      expect(r).toEqual({ id: 1, title: "N" });
    });

    it("skips validation when only one of start/end is provided", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });
      mockRepo.adminUpdateContest.mockResolvedValueOnce({ id: 1, title: "P" });

      const r = await service.updateContest(1, { start_time: "2025-02-01" });
      expect(r.title).toBe("P");
    });

    it("allows updating when both start_time and end_time form a valid window", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });
      const updates = {
        start_time: "2025-02-01T00:00:00Z",
        end_time: "2025-02-02T00:00:00Z",
        title: "Window",
      };
      mockRepo.adminUpdateContest.mockResolvedValueOnce({ id: 1, title: "Window" });

      const result = await service.updateContest(1, updates);

      expect(result).toEqual({ id: 1, title: "Window" });
      expect(mockRepo.adminUpdateContest).toHaveBeenCalledWith(1, updates);
    });
  });

  // ----------------------------------------------------
  // publishContest
  // ----------------------------------------------------
  describe("publishContest", () => {
    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.publishContest(1))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("throws INVALID_INPUT when not DRAFT", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "ACTIVE" });

      await expect(service.publishContest(1))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("throws INVALID_INPUT when no questions", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "DRAFT" });
      mockRepo.learnerGetContestQuestions.mockResolvedValueOnce([]);

      await expect(service.publishContest(1))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("publishes when valid", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "DRAFT" });
      mockRepo.learnerGetContestQuestions.mockResolvedValueOnce([{}]);
      mockRepo.adminPublishContest.mockResolvedValueOnce({ id: 1, status: "PUBLISHED" });

      const r = await service.publishContest(1);
      expect(r.status).toBe("PUBLISHED");
    });
  });

  // ----------------------------------------------------
  // getAllContests
  // ----------------------------------------------------
  it("getAllContests returns list", async () => {
    mockRepo.adminGetAllContests.mockResolvedValueOnce([{ id: 1 }]);

    const r = await service.getAllContests();
    expect(r).toEqual([{ id: 1 }]);
  });

  // ----------------------------------------------------
  // getContestDetails
  // ----------------------------------------------------
  describe("getContestDetails", () => {
    it("throws when not found", async () => {
      mockRepo.adminGetContestById.mockResolvedValueOnce(null);

      await expect(service.getContestDetails(1))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("returns contest", async () => {
      mockRepo.adminGetContestById.mockResolvedValueOnce({ id: 1 });

      const r = await service.getContestDetails(1);
      expect(r).toEqual({ id: 1 });
    });
  });

  // ----------------------------------------------------
  // deleteContest
  // ----------------------------------------------------
  describe("deleteContest", () => {
    it("throws when not found", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.deleteContest(1))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("deletes when found", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });
      mockRepo.adminDeleteContest.mockResolvedValueOnce(true);

      expect(await service.deleteContest(1)).toBe(true);
    });
  });

  // ----------------------------------------------------
  // getAvailableContests
  // ----------------------------------------------------
  describe("getAvailableContests", () => {
    it("updates statuses with inclusive boundaries and no extra calls", async () => {
      const now = new Date("2025-01-01T10:00:00Z");
      const before = new Date(now.getTime() - 5000).toISOString();
      const after = new Date(now.getTime() + 5000).toISOString();

      mockRepo.learnerGetAvailableContests.mockResolvedValueOnce([
        { id: 1, status: "PUBLISHED", start_time: now.toISOString(), end_time: after },
        { id: 2, status: "ACTIVE", start_time: before, end_time: now.toISOString() },
        { id: 3, status: "PUBLISHED", start_time: after, end_time: new Date(now.getTime() + 10000).toISOString() },
      ]);

      const r = await service.getAvailableContests(9);

      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ACTIVE");
      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(2, "ENDED");
      expect(mockRepo.updateContestStatus).not.toHaveBeenCalledWith(3, expect.any(String));
      expect(r.find((c) => c.id === 1).status).toBe("ACTIVE");
      expect(r.find((c) => c.id === 2).status).toBe("ENDED");
      expect(r.find((c) => c.id === 3).status).toBe("PUBLISHED");
    });

    it("does not update contests outside the window", async () => {
      const now = new Date("2025-01-01T10:00:00Z");
      const future = new Date(now.getTime() + 60_000).toISOString();

      mockRepo.learnerGetAvailableContests.mockResolvedValueOnce([
        { id: 10, status: "PUBLISHED", start_time: future, end_time: future },
      ]);

      const result = await service.getAvailableContests(42);
      expect(result[0].status).toBe("PUBLISHED");
      expect(mockRepo.updateContestStatus).not.toHaveBeenCalled();
    });

    it("does not activate PUBLISHED contest when now is exactly at end time", async () => {
      const now = new Date("2025-01-01T10:00:00Z");
      const start = new Date(now.getTime() - 5_000).toISOString();
      const end = now.toISOString();

      mockRepo.learnerGetAvailableContests.mockResolvedValueOnce([
        { id: 70, status: "PUBLISHED", start_time: start, end_time: end },
      ]);

      const result = await service.getAvailableContests(101);

      expect(mockRepo.updateContestStatus).not.toHaveBeenCalled();
      expect(result[0].status).toBe("PUBLISHED");
    });

    it("does not change already-ended PUBLISHED contests", async () => {
      const now = new Date("2025-01-01T10:00:00Z");
      const past = new Date(now.getTime() - 5_000).toISOString();

      mockRepo.learnerGetAvailableContests.mockResolvedValueOnce([
        { id: 50, status: "PUBLISHED", start_time: past, end_time: past },
      ]);

      const result = await service.getAvailableContests(99);

      expect(mockRepo.updateContestStatus).not.toHaveBeenCalled();
      expect(result[0].status).toBe("PUBLISHED");
    });

    it("only ends contests that are ACTIVE and past their end time", async () => {
      const now = new Date("2025-01-01T10:00:00Z");
      const past = new Date(now.getTime() - 5_000).toISOString();

      mockRepo.learnerGetAvailableContests.mockResolvedValueOnce([
        { id: 60, status: "ACTIVE", start_time: past, end_time: past },
        { id: 61, status: "PUBLISHED", start_time: past, end_time: past },
      ]);

      const result = await service.getAvailableContests(100);

      expect(mockRepo.updateContestStatus).toHaveBeenCalledTimes(1);
      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(60, "ENDED");
      expect(result.find((c) => c.id === 60).status).toBe("ENDED");
      expect(result.find((c) => c.id === 61).status).toBe("PUBLISHED");
    });
  });

  // ----------------------------------------------------
  // getContestForLearner
  // ----------------------------------------------------
  describe("getContestForLearner", () => {
    function makeContest(status, startOffsetMs, endOffsetMs) {
      const base = Date.parse("2025-01-01T10:00:00Z");
      return {
        id: 1,
        status,
        start_time: new Date(base + startOffsetMs).toISOString(),
        end_time: new Date(base + endOffsetMs).toISOString(),
        title: "T",
        description: "D",
        reward_points: 10,
      };
    }

    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("throws CONTEST_NOT_ACTIVE (before start)", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("PUBLISHED", +5000, +10000)
      );

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_NOT_ACTIVE);
    });

    it("does not update status for PUBLISHED contest before start", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("PUBLISHED", +5000, +10000)
      );

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_NOT_ACTIVE);

      expect(mockRepo.updateContestStatus).not.toHaveBeenCalled();
    });

    it("throws CONTEST_ENDED", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("ACTIVE", -10000, -1000)
      );

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_ENDED);
    });

    it("throws NOT_ACTIVE after transition", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("PUBLISHED", -5000, +10000)
      );

      mockRepo.updateContestStatus.mockResolvedValueOnce();

      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("PUBLISHED", -5000, +10000)
      );

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_NOT_ACTIVE);

      // ensure that the transition branch actually ran
      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ACTIVE");
      expect(mockRepo.getContestById).toHaveBeenCalledTimes(2);
    });

    it("promotes PUBLISHED contest to ACTIVE and refetches details when in active window", async () => {
      const base = Date.parse("2025-01-01T10:00:00Z");
      const start = new Date(base - 5000).toISOString();
      const end = new Date(base + 10000).toISOString();

      // First fetch: contest is PUBLISHED
      mockRepo.getContestById
        .mockResolvedValueOnce({
          id: 1,
          status: "PUBLISHED",
          start_time: start,
          end_time: end,
          title: "Old",
          description: "OldD",
          reward_points: 5,
        })
        // Second fetch after status update: contest is ACTIVE with updated fields
        .mockResolvedValueOnce({
          id: 1,
          status: "ACTIVE",
          start_time: start,
          end_time: end,
          title: "New",
          description: "NewD",
          reward_points: 10,
        });

      mockRepo.updateContestStatus.mockResolvedValueOnce();
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);
      mockRepo.learnerGetContestQuestions.mockResolvedValueOnce([{ id: 11 }]);

      const result = await service.getContestForLearner(1, 7);

      // repository must have been asked to promote the contest
      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ACTIVE");
      // getContestById should be called twice: original + refetch
      expect(mockRepo.getContestById).toHaveBeenCalledTimes(2);

      // returned contest details come from the refetched ACTIVE record, not the original
      expect(result.contest.title).toBe("New");
      expect(result.contest.description).toBe("NewD");
      expect(result.contest.reward_points).toBe(10);
      expect(result.questions).toEqual([{ id: 11 }]);
    });

    it("promotes PUBLISHED contest when now is exactly start_time", async () => {
      const base = Date.parse("2025-01-01T10:00:00Z");
      const start = new Date(base).toISOString();
      const end = new Date(base + 10_000).toISOString();

      mockRepo.getContestById
        .mockResolvedValueOnce({
          id: 1,
          status: "PUBLISHED",
          start_time: start,
          end_time: end,
          title: "OldStart",
          description: "OldDStart",
          reward_points: 5,
        })
        .mockResolvedValueOnce({
          id: 1,
          status: "ACTIVE",
          start_time: start,
          end_time: end,
          title: "NewStart",
          description: "NewDStart",
          reward_points: 15,
        });

      mockRepo.updateContestStatus.mockResolvedValueOnce();
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);
      mockRepo.learnerGetContestQuestions.mockResolvedValueOnce([{ id: 99 }]);

      const result = await service.getContestForLearner(1, 7);

      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ACTIVE");
      expect(mockRepo.getContestById).toHaveBeenCalledTimes(2);
      expect(result.contest.title).toBe("NewStart");
      expect(result.questions).toEqual([{ id: 99 }]);
    });

    it("throws CONTEST_ALREADY_SUBMITTED", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("ACTIVE", -5000, +10000)
      );

      mockRepo.hasUserSubmitted.mockResolvedValueOnce(true);

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_ALREADY_SUBMITTED);
    });

    it("auto-ends ACTIVE contest at or after end time and refetches from repository", async () => {
      const initial = makeContest("ACTIVE", -10_000, -1_000);
      const ended = { ...initial, status: "ENDED" };

      mockRepo.getContestById
        .mockResolvedValueOnce(initial)
        .mockResolvedValueOnce(ended);

      mockRepo.updateContestStatus.mockResolvedValueOnce();
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_ENDED);

      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ENDED");
      expect(mockRepo.getContestById).toHaveBeenCalledTimes(2);
    });

    it("auto-ends ACTIVE contest when now is exactly end time and treats it as not active", async () => {
      const initial = makeContest("ACTIVE", -10_000, 0);
      const ended = { ...initial, status: "ENDED" };

      mockRepo.getContestById
        .mockResolvedValueOnce(initial)
        .mockResolvedValueOnce(ended);

      mockRepo.updateContestStatus.mockResolvedValueOnce();
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_NOT_ACTIVE);

      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ENDED");
      expect(mockRepo.getContestById).toHaveBeenCalledTimes(2);
    });

    it("treats PUBLISHED contest at exact end time as not active rather than ended", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("PUBLISHED", -10_000, 0)
      );

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_NOT_ACTIVE);
    });

    it("returns contest + questions", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("ACTIVE", -5000, +10000)
      );

      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);
      mockRepo.learnerGetContestQuestions.mockResolvedValueOnce([
        { id: 11 },
      ]);

      const r = await service.getContestForLearner(1, 7);

      expect(r.contest.id).toBe(1);
      expect(r.questions).toEqual([{ id: 11 }]);
    });
  });

  // ----------------------------------------------------
  // submitContest
  // ----------------------------------------------------
  describe("submitContest", () => {
    function makeContest(endOffsetMs) {
      const base = Date.parse("2025-01-01T10:00:00Z");
      return {
        id: 1,
        end_time: new Date(base + endOffsetMs).toISOString(),
      };
    }

    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.submitContest(7, 1, [], Date.now()))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("throws CONTEST_ENDED", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(makeContest(-5000));

      await expect(service.submitContest(7, 1, [], Date.now()))
        .rejects.toBe(ERRORS.CONTEST_ENDED);
    });

    it("throws CONTEST_ALREADY_SUBMITTED", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(makeContest(+10000));
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(true);

      await expect(service.submitContest(7, 1, [], Date.now()))
        .rejects.toBe(ERRORS.CONTEST_ALREADY_SUBMITTED);
    });

    it("returns score, rank on success", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(makeContest(+10000));
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);

      mockRepo.getCorrectAnswers.mockResolvedValueOnce([
        { id: 1, correct_option_id: 2 },
        { id: 2, correct_option_id: 4 },
      ]);

      mockRepo.getUserContestResult.mockResolvedValueOnce({
        rank: 3,
        total_participants: 10,
      });

      const submissions = [
        { question_id: 1, selected_option_id: 2 },
        { question_id: 2, selected_option_id: 1 },
      ];

      const start = Date.now() - 5000;

      const r = await service.submitContest(7, 1, submissions, start);

      expect(mockRepo.saveContestScore).toHaveBeenCalled();
      expect(mockRepo.saveContestSubmissions).toHaveBeenCalled();

      expect(r.score).toBe(1);
      expect(r.total_questions).toBe(2);
      expect(r.rank).toBe(3);
    });

    it("calculates timeTakenMs via subtraction", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(makeContest(+10_000));
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);
      mockRepo.getCorrectAnswers.mockResolvedValueOnce([{ id: 1, correct_option_id: 2 }]);
      mockRepo.getUserContestResult.mockResolvedValueOnce({ rank: 1, total_participants: 1 });

      const submissions = [{ question_id: 1, selected_option_id: 2 }];
      const start = Date.now() - 4321;

      await service.submitContest(7, 1, submissions, start);

      const saveArgs = mockRepo.saveContestScore.mock.calls[0];
      expect(saveArgs[2]).toBe(1);
      expect(saveArgs[3]).toBe(4321);
    });

    it("saves submissions with correctness", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(makeContest(+10_000));
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);
      mockRepo.getCorrectAnswers.mockResolvedValueOnce([
        { id: 1, correct_option_id: 2 },
      ]);
      mockRepo.getUserContestResult.mockResolvedValueOnce({ rank: 1, total_participants: 1 });

      const submissions = [{ question_id: 1, selected_option_id: 3 }];
      await service.submitContest(7, 1, submissions, Date.now());

      const submissionPayload = mockRepo.saveContestSubmissions.mock.calls[0][2];
      expect(submissionPayload).toEqual([
        {
          question_id: 1,
          selected_option_id: 3,
          is_correct: false,
        },
      ]);
    });

    it("allows submissions when contest ends exactly now", async () => {
      const endExactlyNow = {
        id: 1,
        end_time: new Date("2025-01-01T10:00:00Z").toISOString(),
      };
      mockRepo.getContestById.mockResolvedValueOnce(endExactlyNow);
      mockRepo.hasUserSubmitted.mockResolvedValueOnce(false);
      mockRepo.getCorrectAnswers.mockResolvedValueOnce([]);
      mockRepo.getUserContestResult.mockResolvedValueOnce({ rank: 1, total_participants: 1 });

      const result = await service.submitContest(7, 1, [], Date.now());
      expect(result.total_questions).toBe(0);
    });
  });

  // ----------------------------------------------------
  // getLeaderboard
  // ----------------------------------------------------
  describe("getLeaderboard", () => {
    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.getLeaderboard(1))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("returns contest + leaderboard", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({
        id: 1,
        title: "T",
        description: "D",
        status: "ACTIVE",
        start_time: "s",
        end_time: "e",
      });

      mockRepo.getLeaderboard.mockResolvedValueOnce([
        { learner_id: 1 },
      ]);

      const r = await service.getLeaderboard(1);

      expect(r.contest.id).toBe(1);
      expect(r.leaderboard.length).toBe(1);
    });
  });

  // ----------------------------------------------------
  // getUserContestHistory
  // ----------------------------------------------------
  describe("getUserContestHistory", () => {
    it("returns history", async () => {
      mockRepo.getUserContests.mockResolvedValueOnce([{ id: 1 }]);

      const r = await service.getUserContestHistory(9);
      expect(r).toEqual([{ id: 1 }]);
    });
  });

  // ----------------------------------------------------
  // getUserContestDetails
  // ----------------------------------------------------
  describe("getUserContestDetails", () => {
    it("throws CONTEST_NOT_FOUND", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(null);

      await expect(service.getUserContestDetails(9, 1))
        .rejects.toBe(ERRORS.CONTEST_NOT_FOUND);
    });

    it("throws NOT_FOUND when result missing", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({
        id: 1,
        title: "T",
        description: "D",
        status: "ACTIVE",
      });

      mockRepo.getUserContestResult.mockResolvedValueOnce(null);

      await expect(service.getUserContestDetails(9, 1))
        .rejects.toBe(ERRORS.NOT_FOUND);
    });

    it("returns contest + result + submissions", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({
        id: 1,
        title: "T",
        description: "D",
        status: "ACTIVE",
      });

      mockRepo.getUserContestResult.mockResolvedValueOnce({
        score: 1,
        time_taken_ms: 100,
        submitted_at: "now",
        rank: 2,
        total_participants: 5,
      });

      mockRepo.getUserSubmissions.mockResolvedValueOnce([{ id: 11 }]);

      const r = await service.getUserContestDetails(9, 1);

      expect(r.contest).toEqual({
        id: 1,
        title: "T",
        description: "D",
        status: "ACTIVE",
      });
      expect(r.result.rank).toBe(2);
      expect(r.submissions).toEqual([{ id: 11 }]);
    });
  });
});
