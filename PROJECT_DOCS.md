## From DEBUG_STEPS.md

---

# Debug Steps for "Failed to Fetch" Error

## Issue: Frontend cannot connect to backend

### Step 1: Check if Backend is Running

Open terminal in `Fluentify-Backend` folder and run:
```bash
npm run dev
```

**Expected output:**
```
🚀 Server running at http://localhost:5000
🌍 Environment: development
```

**Test backend directly:**
Open browser and go to: `http://localhost:5000/health`

Should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-30T..."
}
```

### Step 2: Check Frontend API URL

Open `Fluentify-Frontend/src/api/apiHelpers.js`

Line 7 should be:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Step 3: Test API Endpoint Manually

Open browser console (F12) and run:
```javascript
fetch('http://localhost:5000/api/auth/password-suggestions')
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

Should see password suggestions in console.

### Step 4: Check CORS Configuration

In `Fluentify-Backend/src/server.js`, verify CORS includes your frontend URL:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000','http://localhost:5174','http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Step 5: Run Database Migration

If you haven't run the migration yet:

```bash
cd Fluentify-Backend
node scripts/runAuthMigration.js
```

Or manually:
```bash
psql -U your_username -d fluentify -f src/database/03-auth-enhancements.sql
```

### Step 6: Check Environment Variables

Verify `.env` file in `Fluentify-Backend` has:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluentify
DB_USER=your_db_username
DB_PASSWORD=your_db_password

JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 7: Test Signup API Directly

Using Postman or browser console:

```javascript
fetch('http://localhost:5000/api/auth/signup/learner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@123456'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Step 8: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to signup
4. Look for errors

Common errors:
- **CORS error**: Backend CORS not configured
- **Failed to fetch**: Backend not running
- **404 Not Found**: Wrong API endpoint
- **500 Server Error**: Check backend console

### Step 9: Check Backend Console

When you try to signup, backend console should show:
```
POST /api/auth/signup/learner
```

If you see errors, they will appear here.

### Step 10: Restart Both Servers

Sometimes a simple restart fixes issues:

**Backend:**
```bash
cd Fluentify-Backend
# Press Ctrl+C to stop
npm run dev
```

**Frontend:**
```bash
cd Fluentify-Frontend
# Press Ctrl+C to stop
npm run dev
```

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch"
**Cause**: Backend not running or wrong URL
**Solution**: 
- Start backend: `npm run dev` in Fluentify-Backend
- Check URL in apiHelpers.js

### Issue 2: CORS Error
**Cause**: Frontend URL not in CORS whitelist
**Solution**: Add your frontend URL to server.js CORS config

### Issue 3: 500 Server Error
**Cause**: Database not connected or migration not run
**Solution**: 
- Check PostgreSQL is running
- Run database migration
- Check .env database credentials

### Issue 4: Password Suggestions Not Working
**Cause**: Error response structure not matching
**Solution**: Already fixed in SignupWithOTP.jsx (checks err.data.suggestions)

### Issue 5: Email Not Sending
**Cause**: Gmail credentials not configured
**Solution**: 
- Generate Gmail App Password
- Add to .env as EMAIL_PASS
- Restart backend

---

## Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5000/health
- [ ] Database migration completed
- [ ] .env file configured
- [ ] No CORS errors in browser console
- [ ] Can see API requests in Network tab

---

## If Still Not Working

1. Check backend console for errors
2. Check browser console for errors
3. Check Network tab in DevTools
4. Verify database is running: `psql -U your_username -d fluentify -c "SELECT 1"`
5. Try restarting PostgreSQL service
6. Clear browser cache and localStorage
7. Try in incognito/private mode

---

## Contact Points

If you're still stuck, check:
1. Backend console output
2. Browser console errors
3. Network tab (F12 → Network) to see actual requests/responses
4. PostgreSQL logs

Provide these details when asking for help!


## From EMAIL_SETUP_GUIDE.md

---

# Email OTP Setup & Troubleshooting Guide

## 🚨 Problem: OTP Not Received & Resend OTP Fails

### Quick Fix Checklist:

- [ ] Email credentials configured in `.env`
- [ ] Using Gmail App Password (not regular password)
- [ ] Backend server restarted after adding credentials
- [ ] Check spam/junk folder
- [ ] Check backend console for errors

---

## 📧 Step 1: Configure Email in .env

### Location: `Fluentify-Backend/.env`

Add these lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**IMPORTANT**: 
- `EMAIL_PASS` must be a Gmail **App Password**, NOT your regular Gmail password
- App Password is a 16-character code like: `abcd efgh ijkl mnop`

---

## 🔑 Step 2: Get Gmail App Password

### Method 1: Using Google Account

1. Go to: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Under "How you sign in to Google", enable **2-Step Verification** (if not already enabled)
4. Go back to **Security**
5. Click **App Passwords** (under "How you sign in to Google")
6. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
7. Enter name: "Fluentify"
8. Click **Generate**
9. Copy the 16-character password (remove spaces)
10. Paste it as `EMAIL_PASS` in `.env`

### Method 2: Direct Link

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if needed
3. Select "Mail" and "Other"
4. Name it "Fluentify"
5. Click Generate
6. Copy the password
7. Add to `.env` file

---

## 📝 Step 3: Complete .env Configuration

Your `.env` file should look like this:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fluentify
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your_secret_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d

# Email Configuration (REQUIRED FOR OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Replace**:
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with your 16-character App Password (no spaces)

---

## 🔄 Step 4: Restart Backend

After adding email credentials, you MUST restart the backend:

```bash
# If using Docker
docker-compose restart

