import { jest } from '@jest/globals';
import React from 'react';

import RawButton from '../../components/Button.jsx';

// Normalize default export so it works whether the module shape is a function
// or an object with a .default property under Jest/ESM.
const Button = typeof RawButton === 'function' ? RawButton : RawButton.default;

describe('Button component', () => {
  it('renders a button element with default variant and size', () => {
    const element = Button({ children: 'Click me' });

    expect(element.type).toBe('button');
    expect(element.props.disabled).toBe(false);
    expect(element.props.className).toContain('bg-blue-600'); // primary
    expect(element.props.className).toContain('px-4 py-2 text-base'); // md size
    expect(element.props.className).not.toContain('cursor-not-allowed opacity-50');
  });

  it('applies variant and size classes correctly', () => {
    const element = Button({ children: 'Delete', variant: 'danger', size: 'lg' });

    expect(element.props.className).toContain('bg-red-600');
    expect(element.props.className).toContain('px-6 py-3 text-lg');
  });

  it('disables button and adds disabled styles when disabled is true', () => {
    const element = Button({ children: 'Disabled', disabled: true });

    expect(element.props.disabled).toBe(true);
    expect(element.props.className).toContain('cursor-not-allowed opacity-50');
  });

  it('disables button and shows loading state when loading is true', () => {
    const element = Button({ children: 'Submit', loading: true });

    expect(element.props.disabled).toBe(true);
    expect(element.props.className).toContain('cursor-not-allowed opacity-50');

    // Loading branch renders spinner + text inside a Fragment
    const fragment = element.props.children;
    const [spinner, text] = React.Children.toArray(fragment.props.children);
    expect(spinner.type).toBe('svg');
    expect(text).toBe('Loading...');
  });

  it('renders icon and children when not loading', () => {
    const icon = React.createElement('span', { 'data-icon': 'check' });
    const element = Button({ children: 'Save', icon });

    const fragment = element.props.children;
    const [renderedIcon, text] = React.Children.toArray(fragment.props.children);
    expect(renderedIcon.props['data-icon']).toBe('check');
    expect(text).toBe('Save');
  });

  it('passes through extra props and onClick handler', () => {
    const onClick = jest.fn();
    const element = Button({ children: 'Click', onClick, type: 'submit', 'data-id': 'btn-1' });

    expect(element.props.type).toBe('submit');
    expect(element.props['data-id']).toBe('btn-1');

    // Simulate click by calling the prop directly
    element.props.onClick();
    expect(onClick).toHaveBeenCalled();
  });
});
