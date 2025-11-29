/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render } from '@testing-library/react';

// Minimal mock for lucide-react icons to avoid pulling in full SVG implementation
jest.mock('lucide-react', () => ({
  Check: (props) => <svg data-testid="check-icon" {...props} />,
  X: (props) => <svg data-testid="x-icon" {...props} />,
}));

import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator.jsx';

// Tests mirror backend-style: describe/it, minimal mocks, no unnecessary complexity.

describe('PasswordStrengthIndicator component', () => {
  it('returns null when password is empty', () => {
    const { container } = render(
      <PasswordStrengthIndicator password="" />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows weak strength and red bar when few requirements are met', () => {
    const { container, getByText } = render(
      <PasswordStrengthIndicator password="abc" />
    );

    // Strength label
    const label = getByText('Weak');
    expect(label).toBeTruthy();
    expect(label.className).toContain('text-red-600');

    // Bar color
    const bar = container.querySelector('div.h-2.rounded-full');
    expect(bar).toBeTruthy();
    expect(bar.className).toContain('bg-red-500');
  });

  it('shows medium strength and yellow bar when medium number of requirements are met', () => {
    // 8+ chars, upper, lower, number, but maybe missing special or email rule
    const { container, getByText } = render(
      <PasswordStrengthIndicator password="Abcdef12" />
    );

    const label = getByText('Medium');
    expect(label).toBeTruthy();
    expect(label.className).toContain('text-yellow-600');

    const bar = container.querySelector('div.h-2.rounded-full');
    expect(bar).toBeTruthy();
    expect(bar.className).toContain('bg-yellow-500');
  });

  it('shows strong strength and green bar when all requirements are met and not equal to email', () => {
    const password = 'Abcdef1!';
    const email = 'user@example.com';

    const { container, getByText } = render(
      <PasswordStrengthIndicator password={password} email={email} />
    );

    const label = getByText('Strong');
    expect(label).toBeTruthy();
    expect(label.className).toContain('text-green-600');

    const bar = container.querySelector('div.h-2.rounded-full');
    expect(bar).toBeTruthy();
    expect(bar.className).toContain('bg-green-500');
  });

  it('marks individual requirements as met or unmet with icons and colors', () => {
    const password = 'Abc123!'; // should meet most but not length (if < 8)

    const { container, getByText } = render(
      <PasswordStrengthIndicator password={password} />
    );

    const reqLabels = [
      'At least 8 characters',
      'One uppercase letter',
      'One lowercase letter',
      'One number',
      'One special character',
      'Not same as email',
    ];

    reqLabels.forEach((labelText) => {
      const labelEl = getByText(labelText);
      expect(labelEl).toBeTruthy();
    });

    // Check that at least one requirement is unmet (e.g., 8 characters)
    const lengthLabel = getByText('At least 8 characters');
    expect(lengthLabel.className).toContain('text-gray-');

    // And one requirement is clearly met (e.g., one uppercase letter)
    const upperLabel = getByText('One uppercase letter');
    expect(upperLabel.className).toContain('text-green-');

    // There should be both check and X icons in the checklist
    const checks = container.querySelectorAll('[data-testid="check-icon"]');
    const xs = container.querySelectorAll('[data-testid="x-icon"]');
    expect(checks.length).toBeGreaterThan(0);
    expect(xs.length).toBeGreaterThan(0);
  });

  it('fails the "Not same as email" requirement when password equals email', () => {
    const password = 'user@example.com';
    const email = 'user@example.com';

    const { getByText, container } = render(
      <PasswordStrengthIndicator password={password} email={email} />
    );

    const label = getByText('Not same as email');
    expect(label).toBeTruthy();

    // When requirement is not met, label should use gray text class
    expect(label.className).toContain('text-gray-');

    // There should be an X icon corresponding to this unmet requirement
    const unmetRow = label.closest('div');
    const xIcon = unmetRow && unmetRow.querySelector('[data-testid="x-icon"]');
    expect(xIcon).toBeTruthy();

    // Overall strength should not be "Strong" since one requirement fails
    const strong = container.querySelector('span.text-green-600');
    if (strong) {
      expect(strong.textContent).not.toBe('Strong');
    }
  });
});
