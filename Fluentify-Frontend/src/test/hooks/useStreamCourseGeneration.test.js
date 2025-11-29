/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;

// Use unstable_mockModule for ESM mocking
jest.unstable_mockModule('@tanstack/react-query', () => ({
    useQueryClient: jest.fn(),
}));

jest.unstable_mockModule('../../api/apiHelpers', () => ({
    API_BASE_URL: 'http://test-api.com',
    getAuthHeader: () => ({ Authorization: 'Bearer test-token' }),
}));

// Dynamic import after mocking
const { useStreamCourseGeneration } = await import('../../hooks/useStreamCourseGeneration');
const { useQueryClient } = await import('@tanstack/react-query');

describe('useStreamCourseGeneration', () => {
    let mockQueryClient;
    let mockFetch;

    beforeEach(() => {
        mockQueryClient = {
            invalidateQueries: jest.fn(),
        };
        useQueryClient.mockReturnValue(mockQueryClient);

        mockFetch = jest.fn();
        global.fetch = mockFetch;

        // Reset mocks
        jest.clearAllMocks();
    });

    afterEach(() => {
        delete global.fetch;
    });

    const createMockResponse = (streamData) => {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                if (Array.isArray(streamData)) {
                    streamData.forEach(chunk => {
                        controller.enqueue(encoder.encode(chunk));
                    });
                } else {
                    controller.enqueue(encoder.encode(streamData));
                }
                controller.close();
            }
        });

        return {
            ok: true,
            body: stream,
        };
    };

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useStreamCourseGeneration());

        expect(result.current.state).toEqual({
            isGenerating: false,
            courseId: null,
            language: '',
            totalUnits: 6,
            units: [],
            currentGenerating: null,
            progress: '0/6',
            isComplete: false,
            error: null,
        });
    });

    it('should start generation and process course_created event', async () => {
        const streamData = [
            `event: course_created\ndata: {"courseId": "123", "totalUnits": 6}\n\n`
        ];
        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Spanish', expectedDuration: '2 weeks', expertise: 'Beginner' });
        });

        expect(result.current.state.isGenerating).toBe(true);
        expect(result.current.state.language).toBe('Spanish');

        await waitFor(() => {
            expect(result.current.state.courseId).toBe('123');
        });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/courses/generate-stream?language=Spanish'),
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer test-token' },
            })
        );
    });

    it('should process unit_generating and unit_generated events', async () => {
        const streamData = [
            `event: course_created\ndata: {"courseId": "123", "totalUnits": 2}\n\n`,
            `event: unit_generating\ndata: {"unitNumber": 1}\n\n`,
            `event: unit_generated\ndata: {"unitNumber": 1, "unit": {"title": "Unit 1"}, "progress": "1/2"}\n\n`
        ];

        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'French' });
        });

        await waitFor(() => {
            expect(result.current.state.units[0]).toEqual({ title: 'Unit 1' });
        });

        expect(result.current.state.progress).toBe('1/2');
    });

    it('should use fallback progress string when unit_generated has no progress field', async () => {
        const streamData = [
            `event: course_created\ndata: {"courseId": "123", "totalUnits": 2}\n\n`,
            `event: unit_generated\ndata: {"unitNumber": 1, "unit": {"title": "Unit 1"}}\n\n`,
        ];

        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'French' });
        });

        await waitFor(() => {
            expect(result.current.state.units[0]).toEqual({ title: 'Unit 1' });
            expect(result.current.state.progress).toBe('1/2');
        });
    });

    it('should handle course_complete event', async () => {
        const streamData = [
            `event: course_created\ndata: {"courseId": "123", "totalUnits": 1}\n\n`,
            `event: unit_generated\ndata: {"unitNumber": 1, "unit": {}, "progress": "1/1"}\n\n`,
            `event: course_complete\ndata: {"courseId": "123"}\n\n`
        ];
        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'German' });
        });

        await waitFor(() => {
            expect(result.current.state.isComplete).toBe(true);
        });

        expect(result.current.state.isGenerating).toBe(false);
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['courses'] });
    });

    it('should handle error event from stream', async () => {
        const streamData = [
            `event: error\ndata: {"message": "Something went wrong"}\n\n`
        ];
        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Italian' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('Something went wrong');
        });

        expect(result.current.state.isGenerating).toBe(false);
    });

    it('should use default error message when error event has no message', async () => {
        const streamData = [
            `event: error\ndata: {}\n\n`
        ];

        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Italian' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('Course generation failed');
        });
    });

    it('should handle fetch error', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Japanese' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('Network error');
        });
    });

    it('should use default error message when fetch rejects without message', async () => {
        mockFetch.mockRejectedValue({});

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Korean' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('Failed to start course generation');
        });
    });

    it('should handle non-OK HTTP response', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            body: {},
        });

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Korean' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('HTTP error! status: 500');
        });
    });

    it('should handle missing response body', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            body: null,
        });

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Hindi' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('ReadableStream not supported');
        });
    });

    it('should abort existing stream when generateCourse is called again', async () => {
        // Simple stream that never ends; we only care about the abort branch
        const encoder = new TextEncoder();
        const endlessStream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
                // do not close
            },
        });

        mockFetch.mockResolvedValue({
            ok: true,
            body: endlessStream,
        });

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'English' });
        });

        // Second call should hit the `if (abortController) abortController.abort();` branch
        await act(async () => {
            await result.current.generateCourse({ language: 'German' });
        });

        // The second call should succeed without throwing, exercising the abort branch.
        // We just assert that state was updated for the new language.
        expect(result.current.state.language).toBe('German');
    });

    it('should abort and reset state when reset is called during generation', async () => {
        const encoder = new TextEncoder();
        const endlessStream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
                // keep stream open
            },
        });

        mockFetch.mockResolvedValue({
            ok: true,
            body: endlessStream,
        });

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'English' });
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.state).toEqual({
            isGenerating: false,
            courseId: null,
            language: '',
            totalUnits: 6,
            units: [],
            currentGenerating: null,
            progress: '0/6',
            isComplete: false,
            error: null,
        });
    });

    it('should handle JSON parse error in SSE data gracefully', async () => {
        const streamData = [
            'event: unit_generated\n',
            'data: {invalid json}\n',
            '\n',
        ].join('');

        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Spanish' });
        });

        // We only assert that no fatal error was set and hook stays usable
        await waitFor(() => {
            expect(result.current.state.error).toBeNull();
        });
    });

    it('should ignore SSE event when data is missing', async () => {
        const streamData = [
            'event: ping\n',
            '\n',
        ].join('');

        mockFetch.mockResolvedValue(createMockResponse(streamData));

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Spanish' });
        });

        await waitFor(() => {
            // No error should be set and state should remain in generating mode until stream ends
            expect(result.current.state.error).toBeNull();
        });
    });

    it('should handle stream error (non-AbortError) and set connection-lost message', async () => {
        // Mock fetch to return a body whose reader.read throws
        const reader = {
            read: jest.fn(() => {
                throw new Error('stream failure');
            }),
        };

        mockFetch.mockResolvedValue({
            ok: true,
            body: { getReader: () => reader },
        });

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Italian' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBe('Connection lost. Please try again.');
            expect(result.current.state.isGenerating).toBe(false);
            expect(result.current.state.currentGenerating).toBeNull();
        });
    });

    it('should handle AbortError in stream without setting error', async () => {
        const abortError = new Error('aborted');
        abortError.name = 'AbortError';

        const reader = {
            read: jest.fn(() => {
                throw abortError;
            }),
        };

        mockFetch.mockResolvedValue({
            ok: true,
            body: { getReader: () => reader },
        });

        const { result } = renderHook(() => useStreamCourseGeneration());

        await act(async () => {
            await result.current.generateCourse({ language: 'Korean' });
        });

        await waitFor(() => {
            expect(result.current.state.error).toBeNull();
        });
    });

    it('should reset state', () => {
        const { result } = renderHook(() => useStreamCourseGeneration());

        act(() => {
            result.current.reset();
        });

        expect(result.current.state).toEqual({
            isGenerating: false,
            courseId: null,
            language: '',
            totalUnits: 6,
            units: [],
            currentGenerating: null,
            progress: '0/6',
            isComplete: false,
            error: null,
        });
    });
});
