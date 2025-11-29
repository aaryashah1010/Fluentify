/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TermsAndConditions from '../../../modules/auth/TermsandConditions';

describe('TermsAndConditions', () => {
    it('should render the terms and conditions page', () => {
        render(<TermsAndConditions />);

        expect(screen.getByText(/Fluentify — Terms and Conditions of Service/i)).toBeInTheDocument();
    });

    it('should display all main sections', () => {
        render(<TermsAndConditions />);

        // Check for all major headings
        expect(screen.getByText(/^General$/i)).toBeInTheDocument();
        expect(screen.getByText(/Description of the Service/i)).toBeInTheDocument();
        expect(screen.getByText(/Acceptable Use of the Service/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Additional Terms/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/^Registration$/i)).toBeInTheDocument();
        expect(screen.getByText(/Your Representations and Warranties/i)).toBeInTheDocument();
        expect(screen.getByText(/Submission of Content/i)).toBeInTheDocument();
        expect(screen.getByText(/^Indemnification$/i)).toBeInTheDocument();
        expect(screen.getByText(/License to Apps/i)).toBeInTheDocument();
        expect(screen.getByText(/Third-Party Links, Sites, and Services/i)).toBeInTheDocument();
        expect(screen.getByText(/No Representations or Warranties/i)).toBeInTheDocument();
        expect(screen.getByText(/Limitation of Liability/i)).toBeInTheDocument();
        expect(screen.getByText(/^Termination$/i)).toBeInTheDocument();
        expect(screen.getByText(/Proprietary Rights/i)).toBeInTheDocument();
        expect(screen.getByText(/^Trademarks$/i)).toBeInTheDocument();
        expect(screen.getByText(/Governing Law/i)).toBeInTheDocument();
        expect(screen.getByText(/Choice of Forum/i)).toBeInTheDocument();
        expect(screen.getByText(/^Language$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Miscellaneous$/i)).toBeInTheDocument();
    });

    it('should display acceptable use list items', () => {
        render(<TermsAndConditions />);

        expect(screen.getByText(/Violate laws or third-party rights/i)).toBeInTheDocument();
        expect(screen.getByText(/Harass, bully, or endanger other users/i)).toBeInTheDocument();
        expect(screen.getByText(/Interfere with Service functionality or security/i)).toBeInTheDocument();
    });

    it('should display registration requirements', () => {
        render(<TermsAndConditions />);

        expect(screen.getByText(/Provide accurate and current information/i)).toBeInTheDocument();
        expect(screen.getByText(/Keep your password secure/i)).toBeInTheDocument();
        expect(screen.getByText(/Update your information as needed/i)).toBeInTheDocument();
    });

    it('should display content submission guidelines', () => {
        render(<TermsAndConditions />);

        expect(screen.getByText(/Is unlawful, harmful, defamatory, or invasive/i)).toBeInTheDocument();
        expect(screen.getByText(/Infringes intellectual property rights/i)).toBeInTheDocument();
    });

    it('should display governing law information', () => {
        render(<TermsAndConditions />);

        expect(screen.getByText(/governed by and construed in accordance with the laws of India/i)).toBeInTheDocument();
    });

    it('should have scrollable content container', () => {
        const { container } = render(<TermsAndConditions />);

        const contentContainer = container.querySelector('.overflow-y-auto');
        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer).toHaveClass('max-h-[90vh]');
    });
});
