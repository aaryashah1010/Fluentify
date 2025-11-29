/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';

import LoadingSpinner from '../../components/LoadingSpinner.jsx';

// Tests mirror backend-style structure: describe/it, minimal mocks, and
// React Testing Library only for DOM assertions.

describe('LoadingSpinner component', () => {
  it('renders default medium spinner with default text', () => {
    const { container } = render(<LoadingSpinner />);

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    const svgClass = svg && (svg.getAttribute('class') || '');
    expect(svgClass).toContain('animate-spin');
    expect(svgClass).toContain('h-8');
    expect(svgClass).toContain('w-8');
    expect(svgClass).toContain('text-blue-600');

    const text = container.querySelector('p');
    expect(text).toBeTruthy();
    expect(text && text.textContent).toBe('Loading...');
  });

  it('applies small and large size classes based on size prop', () => {
    const { container: smallContainer } = render(<LoadingSpinner size="sm" />);
    const smallSvg = smallContainer.querySelector('svg');
    expect(smallSvg).toBeTruthy();
    const smallClass = smallSvg && (smallSvg.getAttribute('class') || '');
    expect(smallClass).toContain('h-4');
    expect(smallClass).toContain('w-4');

    const { container: largeContainer } = render(<LoadingSpinner size="lg" />);
    const largeSvg = largeContainer.querySelector('svg');
    expect(largeSvg).toBeTruthy();
    const largeClass = largeSvg && (largeSvg.getAttribute('class') || '');
    expect(largeClass).toContain('h-12');
    expect(largeClass).toContain('w-12');
  });

  it('renders custom loading text and hides text when falsy', () => {
    const { container: customContainer } = render(
      <LoadingSpinner text="Please wait" />
    );
    const customText = customContainer.querySelector('p');
    expect(customText).toBeTruthy();
    expect(customText && customText.textContent).toBe('Please wait');

    const { container: noTextContainer } = render(
      <LoadingSpinner text="" />
    );
    const noTextParagraph = noTextContainer.querySelector('p');
    expect(noTextParagraph).toBeNull();
  });

  it('wraps spinner in full-screen container when fullScreen is true', () => {
    const { container } = render(<LoadingSpinner fullScreen={true} />);

    const wrapper = container.querySelector('div.min-h-screen');
    expect(wrapper).toBeTruthy();

    const spinner = wrapper && wrapper.querySelector('svg');
    expect(spinner).toBeTruthy();

    const wrapperClass = wrapper && (wrapper.getAttribute('class') || '');
    expect(wrapperClass).toContain('bg-green-50');
    expect(wrapperClass).toContain('flex');
    expect(wrapperClass).toContain('items-center');
    expect(wrapperClass).toContain('justify-center');
  });
});
