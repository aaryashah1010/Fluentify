# Implementation Plans for Fluentify Backend Updates

## Codebase Analysis Summary
- **Backend**: Node.js/Express, PostgreSQL, Nodemailer, JWT, bcrypt
- **Frontend**: React 19, React Router v7, TanStack Query, Tailwind CSS
- **Current OTP**: 10-minute expiration stored in `otp_codes` table
- **Email**: Uses `EMAIL_USER` as sender address

---

## TASK 1: OTP Expiration & Resend Logic

### Current State
- OTP stored in `otp_codes` with `expires_at` timestamp
- Current expiration: **10 minutes** (need to change to **2 minutes**)
- Resend OTP exists but has no cooldown
- Frontend has no countdown timer

### Backend Changes

#### 1.1. Update OTP Expiration Time
**File**: `Fluentify-Backend/src/repositories/authRepository.js`
**Line**: ~101
**Change**: 
```javascript
// CURRENT:
const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// CHANGE TO:
const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
```

#### 1.2. Add Resend Cooldown Check in Repository
**File**: `Fluentify-Backend/src/repositories/authRepository.js`
**New Method**: Add after `storeOTP` method
```javascript
/**
 * Check if OTP was sent recently (within cooldown period)
 */
async checkOTPResendCooldown(email, otpType, userType, cooldownMinutes = 1) {
  const result = await db.query(
    `SELECT created_at 
     FROM otp_codes 
     WHERE LOWER(email) = LOWER($1)
     AND otp_type = $2 
     AND user_type = $3
     AND created_at > NOW() - INTERVAL '${cooldownMinutes} minutes'
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, otpType, userType]
  );
  return result.rows[0] || null;
}
```

#### 1.3. Add Cooldown Check in Controller
**File**: `Fluentify-Backend/src/controllers/authController.js`
**Method**: `resendOTP` (around line 647)
**Change**: Add cooldown check BEFORE generating new OTP
```javascript
// Add this check before generating new OTP:
const cooldownCheck = await authRepository.checkOTPResendCooldown(email, otpType, role, 1);
if (cooldownCheck) {
  const secondsRemaining = Math.ceil((60 * 1000 - (Date.now() - new Date(cooldownCheck.created_at).getTime())) / 1000);
  return res.status(429).json({
    success: false,
    message: `Please wait ${secondsRemaining} seconds before requesting a new OTP`,
    cooldownSeconds: secondsRemaining
  });
}
```

**Return Structure**: Include `cooldownSeconds` in error response for frontend countdown

#### 1.4. Update Email Template
**File**: `Fluentify-Backend/src/utils/emailService.js`
**Change**: Update expiration message in templates
- Line ~89 in `sendSignupOTP`: Change "10 minutes" to "2 minutes"
- Line ~154 in `sendPasswordResetOTP`: Change "10 minutes" to "2 minutes"

### Frontend Changes

#### 1.5. Add Countdown Timer State
**File**: `Fluentify-Frontend/src/modules/auth/SignupWithOTP.jsx`
**Change**: Add state for cooldown timer
```javascript
const [cooldownSeconds, setCooldownSeconds] = useState(0);
const [isCooldownActive, setIsCooldownActive] = useState(false);
```

#### 1.6. Implement Countdown Timer Effect
**File**: `Fluentify-Frontend/src/modules/auth/SignupWithOTP.jsx`
**Change**: Add useEffect for countdown
```javascript
useEffect(() => {
  let interval = null;
  if (isCooldownActive && cooldownSeconds > 0) {
    interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          setIsCooldownActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } else if (cooldownSeconds === 0) {
    clearInterval(interval);
  }
  return () => clearInterval(interval);
}, [isCooldownActive, cooldownSeconds]);
```

#### 1.7. Update Resend OTP Handler
**File**: `Fluentify-Frontend/src/modules/auth/SignupWithOTP.jsx`
**Method**: `handleResendOTP`
**Change**: Add cooldown initialization
```javascript
const handleResendOTP = () => {
  setError('');
  resendOTPMutation.mutate(
    { email: form.email, otpType: 'signup', role: form.role, name: form.name },
    {
      onSuccess: () => {
        setError('');
        setIsCooldownActive(true);
        setCooldownSeconds(60); // Start 60-second countdown
      },
      onError: (err) => {
        setError(err.message || 'Failed to resend OTP');
        // If error contains cooldownSeconds, start countdown
        if (err.data?.cooldownSeconds) {
          setIsCooldownActive(true);
          setCooldownSeconds(err.data.cooldownSeconds);
        }
      }
    }
  );
};
```

#### 1.8. Update Resend Button UI
**File**: `Fluentify-Frontend/src/modules/auth/SignupWithOTP.jsx`
**Line**: ~360 (Resend OTP button)
**Change**: 
```javascript
<div className="text-center">
  <button
    type="button"
    onClick={handleResendOTP}
    disabled={resendOTPMutation.isPending || isCooldownActive}
    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center gap-2 disabled:opacity-50"
  >
    <RefreshCw className={`w-4 h-4 ${resendOTPMutation.isPending ? 'animate-spin' : ''}`} />
    {isCooldownActive ? `Resend in ${cooldownSeconds}s` : 'Resend OTP'}
  </button>
