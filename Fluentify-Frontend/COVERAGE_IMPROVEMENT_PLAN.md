# Test Coverage Improvement Plan - Reaching 95%+ Branch Coverage

## Current Status
- **Overall**: 83.01% branch coverage
- **Target**: 95%+ branch coverage for all files
- **Total Tests**: 968 passing

## Priority Files (Ranked by Impact and Effort)

### **Critical Priority** (< 70% Branch Coverage)

1. **ForgotPassword.jsx** - 33.33% branches
   - **Current**: Only tests step 1 (email submission)
   - **Missing**: Steps 2-4 (OTP verification, password reset, success)
   - **Effort**: High (multi-step form with timer logic)
   - **Impact**: High (authentication flow)

2. **Dashboard.jsx** (learner) - 46.15% branches
   - **Missing**: Loading states, error handling, empty states
   - **Effort**: High (complex component with multiple data sources)
   - **Impact**: High (main user landing page)

3. **SignupWithOTP.jsx** - 63.97% branches
   - **Current**: Only tests step 1 (signup form)
   - **Missing**: Step 2 (OTP verification), role selection, password strength
   - **Effort**: Medium (2-step form)
   - **Impact**: High (critical auth flow)

4. **EmailCampaignPage.jsx** - 64.28% branches
   - **Missing**: Form validation, error states
   - **Effort**: Medium
   - **Impact**: Medium (admin feature)

5. **ContestParticipatePage.jsx** - 66.66% branches
   - **Missing**: Question navigation, timer logic, submission states
   - **Effort**: Medium
   - **Impact**: Medium (learner feature)

6. **AdminDashboard.jsx** - 67.94% branches
   - **Missing**: Loading states, chart interactions
   - **Effort**: Medium
   - **Impact**: High (admin landing page)

### **High Priority** (70-80% Branch Coverage)

7. **ProgressPage.jsx** - 69.76% branches
   - **Missing**: Empty states, chart interactions
   - **Effort**: Low-Medium
   - **Impact**: Medium

8. **UserProfile.jsx** (learner) - 69.66% branches
   - **Missing**: Edit mode, validation, error handling
   - **Effort**: Medium
   - **Impact**: Medium

9. **PublishedCourseList.jsx** - 70.58% branches
   - **Missing**: Empty states, error handling
   - **Effort**: Low
   - **Impact**: Low

10. **useStreamCourseGeneration.js** - 71.42% branches
    - **Current**: Has tests, missing error recovery paths
    - **Effort**: Low (just add error scenarios)
    - **Impact**: Medium

11. **LanguageModulesPage.jsx** - 73.07% branches
    - **Missing**: Empty states, navigation flows
    - **Effort**: Low
    - **Impact**: Medium

12. **ModuleCoursesPage.jsx** - 73.68% branches
    - **Missing**: Loading states, empty states
    - **Effort**: Low
    - **Impact**: Medium

13. **AnalyticsDashboard.jsx** - 74.35% branches
    - **Missing**: Date range handling, chart interactions
    - **Effort**: Medium
    - **Impact**: Medium

14. **ContestBrowsePage.jsx** - 73.33% branches
    - **Missing**: Filter logic, empty states
    - **Effort**: Low
    - **Impact**: Low

### **Medium Priority** (80-90% Branch Coverage)

15. **ContestEditorPage.jsx** - 76.4% branches
    - **Current**: Good coverage, missing some error paths
    - **Effort**: Low
    - **Impact**: Low

16. **ContestListPage.jsx** - 76.47% branches
    - **Current**: Good coverage, missing some edge cases
    - **Effort**: Low
    - **Impact**: Low

17. **Signup.jsx** - 80% branches
    - **Missing**: Some validation paths
    - **Effort**: Low
    - **Impact**: Medium

18. **ModuleCourseDetailsPage.jsx** - 79.54% branches
    - **Missing**: Some navigation flows
    - **Effort**: Low
    - **Impact**: Low

19. **App.jsx** - 81.48% branches
    - **Current**: Good coverage on routing
    - **Missing**: Some edge cases in JWT validation
    - **Effort**: Low
    - **Impact**: Critical (but already well-tested)

20. **PublishedLanguageList.jsx** - 81.81% branches
    - **Missing**: Minor edge cases
    - **Effort**: Low
    - **Impact**: Low

