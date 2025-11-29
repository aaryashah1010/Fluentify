import { jest, describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';

// Shared mocks so we can assert how hooks are wired without invoking real libs
const mockUseMutation = jest.fn();
const mockUseQuery = jest.fn();
let latestQueryClient;
const mockUseQueryClient = jest.fn(() => {
  latestQueryClient = {
    invalidateQueries: jest.fn(),
  };
  return latestQueryClient;
});

// API contest function mocks
const mockApiAdminCreateContest = jest.fn();
const mockApiAdminUpdateContest = jest.fn();
const mockApiAdminAddQuestion = jest.fn();
const mockApiAdminPublishContest = jest.fn();
const mockApiAdminGetContests = jest.fn();
const mockApiAdminGetContestDetails = jest.fn();
const mockApiAdminDeleteContest = jest.fn();
const mockApiGetAvailableContests = jest.fn();
const mockApiGetContestDetails = jest.fn();
const mockApiSubmitContest = jest.fn();
const mockApiGetLeaderboard = jest.fn();
const mockApiGetUserContestHistory = jest.fn();
const mockApiGetUserContestResult = jest.fn();

await jest.unstable_mockModule('@tanstack/react-query', () => ({
  useMutation: mockUseMutation,
  useQuery: mockUseQuery,
  useQueryClient: mockUseQueryClient,
}));

await jest.unstable_mockModule('../../api/contest.js', () => ({
  apiAdminCreateContest: mockApiAdminCreateContest,
  apiAdminUpdateContest: mockApiAdminUpdateContest,
  apiAdminAddQuestion: mockApiAdminAddQuestion,
  apiAdminPublishContest: mockApiAdminPublishContest,
  apiAdminGetContests: mockApiAdminGetContests,
  apiAdminGetContestDetails: mockApiAdminGetContestDetails,
  apiAdminDeleteContest: mockApiAdminDeleteContest,
  apiGetAvailableContests: mockApiGetAvailableContests,
  apiGetContestDetails: mockApiGetContestDetails,
  apiSubmitContest: mockApiSubmitContest,
  apiGetLeaderboard: mockApiGetLeaderboard,
  apiGetUserContestHistory: mockApiGetUserContestHistory,
  apiGetUserContestResult: mockApiGetUserContestResult,
}));

const contestHooksModule = await import('../../hooks/useContest.js');
const {
  useAdminContests,
  useAdminContestDetails,
  useCreateContest,
  useUpdateContest,
  useAddQuestion,
  usePublishContest,
  useDeleteContest,
  useAvailableContests,
  useContestDetails,
  useSubmitContest,
  useLeaderboard,
  useUserContestHistory,
  useUserContestResult,
} = contestHooksModule;

describe('Contest hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('useAdminContests configures query correctly', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useAdminContests();
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['admin-contests']);
    expect(receivedConfig.queryFn).toBe(mockApiAdminGetContests);

    const response = { data: ['contest1'] };
    expect(receivedConfig.select(response)).toEqual(['contest1']);
  });

  it('useAdminContestDetails configures query with contestId and select', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useAdminContestDetails(42);
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['admin-contest', 42]);
    expect(receivedConfig.enabled).toBe(true);

    receivedConfig.queryFn();
    expect(mockApiAdminGetContestDetails).toHaveBeenCalledWith(42);

    const response = { data: { id: 42 } };
    expect(receivedConfig.select(response)).toEqual({ id: 42 });
  });

  it('useCreateContest wires create mutation and invalidates admin-contests on success', () => {
    let receivedConfig;
    mockUseMutation.mockImplementation((config) => {
      receivedConfig = config;
      return { mutate: jest.fn() };
    });

    const hook = useCreateContest();
    expect(hook).toBeTruthy();

    expect(receivedConfig.mutationFn).toBe(mockApiAdminCreateContest);

    receivedConfig.onSuccess();
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-contests'] });
  });

  it('useUpdateContest wires update mutation and invalidates contest and list on success', () => {
    let receivedConfig;
    mockUseMutation.mockImplementation((config) => {
      receivedConfig = config;
      return { mutate: jest.fn() };
    });

    const hook = useUpdateContest();
    expect(hook).toBeTruthy();

    const variables = { contestId: 5, data: { name: 'Updated' } };
    receivedConfig.mutationFn(variables);
    expect(mockApiAdminUpdateContest).toHaveBeenCalledWith(5, { name: 'Updated' });

    receivedConfig.onSuccess(null, variables);
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-contest', 5] });
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-contests'] });
  });

  it('useAddQuestion wires add question mutation and invalidates contest details on success', () => {
    let receivedConfig;
    mockUseMutation.mockImplementation((config) => {
      receivedConfig = config;
      return { mutate: jest.fn() };
    });

    const hook = useAddQuestion();
    expect(hook).toBeTruthy();

    const variables = { contestId: 7, data: { text: 'Q1' } };
    receivedConfig.mutationFn(variables);
    expect(mockApiAdminAddQuestion).toHaveBeenCalledWith(7, { text: 'Q1' });

    receivedConfig.onSuccess(null, variables);
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-contest', 7] });
  });

  it('usePublishContest wires publish mutation and invalidates admin and available contests', () => {
    let receivedConfig;
    mockUseMutation.mockImplementation((config) => {
      receivedConfig = config;
      return { mutate: jest.fn() };
    });

    const hook = usePublishContest();
    expect(hook).toBeTruthy();

    expect(receivedConfig.mutationFn).toBe(mockApiAdminPublishContest);

    receivedConfig.onSuccess();
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-contests'] });
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['available-contests'] });
  });

  it('useDeleteContest wires delete mutation and invalidates admin-contests on success', () => {
    let receivedConfig;
    mockUseMutation.mockImplementation((config) => {
      receivedConfig = config;
      return { mutate: jest.fn() };
    });

    const hook = useDeleteContest();
    expect(hook).toBeTruthy();

    expect(receivedConfig.mutationFn).toBe(mockApiAdminDeleteContest);

    receivedConfig.onSuccess();
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['admin-contests'] });
  });

  it('useAvailableContests configures query correctly', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useAvailableContests();
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['available-contests']);
    expect(receivedConfig.queryFn).toBe(mockApiGetAvailableContests);
    expect(receivedConfig.refetchInterval).toBe(30000);

    const response = { data: ['c1'] };
    expect(receivedConfig.select(response)).toEqual(['c1']);
  });

  it('useContestDetails configures query with contestId and select', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useContestDetails(11);
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['contest-details', 11]);
    expect(receivedConfig.enabled).toBe(true);

    receivedConfig.queryFn();
    expect(mockApiGetContestDetails).toHaveBeenCalledWith(11);

    const response = { data: { id: 11 } };
    expect(receivedConfig.select(response)).toEqual({ id: 11 });
  });

  it('useSubmitContest wires submit mutation and invalidates related queries on success', () => {
    let receivedConfig;
    mockUseMutation.mockImplementation((config) => {
      receivedConfig = config;
      return { mutate: jest.fn() };
    });

    const hook = useSubmitContest();
    expect(hook).toBeTruthy();

    const variables = { contestId: 3, data: { answers: [] } };
    receivedConfig.mutationFn(variables);
    expect(mockApiSubmitContest).toHaveBeenCalledWith(3, { answers: [] });

    receivedConfig.onSuccess(null, variables);
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['leaderboard', 3] });
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user-contest-history'] });
    expect(latestQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['available-contests'] });
  });

  it('useLeaderboard configures query with contestId and refetchInterval', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useLeaderboard(9);
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['leaderboard', 9]);
    expect(receivedConfig.enabled).toBe(true);
    expect(receivedConfig.refetchInterval).toBe(10000);

    receivedConfig.queryFn();
    expect(mockApiGetLeaderboard).toHaveBeenCalledWith(9);

    const response = { data: ['entry'] };
    expect(receivedConfig.select(response)).toEqual(['entry']);
  });

  it('useUserContestHistory configures query correctly', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useUserContestHistory();
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['user-contest-history']);
    expect(receivedConfig.queryFn).toBe(mockApiGetUserContestHistory);

    const response = { data: ['history'] };
    expect(receivedConfig.select(response)).toEqual(['history']);
  });

  it('useUserContestResult configures query with contestId and select', () => {
    let receivedConfig;
    mockUseQuery.mockImplementation((config) => {
      receivedConfig = config;
      return { data: null };
    });

    const hook = useUserContestResult(4);
    expect(hook).toBeTruthy();

    expect(receivedConfig.queryKey).toEqual(['user-contest-result', 4]);
    expect(receivedConfig.enabled).toBe(true);

    receivedConfig.queryFn();
    expect(mockApiGetUserContestResult).toHaveBeenCalledWith(4);

    const response = { data: { rank: 1 } };
    expect(receivedConfig.select(response)).toEqual({ rank: 1 });
  });
});