</div>
```

#### 1.9. Apply Same Changes to ForgotPassword.jsx
**Repeat**: Steps 1.5-1.8 for `ForgotPassword.jsx` (lines ~354, ~119)
- Add same state variables
- Add same useEffect
- Update `handleResendOTP` for password reset
- Update resend button UI

### Summary of Files to Modify
**Backend**:
- `src/repositories/authRepository.js` - Add cooldown check method, change expiration time
- `src/controllers/authController.js` - Add cooldown validation in resendOTP
- `src/utils/emailService.js` - Update email templates

**Frontend**:
- `src/modules/auth/SignupWithOTP.jsx` - Add countdown timer
- `src/modules/auth/ForgotPassword.jsx` - Add countdown timer

---

## TASK 2: Email Enhancements

### Current State
- Emails sent with `from: process.env.EMAIL_USER`
- No profile update notification email

### 2.1. Sender Name Enhancement

**File**: `Fluentify-Backend/src/utils/emailService.js`

#### Change in All Email Methods:
**Lines**: 60, 125, 188 (in sendSignupOTP, sendPasswordResetOTP, sendWelcomeEmail)

**CURRENT**:
```javascript
from: process.env.EMAIL_USER,
```

**CHANGE TO**:
```javascript
from: `"Fluentify" <${process.env.EMAIL_USER}>`,
```

**Example** (using existing structure):
```javascript
const mailOptions = {
  from: `"Fluentify" <${process.env.EMAIL_USER}>`,  // Line 60
  to: email,
  subject: 'Verify Your Email - Fluentify',
  // ... rest of config
};
```

**Apply to**:
1. `sendSignupOTP` - Line 60
2. `sendPasswordResetOTP` - Line 125
3. `sendWelcomeEmail` - Line 188
4. (New) `sendProfileUpdateEmail` - Line ~240

### 2.2. Profile Update Notification Email

#### 2.2.1. Add New Email Method
**File**: `Fluentify-Backend/src/utils/emailService.js`
**Location**: After `sendWelcomeEmail` method (~line 237)

```javascript
/**
 * Send profile update notification email
 */
