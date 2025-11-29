import React from 'react';
import { jest } from '@jest/globals';

import RawButton from '../../components/Button.jsx';

// Normalize default export so it works whether the module shape is a function
// or an object with a .default property under Jest/ESM.
const Button = typeof RawButton === 'function' ? RawButton : RawButton.default;

// Note: These tests mirror the backend style (Jest + ESM, minimal tooling)
// and treat Button as a pure React component without a DOM renderer.

describe('Button component', () => {
  it('renders with default props (primary, md) and children', () => {
    const element = Button({ children: 'Click me' });

    // Default variant and size
    expect(element.props.disabled).toBe(false);
    expect(element.props.className).toContain('bg-blue-600'); // primary
    expect(element.props.className).toContain('px-4 py-2 text-base'); // md

    // Children should be rendered in the non-loading branch
    const fragment = element.props.children;
    // Our component wraps content in a React.Fragment, so inspect its children
    const fragmentChildren = React.Children.toArray(fragment.props.children);
    expect(fragmentChildren).toContain('Click me');
  });

  it('applies custom variant, size and className', () => {
    const element = Button({ variant: 'danger', size: 'lg', className: 'extra-class', children: 'Delete' });

    expect(element.props.className).toContain('bg-red-600'); // danger
    expect(element.props.className).toContain('px-6 py-3 text-lg'); // lg
    expect(element.props.className).toContain('extra-class');
  });

  it('disables the button when disabled is true', () => {
    const element = Button({ disabled: true, children: 'Disabled' });

    expect(element.props.disabled).toBe(true);
    expect(element.props.className).toContain('cursor-not-allowed');
    expect(element.props.className).toContain('opacity-50');
  });

  it('shows loading state and disables the button when loading is true', () => {
    const element = Button({ loading: true, children: 'Should not show' });

    // loading implies disabled
    expect(element.props.disabled).toBe(true);

    const fragment = element.props.children;
    const fragmentChildren = React.Children.toArray(fragment.props.children);

    // Expect one of the children to be the loading text
    expect(fragmentChildren).toContain('Loading...');
  });

  it('renders an icon when provided', () => {
    const FakeIcon = () => <span>ICON</span>;
    const element = Button({ icon: <FakeIcon />, children: 'With icon' });

    const fragment = element.props.children;
    const fragmentChildren = React.Children.toArray(fragment.props.children);

    // First child should be the icon element
    const [iconElement] = fragmentChildren;
    expect(iconElement.type).toBe(FakeIcon);
  });

  it('calls onClick handler when invoked', () => {
    const handleClick = jest.fn();

    const element = Button({ onClick: handleClick, children: 'Click' });

    // Simulate a click by calling the prop directly
    element.props.onClick();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
