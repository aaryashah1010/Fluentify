/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';

import ErrorMessageRaw from '../../components/ErrorMessage.jsx';

// Minimal mock for lucide-react icon so the component can render without the real SVG implementation
jest.mock('lucide-react', () => ({
  AlertCircle: (props) => <span data-testid="alert-circle-icon" {...props} />,
}));

// Normalize default export (function vs { default })
const ErrorMessage =
  typeof ErrorMessageRaw === 'function' ? ErrorMessageRaw : ErrorMessageRaw.default;

// Tests mirror backend Jest style (describe/it, minimal mocks),
// using React Testing Library only to inspect rendered output.

describe('ErrorMessage component', () => {
  it('returns null when message is empty or undefined', () => {
    const { container: c1 } = render(<ErrorMessage message="" onDismiss={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<ErrorMessage message={undefined} onDismiss={undefined} />);
    expect(c2.firstChild).toBeNull();
  });

  it('renders error message with icon when message is provided', () => {
    render(<ErrorMessage message="Something went wrong" onDismiss={undefined} />);

    // Icon should be rendered via mocked AlertCircle
    expect(screen.getByTestId('alert-circle-icon')).not.toBeNull();

    // Message text should be present
    expect(screen.getByText('Something went wrong')).not.toBeNull();
  });

  it('renders dismiss button only when onDismiss is provided and calls handler on click', () => {
    const onDismiss = jest.fn();

    const { rerender } = render(<ErrorMessage message="Error" onDismiss={undefined} />);

    // No button when handler is missing
    expect(screen.queryByRole('button')).toBeNull();

    // With onDismiss handler, button appears
    rerender(<ErrorMessage message="Error" onDismiss={onDismiss} />);

    const button = screen.getByRole('button');
    expect(button).not.toBeNull();
    expect(button.textContent).toBe('×');

    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
