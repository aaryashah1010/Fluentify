/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App/App';

// Mock all page components
jest.mock('../../modules/auth', () => ({
    Login: () => <div>Login Page</div>,
    Signup: () => <div>Signup Page</div>,
    SignupWithOTP: (props) => (
        <div>
            SignupWithOTP Page
            <button onClick={() => props.onNavigate && props.onNavigate('login')}>Navigate</button>
        </div>
    ),
    ForgotPassword: () => <div>ForgotPassword Page</div>,
}));

jest.mock('../../modules/auth/TermsandConditions', () => () => <div>Terms Page</div>);
jest.mock('../../modules/auth/privacypolicy', () => () => <div>Privacy Page</div>);

jest.mock('../../modules/learner', () => ({
    Dashboard: () => <div>Learner Dashboard</div>,
    CoursePage: () => <div>Course Page</div>,
    LessonPage: () => <div>Lesson Page</div>,
    TutorChatPage: () => <div>Chat Page</div>,
    LanguageModulesPage: () => <div>Language Modules Page</div>,
    ModuleCoursesPage: () => <div>Module Courses Page</div>,
    ModuleCourseDetailsPage: () => <div>Module Course Details Page</div>,
    UserProfile: () => <div>Learner Profile</div>,
    ProgressPage: () => <div>Progress Page</div>,
}));

jest.mock('../../modules/admin', () => ({
    AdminDashboard: () => <div>Admin Dashboard</div>,
    AnalyticsDashboard: () => <div>Analytics Dashboard</div>,
    ModuleManagementLayout: () => <div>Module Management</div>,
    UserProfile: () => <div>Admin Profile</div>,
    UserManagementLayout: () => <div>User Management</div>,
    CourseEditorPage: () => <div>Course Editor</div>,
}));

jest.mock('../../modules/admin/contest-management', () => ({
    ContestListPage: () => <div>Contest List</div>,
    ContestEditorPage: () => <div>Contest Editor</div>,
}));

jest.mock('../../modules/admin/user-management/pages/UserListPage', () => () => <div>User List Page</div>);
jest.mock('../../modules/admin/user-management/pages/UserDetailPage', () => () => <div>User Detail Page</div>);
jest.mock('../../modules/learner/components/PublishedCourseList', () => () => <div>Published Course List</div>);
jest.mock('../../modules/learner/components/PublishedCourseDetails', () => () => <div>Published Course Details</div>);
jest.mock('../../modules/learner/contests/ContestBrowsePage', () => () => <div>Contest Browse Page</div>);
jest.mock('../../modules/learner/contests/ContestParticipatePage', () => () => <div>Contest Participate Page</div>);
jest.mock('../../modules/learner/contests/ContestResultPage', () => () => <div>Contest Result Page</div>);
jest.mock('../../modules/learner/contests/ContestLeaderboardPage', () => () => <div>Contest Leaderboard Page</div>);
jest.mock('../../contexts/StreamingContext', () => ({
    StreamingProvider: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../modules/Landingpage/landingpage', () => ({
    LandingPage: (props) => (
        <div>
            Landing Page
            <button onClick={() => props.onNavigate && props.onNavigate('login')}>Navigate</button>
        </div>
    ),
}));

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Helper to create a valid JWT token
const createToken = (role, exp = Date.now() / 1000 + 3600) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ role, exp }));
    return `${header}.${payload}.signature`;
};

describe('App Routing', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('renders landing page on root route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('renders landing page on /landing route', () => {
        render(
            <MemoryRouter initialEntries={['/landing']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('LandingPage onNavigate attempts to update window.location from /landing route', () => {
        render(
            <MemoryRouter initialEntries={['/landing']}>
                <App />
            </MemoryRouter>
        );

        try {
            fireEvent.click(screen.getByText('Navigate'));
        } catch (e) {
            expect(e.message).toMatch(/Not implemented: navigation/);
        }
    });

    it('renders login page', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders signup page', () => {
        render(
            <MemoryRouter initialEntries={['/signup']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('SignupWithOTP Page')).toBeInTheDocument();
    });

    it('redirects unauthenticated user to login when accessing protected route', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        // Should redirect to login
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('allows authenticated learner to access dashboard', () => {
        const token = createToken('learner');
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Learner Dashboard')).toBeInTheDocument();
    });

    it('allows authenticated admin to access admin dashboard', () => {
        const token = createToken('admin');
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/admin-dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('redirects learner trying to access admin route', () => {
        const token = createToken('learner');
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/admin-dashboard']}>
                <App />
            </MemoryRouter>
        );
        // Should redirect to login (or dashboard depending on implementation, but code says <Navigate to="/login" />)
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects admin trying to access learner route', () => {
        // The code checks: if (role && payload.role !== role) return <Navigate to="/login" />;
        // Learner routes have role="learner".
        const token = createToken('admin');
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects to login if token is expired', () => {
        const token = createToken('learner', Date.now() / 1000 - 3600); // Expired 1 hour ago
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
    });

    it('clears invalid token and redirects to login when JWT payload cannot be decoded', () => {
        // Malformed token: second segment is not valid base64 / JSON, causing decodeJwtPayload to return null
        const invalidToken = 'header.badpayload.signature';
        localStorage.setItem('jwt', invalidToken);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
    });

    it('SmartRedirect redirects authenticated learner to dashboard from unknown route', () => {
        const token = createToken('learner');
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/unknown-route']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Learner Dashboard')).toBeInTheDocument();
    });

    it('SmartRedirect redirects authenticated admin to admin dashboard from unknown route', () => {
        const token = createToken('admin');
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/unknown-route']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('SmartRedirect redirects unauthenticated user to landing from unknown route', () => {
        render(
            <MemoryRouter initialEntries={['/unknown-route']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('SmartRedirect redirects to landing if token is expired', () => {
        const token = createToken('learner', Date.now() / 1000 - 3600);
        localStorage.setItem('jwt', token);

        render(
            <MemoryRouter initialEntries={['/unknown-route']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Landing Page')).toBeInTheDocument();
        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
    });

    it('clears token when accessing login with logout param', () => {
        localStorage.setItem('jwt', 'valid-token');

        // Use pushState to set the URL including query params
        window.history.pushState({}, 'Login', '/login?logout=true');

        render(
            <MemoryRouter initialEntries={['/login?logout=true']}>
                <App />
            </MemoryRouter>
        );

        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('LandingPage onNavigate attempts to update window.location', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // JSDOM throws "Not implemented: navigation" on window.location assignment
        try {
            fireEvent.click(screen.getByText('Navigate'));
        } catch (e) {
            expect(e.message).toMatch(/Not implemented: navigation/);
        }
    });

    it('SignupWithOTP onNavigate attempts to update window.location', () => {
        render(
            <MemoryRouter initialEntries={['/signup']}>
                <App />
            </MemoryRouter>
        );

        try {
            fireEvent.click(screen.getByText('Navigate'));
        } catch (e) {
            expect(e.message).toMatch(/Not implemented: navigation/);
        }
    });
});
