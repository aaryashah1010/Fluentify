/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import OTPInput from '../../components/OTPInput.jsx';

// Tests mirror backend-style: describe/it structure, minimal mocks, and
// React Testing Library only for DOM + interaction.

describe('OTPInput component', () => {
  it('renders the correct number of inputs and syncs from value prop', () => {
    const { container, rerender } = render(
      <OTPInput length={4} value="" onChange={() => { }} autoFocus={false} />
    );

    let inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    expect(inputs.length).toBe(4);
    inputs.forEach((input) => {
      expect(input.value).toBe('');
    });

    // Update value prop and ensure it syncs into the internal state
    rerender(<OTPInput length={4} value="1234" onChange={() => { }} autoFocus={false} />);
    inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const values = Array.from(inputs).map((el) => el.value);
    expect(values).toEqual(['1', '2', '3', '4']);
  });

  it('updates OTP and moves focus to next input on digit entry', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    expect(inputs.length).toBe(4);

    const first = inputs[0];
    const second = inputs[1];

    fireEvent.change(first, { target: { value: '5' } });

    // onChange should be called with updated value
    expect(handleChange).toHaveBeenCalledWith('5');

    // Advance timers to run focus setTimeout
    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Focus should move to second input
    expect(document.activeElement).toBe(second);
  });

  it('handles clearing a digit and does not move focus forward', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="1" onChange={handleChange} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const first = inputs[0];
    const second = inputs[1];

    // Clear the first input
    fireEvent.change(first, { target: { value: '' } });

    expect(handleChange).toHaveBeenCalledWith('');
    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Focus should not advance to the next input
    expect(document.activeElement).not.toBe(second);
  });

  it('ignores non-digit input', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const first = container.querySelector('input[name="otp-digit-0"]');
    fireEvent.change(first, { target: { value: 'a' } });

    // onChange should not be called for non-digit
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('handles backspace deleting current and previous digits', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="12" onChange={handleChange} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const first = inputs[0];
    const second = inputs[1];

    // Focus on second input then press Backspace (should clear second)
    second.focus();
    fireEvent.keyDown(second, { key: 'Backspace' });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(handleChange).toHaveBeenCalledWith('1');

    // Now second is empty; press Backspace again to move back and clear first
    fireEvent.keyDown(second, { key: 'Backspace' });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('handles paste of multiple digits and focuses last filled', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const first = container.querySelector('input[name="otp-digit-0"]');

    const clipboardData = {
      getData: () => '9876',
    };

    // fireEvent.paste can accept an init object with clipboardData
    fireEvent.paste(first, {
      preventDefault: jest.fn(),
      clipboardData,
    });

    // onChange should be called with full OTP value
    expect(handleChange).toHaveBeenCalledWith('9876');

    act(() => {
      jest.advanceTimersByTime(0);
    });

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const values = Array.from(inputs).map((el) => el.value);
    expect(values).toEqual(['9', '8', '7', '6']);
  });

  it('does not respond to input or paste when disabled', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} disabled={true} autoFocus={false} />
    );

    const first = container.querySelector('input[name="otp-digit-0"]');

    fireEvent.change(first, { target: { value: '1' } });
    fireEvent.keyDown(first, { key: 'Backspace' });

    const clipboardData = {
      getData: () => '1234',
    };

    fireEvent.paste(first, {
      preventDefault: jest.fn(),
      clipboardData,
    });

    expect(handleChange).not.toHaveBeenCalled();

    // Inputs should reflect disabled styles
    const className = first.getAttribute('class') || '';
    expect(className).toContain('cursor-not-allowed');
  });

  it('focuses first input automatically when autoFocus is true', () => {
    jest.useFakeTimers();

    const { container } = render(
      <OTPInput length={4} value="" onChange={() => { }} autoFocus={true} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const first = inputs[0];

    // autoFocus effect runs synchronously after mount
    expect(document.activeElement).toBe(first);
  });

  it('handles multi-digit change input and focuses last filled index', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const first = inputs[0];

    // Simulate user typing/pasting multiple digits into first input
    fireEvent.change(first, { target: { value: '1234' } });

    // onChange should receive normalized OTP
    expect(handleChange).toHaveBeenCalledWith('1234');

    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Focus should move to the last filled index (3)
    const last = inputs[3];
    expect(document.activeElement).toBe(last);
  });

  it('ignores paste with non-digit characters', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const first = container.querySelector('input[name="otp-digit-0"]');

    const clipboardData = {
      getData: () => '12ab',
    };

    fireEvent.paste(first, {
      preventDefault: jest.fn(),
      clipboardData,
    });

    // onChange should not be called for invalid paste
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('pads OTP with empty digits when pasting fewer digits than length', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const first = container.querySelector('input[name="otp-digit-0"]');

    const clipboardData = {
      getData: () => '12',
    };

    fireEvent.paste(first, {
      preventDefault: jest.fn(),
      clipboardData,
    });

    expect(handleChange).toHaveBeenCalledWith('12');

    act(() => {
      jest.advanceTimersByTime(0);
    });

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const values = Array.from(inputs).map((el) => el.value);
    expect(values).toEqual(['1', '2', '', '']);
  });

  it('moves focus left and right with arrow keys', () => {
    jest.useFakeTimers();

    const { container } = render(
      <OTPInput length={4} value="1234" onChange={() => { }} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const first = inputs[0];
    const second = inputs[1];

    // Focus second input and move left
    second.focus();
    fireEvent.keyDown(second, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(first);

    // Focus first input and move right
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(second);
  });

  it('uses default length when length prop is not provided', () => {
    const { container } = render(
      <OTPInput value="123456" onChange={() => { }} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    expect(inputs.length).toBe(6); // default length

    const values = Array.from(inputs).map((el) => el.value);
    expect(values).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('handles Backspace on first empty input without changing value', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    const first = container.querySelector('input[name="otp-digit-0"]');

    first.focus();
    fireEvent.keyDown(first, { key: 'Backspace' });
    act(() => {
      jest.advanceTimersByTime(0);
    });

    // No digits to clear and no previous index; onChange should not be called
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not move focus right when ArrowRight is pressed on last input', () => {
    jest.useFakeTimers();

    const { container } = render(
      <OTPInput length={4} value="1234" onChange={() => { }} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const last = inputs[3];

    last.focus();
    fireEvent.keyDown(last, { key: 'ArrowRight' });

    // No next input, so focus should remain on last
    expect(document.activeElement).toBe(last);
  });

  it('syncs value prop when changed externally', () => {
    const handleChange = jest.fn();

    const { container, rerender } = render(
      <OTPInput length={4} value="" onChange={handleChange} autoFocus={false} />
    );

    // Update value prop externally
    rerender(<OTPInput length={4} value="5678" onChange={handleChange} autoFocus={false} />);

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const values = Array.from(inputs).map((el) => el.value);
    // Value should sync from prop
    expect(values).toEqual(['5', '6', '7', '8']);
  });

  it('handles multi-digit input with partial fill', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();

    const { container } = render(
      <OTPInput length={6} value="" onChange={handleChange} autoFocus={false} />
    );

    const inputs = container.querySelectorAll('input[name^="otp-digit-"]');
    const first = inputs[0];

    // Type 3 digits into a 6-digit OTP
    fireEvent.change(first, { target: { value: '123' } });

    expect(handleChange).toHaveBeenCalledWith('123');

    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Focus should be on index 2 (last filled)
    expect(document.activeElement).toBe(inputs[2]);
  });
});