async sendProfileUpdateEmail(email, name, updateDetails) {
  const mailOptions = {
    from: `"Fluentify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Profile Updated - Fluentify',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Profile Updated</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your Fluentify profile has been successfully updated.</p>
            
            <div class="info-box">
              <strong>Updated Information:</strong>
              ${updateDetails.map(detail => `<p>• ${detail}</p>`).join('')}
            </div>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share your account credentials with anyone.
            </div>
            
            <p>Best regards,<br>The Fluentify Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Profile update email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending profile update email:', error);
    // Don't throw error as this is non-critical
    return { success: false };
  }
}
```

#### 2.2.2. Update Profile Controller
**File**: `Fluentify-Backend/src/controllers/authController.js`
**Method**: `updateProfile` (around line 417)
**Change**: Add email notification AFTER successful update

```javascript
// After line 451 (after successful profile update):
res.json(successResponse({ user: updatedProfile }, 'Profile updated successfully'));

// ADD THIS:
// Send profile update notification email (non-blocking)
const updateDetails = [];
if (name) {
  updateDetails.push(`Name: Updated to "${name.trim()}"`);
}
emailService.sendProfileUpdateEmail(updatedProfile.email, name.trim(), updateDetails)
  .catch(err => console.error('Failed to send profile update email:', err));
```

**Important**: 
- Place this AFTER sending the response (non-blocking)
- Only send if there are actual updates to notify about
- Import `emailService` at top if not already imported

### Summary of Files to Modify
**Backend**:
- `src/utils/emailService.js` - Add sender name to all emails, add new method
- `src/controllers/authController.js` - Add email notification call

---

## TASK 3: Bug Fix - Admin Logout on 'User Management' Click

### Problem Analysis

**Root Cause**: The "User Management" button in AdminDashboard has `path: '#'` and `disabled: true`. However, there may be a navigation attempt happening. 

**Investigation Needed**:
1. Check if the button is actually being clicked despite `disabled`
2. Check if there's navigation logic that's interfering
3. The path `#` could cause issues

**Most Likely Cause**: Looking at the AdminDashboard code, the button should be disabled and should not navigate. But there might be an issue with:
- Event propagation
- The `disabled` attribute not working as expected
- Potential race condition

### Actual Issue
Looking at line 23 in AdminDashboard.jsx:
```javascript
path: '#',
```

When clicking a disabled button with `#`, depending on how React handles it, it might trigger navigation to `#` which could cause issues with routing.

### Direct Code Fix

**File**: `Fluentify-Frontend/src/modules/admin/AdminDashboard.jsx`
**Line**: 88-107 (the dashboard cards map)

**CURRENT**:
```javascript
return (
  <button
    key={card.title}
    onClick={() => !card.disabled && navigate(card.path)}
    disabled={card.disabled}
    className={`bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-lg transition-all ${
      card.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
    }`}
  >
```

**CHANGE TO**:
```javascript
return (
  <button
    key={card.title}
    onClick={(e) => {
      e.preventDefault(); // Prevent default action
      if (!card.disabled && card.path !== '#') { // Extra safety check
        navigate(card.path);
      }
    }}
    disabled={card.disabled}
    className={`bg-white border border-gray-200 rounded-lg p-6 text-left transition-all ${
      card.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:border-blue-300 cursor-pointer'
    }`}
  >
```

**Key Changes**:
1. Add `e.preventDefault()` to stop any default link behavior
2. Add `card.path !== '#'` check as extra safety
3. Moved `hover:shadow-lg` to only apply when not disabled
4. Added `cursor-pointer` when not disabled for better UX

---

## TASK 4: Forgot/Reset Password Role Lock & Persistence

### Current State
- Login page has role selector (learner/admin)
- ForgotPassword component has its own role selector
- No role persistence between pages

### 4.1. Pass Role from Login to ForgotPassword

#### 4.1.1. Update Login Page
**File**: `Fluentify-Frontend/src/modules/auth/Login.jsx`
**Line**: ~110 (Forgot password button)

**CURRENT**:
```javascript
<button
  type="button"
  onClick={() => navigate('/forgot-password')}
  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
>
  Forgot password?
</button>
```

**CHANGE TO**:
```javascript
<button
  type="button"
  onClick={() => navigate(`/forgot-password?role=${form.role}`)}
  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
>
  Forgot password?
</button>
```

### 4.2. Read Role Parameter and Lock UI in ForgotPassword

#### 4.2.1. Read URL Parameter
**File**: `Fluentify-Frontend/src/modules/auth/ForgotPassword.jsx`
**Change**: Add useSearchParams import and logic

**Add import** (line 1):
```javascript
import { useNavigate, useSearchParams } from 'react-router-dom';
```

**Add after existing imports** (around line 11):
```javascript
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const lockedRole = searchParams.get('role'); // Get role from URL
  
  const [form, setForm] = useState({ 
    email: '', 
    role: lockedRole || 'learner', // Initialize with locked role
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
```

#### 4.2.2. Lock Role Selector UI
**File**: `Fluentify-Frontend/src/modules/auth/ForgotPassword.jsx`
**Line**: ~157 (Role selector in Step 1)

**CURRENT**:
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a</label>
  <select
    name="role"
    value={form.role}
    onChange={handleChange}
    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
  >
    <option value="learner">Learner</option>
    <option value="admin">Admin</option>
  </select>
</div>
```

**CHANGE TO**:
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    I am a
    {lockedRole && <span className="ml-2 text-xs text-gray-500">(locked)</span>}
  </label>
  <select
    name="role"
    value={form.role}
    onChange={handleChange}
    disabled={!!lockedRole}
    className={`w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ${
      lockedRole ? 'opacity-60 cursor-not-allowed' : ''
    }`}
  >
    <option value="learner">Learner</option>
    <option value="admin">Admin</option>
  </select>
  {lockedRole && (
    <p className="mt-1 text-xs text-gray-500">Role locked from login page</p>
  )}
</div>
```

### 4.3. Maintain Role Through Reset Process

**File**: `Fluentify-Frontend/src/modules/auth/ForgotPassword.jsx`
**No changes needed** - The role is already in `form.role` state and will be passed through all steps since we're not allowing changes.

### 4.4. Redirect to Login with Role Preset

#### 4.4.1. Update Success Step Redirect
**File**: `Fluentify-Frontend/src/modules/auth/ForgotPassword.jsx`
**Line**: ~354 (Go to Login button in Success step)

**CURRENT**:
```javascript
<Button
  onClick={() => navigate('/login')}
  variant="success"
  className="w-full"
>
  Go to Login
</Button>
```

**CHANGE TO**:
```javascript
<Button
  onClick={() => navigate(`/login?role=${form.role}`)}
  variant="success"
  className="w-full"
>
  Go to Login
</Button>
```

### 4.5. Read Role Parameter in Login Page

#### 4.5.1. Update Login to Read URL Parameter
**File**: `Fluentify-Frontend/src/modules/auth/Login.jsx`
**Changes**: Add useSearchParams and set initial role

**Add import** (line 1):
```javascript
import { useNavigate, useSearchParams } from 'react-router-dom';
```

**Modify Login component** (around line 9):
```javascript
const Login = () => {
  const [searchParams] = useSearchParams();
  const presetRole = searchParams.get('role'); // Get role from URL
  
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    role: presetRole || 'learner' // Initialize with preset role
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
```

**Note**: The role selector will already show the correct value since it's bound to `form.role`. Users can still change it if needed.

### Summary of Files to Modify
**Frontend**:
- `src/modules/auth/Login.jsx` - Add useSearchParams, read role param, pass to forgot-password
- `src/modules/auth/ForgotPassword.jsx` - Add useSearchParams, lock role UI, pass to login redirect

---

## Implementation Order & Testing

### Recommended Order
1. **Task 3** (Bug Fix) - Quick fix, test immediately
2. **Task 2** (Email) - Straightforward changes
3. **Task 1** (OTP) - More complex but isolated
4. **Task 4** (Role Lock) - Medium complexity, affects user flow

### Testing Checklist

**Task 1**:
- [ ] OTP expires after 2 minutes
- [ ] Cannot resend within 60 seconds
- [ ] Countdown displays correctly
- [ ] Works for both signup and password reset

**Task 2**:
- [ ] Emails show "Fluentify" as sender name
- [ ] Profile update email sent on name change
- [ ] Email formatting correct

**Task 3**:
- [ ] User Management button doesn't cause logout
- [ ] No navigation when disabled
- [ ] Other disabled buttons work correctly

**Task 4**:
- [ ] Role persists from login to forgot-password
- [ ] Role locked in forgot-password when from login
- [ ] Role persists back to login after reset
- [ ] Role can be changed on login page

---

## Notes

- All changes follow existing code patterns
- No database migrations needed (Task 1 uses existing table)
- No new dependencies required
- Backward compatible with existing functionality
- Frontend changes use React patterns already in codebase