21. **ContestResultPage.jsx** - 81.25% branches
    - **Missing**: Some display variations
    - **Effort**: Low
    - **Impact**: Low

### **Low Priority** (90-95% Branch Coverage)

22. **LessonPage.jsx** - 89.74% branches (close to target!)
    - **Effort**: Very Low
    - **Impact**: Low

23. **UserProfile.jsx** (admin) - 85.29% branches
    - **Effort**: Low
    - **Impact**: Low

24. **PublishedCourseDetails.jsx** - 85% branches
    - **Effort**: Low
    - **Impact**: Low

## Quick Wins (Highest ROI)

### Tier 1: Low Effort, High Impact
1. **App.jsx** - Add missing JWT edge cases (10 mins)
2. **Signup.jsx** - Add missing validation branches (15 mins)
3. **useStreamCourseGeneration.js** - Add error recovery tests (15 mins)
4. **LessonPage.jsx** - Just need a few more edge cases (10 mins)

### Tier 2: Low Effort, Medium Impact
5. **ProgressPage.jsx** - Add empty state tests (20 mins)
6. **PublishedCourseList.jsx** - Add empty/error state tests (15 mins)
7. **LanguageModulesPage.jsx** - Add navigation tests (15 mins)
8. **ModuleCoursesPage.jsx** - Add loading/empty states (15 mins)
9. **ContestBrowsePage.jsx** - Add filter tests (20 mins)
10. **ContestEditorPage.jsx** - Add error path tests (20 mins)
11. **ContestListPage.jsx** - Add edge case tests (15 mins)

### Tier 3: Medium Effort, High Impact
12. **SignupWithOTP.jsx** - Add Step 2 tests (45 mins)
13. **AdminDashboard.jsx** - Add loading/error states (30 mins)
14. **EmailCampaignPage.jsx** - Add validation tests (30 mins)
15. **ContestParticipatePage.jsx** - Add navigation/timer tests (40 mins)

### Tier 4: Requires Significant Effort
16. **ForgotPassword.jsx** - Complete steps 2-4 (2 hours)
17. **Dashboard.jsx** (learner) - Complex multi-source component (2 hours)

## Implementation Strategy

### Phase 1: Quick Wins (2-3 hours)
Target all Tier 1 and Tier 2 items to get quick improvements in coverage.
**Expected Result**: ~88-90% overall branch coverage

### Phase 2: Medium Effort Items (3-4 hours)
Complete Tier 3 items to push toward 95% target.
**Expected Result**: ~93-94% overall branch coverage

### Phase 3: Complex Components (4-6 hours)
Tackle Tier 4 items for comprehensive coverage.
**Expected Result**: 95%+ overall branch coverage

## Files Not in Coverage Report

Need to check if these exist but aren't tested:
- main.jsx (entry point, usually excluded)
- VoiceAiModal.jsx (shows placeholder test)
- UserDetailPage.jsx vs UserDetailsPage.jsx (possible duplicate?)

## Testing Best Practices for Branch Coverage

1. **Test happy paths AND error paths**
2. **Test all conditional branches** (if/else, ternary, switch)
3. **Test edge cases** (empty arrays, null values, boundary conditions)
4. **Test async operations** (loading, success, error states)
5. **Test user interactions** (form validation, navigation, modals)
6. **Test component lifecycle** (mounting, updating, unmounting)

## Coverage Goals by Category

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| API | 98.07% | 100% | Low |
| Components | 96.25% | 98% | Low |
| Contexts | 100% | 100% | ✅ Done |
| Hooks | 89.74% | 95% | Medium |
| Modules/Admin | 71.5% | 95% | **High** |
| Modules/Auth | 68.67% | 95% | **Critical** |
| Modules/Learner | 76.53% | 95% | **High** |
| Modules/Landing | 100% | 100% | ✅ Done |

## Next Steps

1. ✅ **Completed**: Contest management pages (37 tests)
2. **Start with**: Tier 1 quick wins (App.jsx, Signup.jsx, etc.)
3. **Then**: Tier 2 low-effort items
4. **Finally**: Complex authentication flows (ForgotPassword, SignupWithOTP, Dashboard)

## Metrics to Track

- Overall branch coverage: **83.01% → 95%+**
- Files with <95% branches: **~40 files → 0 files**
- Total tests: **968 → ~1,200+** (estimated)

---
**Updated**: 2025-11-29
**Status**: In Progress
**Next Target**: Tier 1 Quick Wins
