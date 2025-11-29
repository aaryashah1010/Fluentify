# Test Files Creation Roadmap

## ✅ Completed Test Files (Created in this session)
1. **TermsAndConditions.test.jsx** - 7 tests, 100% coverage
2. **PrivacyPolicy.test.jsx** - 7 tests, comprehensive coverage
3. **Login.test.jsx** - 17 tests, 98.55% coverage (improved)

## 📋 Remaining Test Files To Create

### High Priority (Simple - UI Only Components)

#### 1. ForgotPassword.test.jsx
**Location**: `/src/test/modules/auth/ForgotPassword.test.jsx`
**Component**: Multi-step password reset flow (4 steps)
**Key Tests Needed**:
```javascript
- Render step 1 (email input)
- Email validation
- Role selection (learner/admin)
- Submit email and move to step 2
- Render step 2 (OTP verification)
- OTP input (6 digits)
- Verify OTP and move to step 3
- Resend OTP functionality with timer
- Render step 3 (new password)
- Password validation (length, match)
- Password strength indicator display
- Reset password and move to step 4
- Render step 4 (success)
- Navigate to login with role parameter
- Handle errors at each step
- Back navigation between steps
- URL parameter handling (pre-filled role/email)
```

#### 2. SignupWithOTP.test.jsx
**Location**: `/src/test/modules/auth/SignupWithOTP.test.jsx`
**Component**: OTP-based signup flow
**Key Tests Needed**:
```javascript
- Render signup form
- All form fields (name, email, password, role)
- Send OTP functionality
- OTP verification (6 digits)
- Resend OTP with timer
- Form validation
- Successful signup flow
- Error handling
- Navigate to login after success
```

###3. Admin User Management Component Tests

#### UserCard.test.jsx
**Location**: `/src/test/modules/admin/user-management/components/UserCard.test.jsx`
**Tests**:
```javascript
- Render user card with user data
- Display user name, email, role
- Display status badge
- Click handlers (edit, delete, view)
```

#### UserSearchBar.test.jsx
**Location**: `/src/test/modules/admin/user-management/components/UserSearchBar.test.jsx`
**Tests**:
```javascript
- Render search input
- Search input onChange
- Filter by role dropdown
- Search icon display
```

#### UserTable.test.jsx  
**Location**: `/src/test/modules/admin/user-management/components/UserTable.test.jsx`
**Tests**:
```javascript
- Render table with users
- Table headers
- User rows
- Pagination controls
- Sort functionality
- Empty state when no users
- Loading state
```

### Medium Priority (Logic Components)

#### 4. App.test.jsx
**Location**: `/src/test/App/App.test.jsx`
**Component**: Main routing and app structure
**Key Tests**:
```javascript
- Render without crashing
- Route to /login
- Route to /signup  
- Route to /dashboard (protected)
- Route to /admin-dashboard (protected)
- 404 page for unknown routes
- Redirect logic for authenticated users
```

#### 5. useStreamCourseGeneration.test.js
**Location**: `/src/test/hooks/useStreamCourseGeneration.test.js`
**Hook**: Custom hook for streaming course generation
**Key Tests**:
```javascript
- Initialize hook
- Start stream
- Handle stream chunks
- Handle stream completion
- Handle stream errors
- Cancel stream
- State updates during streaming
```

### Low Priority (Complex - External Dependencies)

#### 6. VoiceAiModal.test.jsx (Fix Existing)
**Location**: `/src/test/components/VoiceAiModal.test.jsx`
**Current Status**: Placeholder test due to import.meta.env issues
**Key Tests Needed**:
```javascript
- Render modal when open
- Not render when closed
- Start call button
- Mute/unmute functionality
- End call button
- Connection states (connecting, connected, disconnected)
- Agent speaking indicator
- Error handling
- Close modal
```

## 🛠️ Test Creation Template

### Basic Component Test Structure:
```javascript
/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '../path/to/Component';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ search: '' }),
}));

describe('ComponentName', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        render(<ComponentName />);
        expect(screen.getByText('SomeText')).toBeInTheDocument();
    });

    // Add more tests...
});
```

### Hook Test Structure:
```javascript
import { renderHook, act } from '@testing-library/react';
import useCustomHook from '../path/to/useCustomHook';

describe('useCustomHook', () => {
    it('should initialize with default state', () => {
        const { result } = renderHook(() => useCustomHook());
        expect(result.current.state).toBeDefined();
    });
    
    // Add more tests...
});
```

## 📊 Expected Coverage Improvements

After creating all tests:
- **Auth Module**: 95%+ coverage (currently 89.89%)
- **Admin User Management**: 100% coverage (currently not tested)
- **App.jsx**: 90%+ coverage (currently not in coverage)
- **useStreamCourseGeneration**: 85%+ coverage (currently not in coverage)
- **VoiceAiModal**: 80%+ coverage (currently placeholder)

**Overall Project Coverage Goal**: 95%+ statements, 90%+ branches

## 🚀 Next Steps

1. Create ForgotPassword.test.jsx using the multi-step flow tests
2. Create SignupWithOTP.test.jsx using similar OTP patterns  
3. Create simple admin component tests (UserCard, UserSearchBar, UserTable)
4. Create App.jsx routing tests
5. Create useStreamCourseGeneration hook tests
6. Fix VoiceAiModal.test.jsx with proper mocking

## 💡 Tips

- Use `jest.mock()` for external dependencies
- Mock navigation hooks from react-router-dom
- Mock API hooks (useAuth, etc.)
- Use `waitFor` for async operations
- Use `fireEvent` or `userEvent` for interactions
- Test both success and error cases
- Test loading states
- Test edge cases (empty input, invalid data, etc.)
