/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';

// Mock react-router-dom's useNavigate to avoid pulling in full router (and TextEncoder issues)
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Minimal mock for lucide-react ArrowLeft to keep DOM simple
jest.mock('lucide-react', () => ({
  ArrowLeft: (props) => <svg data-testid="arrow-left-icon" {...props} />,
}));

import PageHeader from '../../components/PageHeader.jsx';

// Tests mirror backend-style: describe/it, minimal mocks, no unnecessary complexity.

describe('PageHeader component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders title, subtitle, and actions without back button by default', () => {
    const actions = <button type="button">Action</button>;

    const { container, getByText } = render(
      <PageHeader
        title="Main Title"
        subtitle="Subtitle here"
        actions={actions}
      />
    );

    // Title
    expect(getByText('Main Title')).toBeTruthy();

    // Subtitle
    expect(getByText('Subtitle here')).toBeTruthy();

    // Actions
    const actionButton = getByText('Action');
    expect(actionButton).toBeTruthy();

    // No back button (ArrowLeft icon) when showBack is false
    const backIcon = container.querySelector('[data-testid="arrow-left-icon"]');
    expect(backIcon).toBeNull();
  });

  it('renders back button when showBack is true and calls navigate(-1) by default', () => {
    const { getByTestId, container } = render(
      <PageHeader title="With Back" showBack={true} />
    );

    const backButton = container.querySelector('button');
    expect(backButton).toBeTruthy();

    const icon = getByTestId('arrow-left-icon');
    expect(icon).toBeTruthy();

    // Click back button should call navigate(-1)
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('uses custom onBack handler when provided instead of navigate(-1)', () => {
    const onBack = jest.fn();

    const { container } = render(
      <PageHeader title="Custom Back" showBack={true} onBack={onBack} />
    );

    const backButton = container.querySelector('button');
    expect(backButton).toBeTruthy();

    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
    // navigate should not be called when custom handler is present
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
