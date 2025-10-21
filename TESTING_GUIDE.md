# 🧪 Testing Guide - Email Verification & Forgot Password

## ✅ Issues Fixed

### 1. **Email Verification Route Added**
- ✅ Added `/email-verification` route in `App.jsx`
- ✅ Signup now redirects to email verification page
- ✅ Works for both Learner and Admin roles

### 2. **Forgot Password Link Added**
- ✅ Added "Forgot Password?" link on login page
- ✅ Link appears next to password label
- ✅ Navigates to `/forgot-password` route

---

## 🚀 How to Test

### **Prerequisites**
1. Backend running on `http://localhost:5000`
2. Frontend running on `http://localhost:5173` or `http://localhost:3000`
3. Database migration completed (`02-email-verification.sql`)

---

## Test 1: Signup with Email Verification (Learner)

### Steps:
1. **Navigate to Signup Page**
   - Go to `http://localhost:5173/signup`

2. **Fill Signup Form**
   - Name: "John Doe" (no numbers/special chars)
   - Email: "test@gmail.com" (use real email provider)
   - Password: "Test@123" (strong password)
   - Role: Select "Learner"

3. **Submit Form**
   - Click "Sign Up"
   - Account created in backend

4. **Email Verification Page**
   - Should automatically redirect to `/email-verification`
   - See 6-digit OTP input boxes
   - Timer shows 2:00 (2 minutes)

5. **Check Backend Console**
   - Look for OTP in backend terminal:
   ```
   ========================================
   📧 EMAIL VERIFICATION OTP
   ========================================
   To: test@gmail.com
   Name: John Doe
   OTP Code: 123456
   Valid for: 2 minutes
   ========================================
   ```

6. **Enter OTP**
   - Type the 6-digit code
   - Click "Verify Email"

7. **Success**
   - See success message
   - Redirect to `/preferences` (for learner)

### Expected Results:
✅ Signup creates account  
✅ OTP sent automatically  
✅ Redirects to email verification  
✅ OTP expires in 2 minutes  
✅ Can resend after 30 seconds  
✅ Max 3 verification attempts  
✅ After verification → Preferences page

---

## Test 2: Signup with Email Verification (Admin)

### Steps:
1. **Navigate to Signup Page**
   - Go to `http://localhost:5173/signup`

2. **Fill Signup Form**
   - Name: "Admin User"
   - Email: "admin@gmail.com"
   - Password: "Admin@123"
   - Role: Select "Admin"

3. **Submit Form**
   - Click "Sign Up"

4. **Email Verification**
   - Redirects to `/email-verification`
   - Check backend console for OTP
   - Enter OTP

5. **Success**
   - Redirect to `/admin-dashboard` (for admin)

### Expected Results:
✅ Same verification flow as learner  
✅ After verification → Admin Dashboard

---

## Test 3: Forgot Password Flow

### Steps:
1. **Navigate to Login Page**
   - Go to `http://localhost:5173/login`

2. **Click "Forgot Password?"**
   - Link appears next to password label
   - Navigates to `/forgot-password`

3. **Enter Email**
   - Type registered email: "test@gmail.com"
   - Click "Send OTP"

4. **Check Backend Console**
   - Look for OTP code

5. **Enter OTP**
   - Type 6-digit code
   - Click "Verify OTP"
   - OTP expires in 2 minutes
   - Max 3 attempts

6. **Create New Password**
   - Enter new password: "NewPass@123"
   - Confirm password: "NewPass@123"
   - Click "Reset Password"

7. **Success**
   - See success message
   - Redirect to `/login`

8. **Login with New Password**
   - Use new password to login
   - Should work!

### Expected Results:
✅ Forgot password link visible  
✅ OTP sent to email  
✅ OTP verification works  
✅ Password reset successful  
✅ Can login with new password

---

## Test 4: OTP Limits

### Test 4.1: Resend Cooldown (30 seconds)
1. Request OTP
2. Try to resend immediately → Should show "Wait 30 seconds"
3. Wait 30 seconds
4. Resend button becomes active
5. Can request new OTP

### Test 4.2: Max Attempts (3 per OTP)
1. Request OTP
2. Enter wrong OTP → Attempt 1
3. Enter wrong OTP → Attempt 2
4. Enter wrong OTP → Attempt 3
5. Try again → "Maximum attempts exceeded"
6. Must request new OTP

