/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyPolicy from '../../../modules/auth/privacypolicy';

describe('PrivacyPolicy', () => {
    it('should render the privacy policy page', () => {
        render(<PrivacyPolicy />);

        expect(screen.getByText(/Fluentify — Privacy Policy/i)).toBeInTheDocument();
    });

    it('should display all main sections', () => {
        render(<PrivacyPolicy />);

        expect(screen.getByText(/^General$/i)).toBeInTheDocument();
        expect(screen.getByText(/1. Information We Collect/i)).toBeInTheDocument();
        expect(screen.getByText(/2. How We Process Your Information/i)).toBeInTheDocument();
        expect(screen.getByText(/3. Your Data Rights/i)).toBeInTheDocument();
        expect(screen.getByText(/4. Data Retention/i)).toBeInTheDocument();
        expect(screen.getByText(/5. Child Users/i)).toBeInTheDocument();
        expect(screen.getByText(/6. Do Not Track/i)).toBeInTheDocument();
        expect(screen.getByText(/7. Links to Third-Party Websites/i)).toBeInTheDocument();
        expect(screen.getByText(/8. Privacy Policy Updates/i)).toBeInTheDocument();
        expect(screen.getByText(/9. Data Transfer/i)).toBeInTheDocument();
        expect(screen.getByText(/10. Supplemental Terms in Certain Jurisdictions/i)).toBeInTheDocument();
    });

    it('should display information collection subsections', () => {
        render(<PrivacyPolicy />);

        expect(screen.getByText(/a. Account Registration/i)).toBeInTheDocument();
        expect(screen.getByText(/b. Profile Page & User-Generated Content/i)).toBeInTheDocument();
        expect(screen.getByText(/c. AI Features \(Talk with AI, AI Courses, AI Chatbot\)/i)).toBeInTheDocument();
        expect(screen.getByText(/d. Activity Data & IP Addresses/i)).toBeInTheDocument();
        expect(screen.getByText(/e. FullStory or Similar Analytics Tools/i)).toBeInTheDocument();
        expect(screen.getByText(/f. Cookies/i)).toBeInTheDocument();
        expect(screen.getByText(/g. Google Analytics & Similar Tools/i)).toBeInTheDocument();
    });

    it('should display AI features information', () => {
        render(<PrivacyPolicy />);

        const talkWithAI = screen.getAllByText(/Talk with AI/i);
        expect(talkWithAI.length).toBeGreaterThan(0);
        expect(screen.getAllByText(/AI-generated courses/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/AI chatbot/i).length).toBeGreaterThan(0);
    });

    it('should  display data rights information', () => {
        render(<PrivacyPolicy />);

        expect(screen.getByText(/Know what personal information we collect about you/i)).toBeInTheDocument();
        expect(screen.getByText(/Request deletion of your personal information/i)).toBeInTheDocument();
        expect(screen.getByText(/Export your data in a portable format/i)).toBeInTheDocument();
    });

    it('should display child users protection information', () => {
        render(<PrivacyPolicy />);

        expect(screen.getByText(/Limited social or community features/i)).toBeInTheDocument();
        expect(screen.getByText(/Restricted profile visibility/i)).toBeInTheDocument();
    });

    it('should have scrollable content container', () => {
        const { container } = render(<PrivacyPolicy />);

        const contentContainer = container.querySelector('.overflow-y-auto');
        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer).toHaveClass('max-h-[90vh]');
    });
});
