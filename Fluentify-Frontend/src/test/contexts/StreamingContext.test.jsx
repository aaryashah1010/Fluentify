/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render } from '@testing-library/react';

import { StreamingProvider, useStreaming } from '../../contexts/StreamingContext.jsx';

// Minimal mock for useStreamCourseGeneration so we can control the context value
jest.mock('../../hooks/useStreamCourseGeneration', () => ({
  useStreamCourseGeneration: jest.fn(() => ({
    isStreaming: true,
    startStreaming: jest.fn(),
    stopStreaming: jest.fn(),
  })),
}));

// Tests mirror backend-style: describe/it with minimal mocks and
// React Testing Library only for mounting the provider.

describe('StreamingContext and useStreaming', () => {
  it('provides the stream generation value via useStreaming within StreamingProvider', () => {
    const TestComponent = () => {
      const value = useStreaming();
      return (
        <div>
          <span data-testid="is-streaming">{value.isStreaming ? 'yes' : 'no'}</span>
        </div>
      );
    };

    const { getByTestId } = render(
      <StreamingProvider>
        <TestComponent />
      </StreamingProvider>
    );

    const span = getByTestId('is-streaming');
    expect(span).toBeTruthy();
    expect(span.textContent).toBe('yes');
  });

  it('throws an error when useStreaming is used outside of StreamingProvider', () => {
    const TestComponent = () => {
      // This call should throw synchronously when component renders
      useStreaming();
      return null;
    };

    // Suppress React error boundary logs for this expected failure
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestComponent />)).toThrow(
      'useStreaming must be used within a StreamingProvider'
    );

    console.error = originalError;
  });
});