### Test 4.3: Daily Limit (3 OTPs per email)
1. Request OTP #1 → Success
2. Wait 30 seconds, request OTP #2 → Success
3. Wait 30 seconds, request OTP #3 → Success
4. Wait 30 seconds, request OTP #4 → **Blocked!**
5. Error: "Maximum OTP generation limit reached (3 per day)"

### Test 4.4: OTP Expiry (2 minutes)
1. Request OTP
2. Wait 2 minutes
3. Try to verify → "OTP has expired"
4. Must request new OTP

---

## Test 5: Name Validation

### Valid Names:
✅ "John Doe"  
✅ "Mary-Jane Watson"  
✅ "O'Connor"  
✅ "José García"

### Invalid Names:
❌ "John123" → Error: "Name cannot contain numbers"  
❌ "User@123" → Error: "Name can only contain letters..."  
❌ "Test#Name" → Error: "Name can only contain letters..."  
❌ "A" → Error: "Name must be at least 2 characters"

---

## Test 6: Disposable Email Detection

### Try These Disposable Emails:
❌ "test@tempmail.com"  
❌ "user@10minutemail.com"  
❌ "fake@guerrillamail.com"  
❌ "temp@yopmail.com"

### Expected Result:
Error: "Temporary or disposable email addresses are not allowed"

### Valid Emails:
✅ "test@gmail.com"  
✅ "user@outlook.com"  
✅ "admin@yahoo.com"  
✅ "learner@icloud.com"

---

## 🐛 Troubleshooting

### Issue: "Failed to resolve import 'axios'"
**Solution:** Run `npm install axios` in Frontend folder

### Issue: Email verification page not showing
**Solution:** 
- Check if routes added in `App.jsx`
- Restart frontend dev server

### Issue: OTP not showing in console
**Solution:**
- Check backend is running
- Check backend console (not frontend)
- Verify API endpoint: `http://localhost:5000/api/email-verification/send-otp`

### Issue: "User not found" on forgot password
**Solution:**
- User must be registered first
- Use same email from signup

### Issue: Routes not working
**Solution:**
1. Stop frontend server (Ctrl+C)
2. Run `npm install` in Frontend folder
3. Restart: `npm run dev` or `npm start`

---

## 📊 Quick Reference

### OTP Settings
| Setting | Value |
|---------|-------|
| Validity | 2 minutes |
| Resend Cooldown | 30 seconds |
| Max Attempts | 3 |
| Daily Limit | 3 OTPs |

### API Endpoints
| Endpoint | Purpose |
|----------|---------|
| POST `/api/auth/signup-learner` | Signup learner |
| POST `/api/auth/signup-admin` | Signup admin |
| POST `/api/email-verification/send-otp` | Send verification OTP |
| POST `/api/email-verification/verify-otp` | Verify OTP |
| POST `/api/forgot-password/send-otp` | Send reset OTP |
| POST `/api/forgot-password/verify-otp` | Verify reset OTP |
| POST `/api/forgot-password/reset-password` | Reset password |

### Routes
| Route | Page |
|-------|------|
| `/signup` | Signup page |
| `/login` | Login page |
| `/email-verification` | OTP verification |
| `/forgot-password` | Password reset |
| `/preferences` | Learner preferences |
| `/dashboard` | Learner dashboard |
| `/admin-dashboard` | Admin dashboard |

---

## ✅ Checklist

Before testing, ensure:
- [ ] Backend running (`npm run dev` in Backend folder)
- [ ] Frontend running (`npm run dev` in Frontend folder)
- [ ] Database migration completed
- [ ] Axios installed (`npm install axios` in Frontend)
- [ ] Routes added in `App.jsx`
- [ ] "Forgot Password" link visible on login page

---

## 🎉 All Features Working!

If all tests pass:
- ✅ Email verification works for both learner and admin
- ✅ Forgot password flow complete
- ✅ OTP limits enforced (2min, 30s, 3 attempts, 3 daily)
- ✅ Name validation working
- ✅ Disposable email detection working
- ✅ Password strength validation working

**Your authentication system is production-ready!** 🚀
