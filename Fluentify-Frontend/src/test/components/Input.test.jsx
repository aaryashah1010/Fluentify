/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';

import Input from '../../components/Input.jsx';

// Tests follow the same backend-style structure: describe/it blocks, minimal mocks.

describe('Input component', () => {
  it('renders basic input without label, error, or icon', () => {
    const { container } = render(<Input />);

    const wrapperDiv = container.querySelector('div.w-full');
    expect(wrapperDiv).toBeTruthy();

    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    // Default classes (no error, no icon)
    const className = input.getAttribute('class') || '';
    expect(className.includes('border-gray-300')).toBe(true);
    expect(className.includes('pl-3')).toBe(true);
  });

  it('renders label when provided', () => {
    const labelText = 'Username';
    const { container } = render(<Input label={labelText} />);

    const label = container.querySelector('label');
    expect(label).toBeTruthy();
    expect(label && label.textContent).toBe(labelText);
  });

  it('applies error styles and renders error message', () => {
    const errorText = 'This field is required';
    const { container } = render(<Input error={errorText} />);

    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    const className = input.getAttribute('class') || '';
    expect(className.includes('border-red-500')).toBe(true);
    expect(className.includes('border-gray-300')).toBe(false);

    const errorParagraph = container.querySelector('p');
    expect(errorParagraph).toBeTruthy();
    expect(errorParagraph && errorParagraph.textContent).toBe(errorText);
  });

  it('renders icon and adds left padding when icon is provided', () => {
    const iconTestId = 'test-icon';
    const Icon = () => <span data-testid={iconTestId}>*</span>;

    const { container } = render(<Input icon={<Icon />} />);

    const iconWrapper = container.querySelector('div.absolute');
    expect(iconWrapper).toBeTruthy();

    const icon = container.querySelector(`[data-testid="${iconTestId}"]`);
    expect(icon).toBeTruthy();

    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    const className = input.getAttribute('class') || '';
    expect(className.includes('pl-10')).toBe(true);
    expect(className.includes('pl-3')).toBe(false);
  });

  it('merges custom className with default classes', () => {
    const customClass = 'custom-class another-class';
    const { container } = render(<Input className={customClass} />);

    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    const className = input.getAttribute('class') || '';
    expect(className.includes('custom-class')).toBe(true);
    expect(className.includes('another-class')).toBe(true);
  });
});
