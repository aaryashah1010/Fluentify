/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';

import Skeleton, {
  SkeletonText,
  SkeletonCard,
  SkeletonCourseCard,
  SkeletonUnitCard,
  SkeletonPageHeader,
} from '../../components/Skeleton.jsx';

// Tests mirror backend-style structure: describe/it, minimal mocks, and
// React Testing Library only for DOM assertions.

describe('Skeleton base component', () => {
  it('renders with default width, height and base classes', () => {
    const { container } = render(<Skeleton />);

    const div = container.querySelector('div');
    expect(div).toBeTruthy();

    const className = (div && div.className) || '';
    expect(className).toContain('animate-pulse');
    expect(className).toContain('bg-gradient-to-r');
    expect(className).toContain('from-gray-200');
    expect(className).toContain('via-gray-300');
    expect(className).toContain('to-gray-200');
    expect(className).toContain('rounded');

    const style = div && (div.style || {});
    expect(style.width).toBe('100%');
    expect(style.height).toBe('1rem');
    expect(style.animation).toBe('shimmer 1.5s infinite');
  });

  it('applies circle shape and custom dimensions from props', () => {
    const { container } = render(
      <Skeleton width="50px" height="10px" circle={true} className="custom-class" />
    );

    const div = container.querySelector('div');
    expect(div).toBeTruthy();

    const className = (div && div.className) || '';
    expect(className).toContain('rounded-full');
    expect(className).toContain('custom-class');

    const style = div && (div.style || {});
    expect(style.width).toBe('50px');
    expect(style.height).toBe('10px');
  });
});

describe('SkeletonText component', () => {
  it('renders the default number of lines', () => {
    const { container } = render(<SkeletonText />);

    const wrapper = container.firstChild;
    expect(wrapper).toBeTruthy();

    const skeletons = wrapper && wrapper.querySelectorAll('div');
    // By default lines = 3
    expect(skeletons && skeletons.length).toBe(3);
  });

  it('renders a custom number of lines with shorter last line', () => {
    const lines = 4;
    const { container } = render(<SkeletonText lines={lines} />);

    const wrapper = container.firstChild;
    expect(wrapper).toBeTruthy();

    const children = wrapper && wrapper.querySelectorAll('div');
    expect(children && children.length).toBe(lines);

    if (children && children.length === lines) {
      const last = children[children.length - 1];
      const style = last && last.style;
      expect(style.width).toBe('80%');
    }
  });
});

describe('SkeletonCard component', () => {
  it('renders card structure with multiple skeleton elements', () => {
    const { container } = render(<SkeletonCard />);

    const card = container.querySelector('div.bg-white.rounded-xl');
    expect(card).toBeTruthy();

    const skeletons = card && card.querySelectorAll('div.animate-pulse');
    expect(skeletons && skeletons.length).toBeGreaterThan(0);
  });
});

describe('SkeletonCourseCard component', () => {
  it('renders course card layout with progress and footer skeletons', () => {
    const { container } = render(<SkeletonCourseCard />);

    const card = container.querySelector('div.bg-white.rounded-xl');
    expect(card).toBeTruthy();

    const progressBar = card && card.querySelector('div.rounded-full');
    expect(progressBar).toBeTruthy();

    const footer = card && card.querySelector('div.border-t');
    expect(footer).toBeTruthy();
  });
});

describe('SkeletonUnitCard component', () => {
  it('renders unit card with multiple lesson rows', () => {
    const { container } = render(<SkeletonUnitCard />);

    const card = container.querySelector('div.bg-white.rounded-lg');
    expect(card).toBeTruthy();

    const lessonContainer = card && card.querySelector('div.space-y-3');
    expect(lessonContainer).toBeTruthy();

    const lessonRows = lessonContainer && lessonContainer.querySelectorAll('div.flex.items-center');
    expect(lessonRows && lessonRows.length).toBeGreaterThanOrEqual(3);
  });
});

describe('SkeletonPageHeader component', () => {
  it('renders header container with inner skeleton elements', () => {
    const { container } = render(<SkeletonPageHeader />);

    const header = container.querySelector('header');
    expect(header).toBeTruthy();

    const skeletons = header && header.querySelectorAll('div.animate-pulse');
    expect(skeletons && skeletons.length).toBeGreaterThan(0);
  });
});
