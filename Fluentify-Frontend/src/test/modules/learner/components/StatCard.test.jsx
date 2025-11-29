/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from '../../../../modules/learner/components/StatCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    BookOpen: () => <div data-testid="book-icon">BookOpen</div>,
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
}));

describe('StatCard', () => {
    const MockIcon = ({ className }) => <div data-testid="mock-icon" className={className}>Icon</div>;

    it('should render stat card with label and value', () => {
        render(
            <StatCard
                icon={MockIcon}
                label="Total Courses"
                value={10}
            />
        );

        expect(screen.getByText('Total Courses')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render without icon', () => {
        render(
            <StatCard
                label="Progress"
                value="75%"
            />
        );

        expect(screen.getByText('Progress')).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('should apply custom background color', () => {
        const { container } = render(
            <StatCard
                icon={MockIcon}
                label="Test"
                value={1}
                bgColor="bg-red-100"
            />
        );

        const iconContainer = container.querySelector('.bg-red-100');
        expect(iconContainer).toBeInTheDocument();
    });

    it('should apply custom icon color', () => {
        const { container } = render(
            <StatCard
                icon={MockIcon}
                label="Test"
                value={1}
                iconColor="text-red-600"
            />
        );

        const iconContainer = container.querySelector('.text-red-600');
        expect(iconContainer).toBeInTheDocument();
    });

    it('should use default colors when not provided', () => {
        const { container } = render(
            <StatCard
                icon={MockIcon}
                label="Test"
                value={1}
            />
        );

        const bgElement = container.querySelector('.bg-blue-100');
        const iconElement = container.querySelector('.text-blue-600');

        expect(bgElement).toBeInTheDocument();
        expect(iconElement).toBeInTheDocument();
    });

    it('should render string values', () => {
        render(
            <StatCard
                label="Status"
                value="Active"
            />
        );

        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render numeric values', () => {
        render(
            <StatCard
                label="Count"
                value={42}
            />
        );

        expect(screen.getByText('42')).toBeInTheDocument();
    });
});
