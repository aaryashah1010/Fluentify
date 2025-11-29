/**
 * Stable & deterministic contestService tests
 * Fixes all date-related and mock-related failures
 */
// @ts-nocheck


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
  beforeEach(() => jest.clearAllMocks());

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

    it("throws if start in past", async () => {
      const start = "2024-12-31T00:00:00Z"; // past relative to fixed time
      const end = "2025-01-02T00:00:00Z";

      await expect(service.createContest("T", "D", start, end))
        .rejects.toThrow("Start time cannot be in the past");
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

    it("throws INVALID_INPUT when contest not DRAFT", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "ACTIVE" });

      await expect(service.addQuestion(1, "Q", [], 1))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("throws INVALID_INPUT for missing/invalid options", async () => {
      mockRepo.getContestById.mockResolvedValue({ id: 1, status: "DRAFT" });

      await expect(service.addQuestion(1, "Q", [], 1))
        .rejects.toBe(ERRORS.INVALID_INPUT);

      await expect(service.addQuestion(1, "Q", [{ id: 1 }], 2))
        .rejects.toBe(ERRORS.INVALID_INPUT);
    });

    it("throws INVALID_INPUT when correctOptionId not in options list", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1, status: "DRAFT" });

      const options = [{ id: 1 }, { id: 2 }];

      await expect(service.addQuestion(1, "Q", options, 3))
        .rejects.toBe(ERRORS.INVALID_INPUT);
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

    it("calls adminUpdateContest", async () => {
      mockRepo.getContestById.mockResolvedValueOnce({ id: 1 });
      mockRepo.adminUpdateContest.mockResolvedValueOnce({ id: 1, title: "N" });

      const r = await service.updateContest(1, { title: "N" });

      expect(r).toEqual({ id: 1, title: "N" });
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
    it("updates statuses", async () => {
      const now = new Date("2025-01-01T10:00:00Z");

      const before = new Date(now.getTime() - 5000).toISOString();
      const after = new Date(now.getTime() + 5000).toISOString();

      mockRepo.learnerGetAvailableContests.mockResolvedValueOnce([
        { id: 1, status: "PUBLISHED", start_time: before, end_time: after },
        { id: 2, status: "ACTIVE", start_time: before, end_time: before },
        { id: 3, status: "ENDED", start_time: before, end_time: before },
      ]);

      const r = await service.getAvailableContests(9);

      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(1, "ACTIVE");
      expect(mockRepo.updateContestStatus).toHaveBeenCalledWith(2, "ENDED");
      expect(r.find((c) => c.id === 1).status).toBe("ACTIVE");
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
    });

    it("throws CONTEST_ALREADY_SUBMITTED", async () => {
      mockRepo.getContestById.mockResolvedValueOnce(
        makeContest("ACTIVE", -5000, +10000)
      );

      mockRepo.hasUserSubmitted.mockResolvedValueOnce(true);

      await expect(service.getContestForLearner(1, 7))
        .rejects.toBe(ERRORS.CONTEST_ALREADY_SUBMITTED);
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

      expect(r.result.rank).toBe(2);
      expect(r.submissions).toEqual([{ id: 11 }]);
    });
  });
});