# If using npm
# Press Ctrl+C to stop
npm run dev
```

---

## ✅ Step 5: Verify Email Configuration

When backend starts, you should see:

```
✅ Email service connected successfully
   Using email: your-email@gmail.com
```

If you see this instead:

```
❌ EMAIL CONFIGURATION ERROR:
   EMAIL_USER: ✗ Missing
   EMAIL_PASS: ✗ Missing
```

**Solution**: Check your `.env` file and restart backend

---

## 🧪 Step 6: Test OTP Sending

### Test Signup OTP:

1. Go to `http://localhost:5173/signup`
2. Fill the form
3. Click "Continue to Verification"
4. Check backend console for:

```
📧 Sending signup OTP to: user@example.com
✅ Signup OTP sent successfully to user@example.com
   Message ID: <some-id>
```

### If You See Error:

```
❌ Failed to send signup OTP to user@example.com:
   Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solution**: You're using regular password, not App Password. Get App Password from Step 2.

---

## 🔍 Common Errors & Solutions

### Error 1: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause**: Using regular Gmail password instead of App Password

**Solution**:
1. Generate Gmail App Password (see Step 2)
2. Update `EMAIL_PASS` in `.env`
3. Restart backend

### Error 2: "Failed to resend OTP"

**Cause**: Email service not configured or connection failed

**Solution**:
1. Check `.env` has `EMAIL_USER` and `EMAIL_PASS`
2. Verify App Password is correct
3. Restart backend
4. Check backend console for email errors

### Error 3: "self signed certificate in certificate chain"

**Cause**: Network/firewall blocking Gmail SMTP

**Solution**: Add to email service configuration:
```javascript
this.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});
```

### Error 4: OTP email goes to spam

**Solution**:
1. Check spam/junk folder
2. Mark as "Not Spam"
3. Add sender to contacts
4. Future emails should go to inbox

### Error 5: "Connection timeout"

**Cause**: Firewall or antivirus blocking port 587/465

**Solution**:
1. Check firewall settings
2. Allow Gmail SMTP (smtp.gmail.com)
3. Temporarily disable antivirus to test

---

## 📊 Backend Console Logs

### Successful Email Sending:

```
✅ Email service connected successfully
   Using email: your-email@gmail.com
📧 Sending signup OTP to: user@example.com
✅ Signup OTP sent successfully to user@example.com
   Message ID: <abc123@gmail.com>
```

### Failed Email Configuration:

```
❌ EMAIL CONFIGURATION ERROR:
   EMAIL_USER: ✗ Missing
   EMAIL_PASS: ✗ Missing
   Please add EMAIL_USER and EMAIL_PASS to your .env file
```

### Failed Email Sending:

```
📧 Sending signup OTP to: user@example.com
❌ Failed to send signup OTP to user@example.com:
   Error: Invalid login: 535-5.7.8 Username and Password not accepted
   Code: EAUTH
```

---

## 🔧 Advanced Troubleshooting

### Check Email Service Connection

Add this test endpoint to `src/server.js`:

```javascript
app.get('/test-email', async (req, res) => {
  try {
    await emailService.transporter.verify();
    res.json({ success: true, message: 'Email service is working' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Then visit: `http://localhost:5000/test-email`

### Manual Email Test

```javascript
// Add to authController.js temporarily
async testEmail(req, res) {
  try {
    const otp = emailService.generateOTP();
    await emailService.sendSignupOTP('your-test-email@gmail.com', 'Test User', otp);
    res.json({ success: true, message: 'Test email sent', otp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

---

## 📱 Alternative: Use Different Email Service

If Gmail doesn't work, you can use other services:

### Using Outlook/Hotmail:

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

Update `emailService.js`:
```javascript
this.transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Using Custom SMTP:

```javascript
this.transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## ✅ Final Verification Checklist

Before testing OTP:

- [ ] `.env` file has `EMAIL_USER` and `EMAIL_PASS`
- [ ] Using Gmail App Password (16 characters)
- [ ] Backend restarted after adding credentials
- [ ] Backend console shows "✅ Email service connected successfully"
-

