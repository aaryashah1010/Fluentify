# 📧 Email Configuration Guide - Send Real OTPs

## ✅ What Was Done

I've configured the system to send **real emails** to users! Now OTPs will be delivered to their actual email inbox.

### **Changes Made:**
1. ✅ Installed `nodemailer` package
2. ✅ Updated `otpService.js` to send real emails
3. ✅ Created beautiful HTML email template
4. ✅ Added fallback to console if email not configured

---

## 🚀 Quick Setup (Gmail)

### **Step 1: Get Gmail App Password**

You need a Gmail account and an **App Password** (not your regular password).

#### **How to Generate Gmail App Password:**

1. **Go to your Google Account:**
   - Visit: https://myaccount.google.com/

2. **Enable 2-Step Verification:**
   - Go to Security → 2-Step Verification
   - Follow the steps to enable it (required for app passwords)

3. **Generate App Password:**
   - Go to Security → 2-Step Verification → App passwords
   - Or direct link: https://myaccount.google.com/apppasswords
   
4. **Create New App Password:**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name it: **Fluentify Backend**
   - Click **Generate**

5. **Copy the 16-character password:**
   ```
   Example: abcd efgh ijkl mnop
   ```
   - **Save this!** You'll need it in the next step

---

### **Step 2: Add Credentials to .env File**

1. **Navigate to Backend folder:**
   ```bash
   cd "d:\Btech ICT\SEM - V\IT314 - Software Engineering\Software Project\Fluentify-1\Fluentify-Backend"
   ```

2. **Open `.env` file** (or create if it doesn't exist)

3. **Add these lines:**
   ```env
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

   **Replace with your actual values:**
   - `EMAIL_USER`: Your Gmail address (e.g., `fluentify.app@gmail.com`)
   - `EMAIL_PASSWORD`: The 16-character app password you generated

4. **Save the file**

---

### **Step 3: Restart Backend**

```bash
# If using npm:
# Stop the server (Ctrl+C)
npm run dev

# If using Docker:
docker-compose restart backend
```

---

## 🎯 Test Email Sending

### **Test 1: Direct API Test**

```bash
curl -X POST http://localhost:5000/api/email-verification/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-test-email@gmail.com\",\"name\":\"Test User\"}"
```

**Expected:**
- ✅ Backend console shows: "✅ Email sent successfully"
- ✅ Email arrives in your inbox within seconds
- ✅ Beautiful HTML email with OTP code

---

### **Test 2: Full Signup Flow**

1. **Go to signup page:**
   ```
   http://localhost:5173/signup
   ```

2. **Fill the form:**
   - Name: Your Name
   - Email: **Your real email address**
   - Password: Test@123
   - Role: Learner

3. **Click "Sign Up"**

4. **Check your email inbox:**
   - Look for email from your configured Gmail
   - Subject: "Verify Your Email - Fluentify"
   - Beautiful HTML email with 6-digit OTP

5. **Enter OTP on verification page**

6. **Success!** ✅

---

## 📧 Email Template Preview

Your users will receive a beautiful email like this:

```
┌─────────────────────────────────────┐
│         🎓 Fluentify                │
│    Language Learning Platform       │
├─────────────────────────────────────┤
│                                     │
│  Welcome, John Doe! 👋              │
│                                     │
│  Thank you for signing up with      │
│  Fluentify! Please verify your      │
│  email address.                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Your Verification Code      │   │
│  │                             │   │
│  │      1  2  3  4  5  6       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⏰ This code expires in 2 minutes  │
│                                     │
│  🔒 Security Tip: Never share this  │
│  code with anyone.                  │
│                                     │
├─────────────────────────────────────┤
│  © 2025 Fluentify. All rights      │
│  reserved.                          │
└─────────────────────────────────────┘
```

---

## 🔧 Configuration Options

### **Option 1: Gmail (Recommended for Testing)**

**Pros:**
- ✅ Free
- ✅ Easy to set up
- ✅ Reliable
- ✅ Good for development/testing

**Cons:**
- ❌ Daily sending limit (500 emails/day)
- ❌ Not ideal for production

**Setup:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

### **Option 2: SendGrid (Recommended for Production)**

**Pros:**
- ✅ Free tier: 100 emails/day
- ✅ Professional
- ✅ Better deliverability
- ✅ Email analytics

**Cons:**
- ❌ Requires account signup
- ❌ API key needed

**Setup:**
1. Sign up at https://sendgrid.com/
2. Get API key
3. Install: `npm install @sendgrid/mail`
4. Update code to use SendGrid

---

### **Option 3: AWS SES (For Large Scale)**

**Pros:**
- ✅ Very cheap ($0.10 per 1000 emails)
- ✅ Highly scalable
- ✅ Enterprise-grade

**Cons:**
- ❌ More complex setup
- ❌ Requires AWS account

---

## 🐛 Troubleshooting

### **Issue 1: "Invalid login" error**

**Cause:** Using regular Gmail password instead of App Password

**Solution:**
1. Generate App Password (see Step 1 above)
2. Use the 16-character app password, not your regular password
3. Make sure 2-Step Verification is enabled

---

### **Issue 2: Email not received**

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Email address is correct
3. ✅ Backend logs show "✅ Email sent successfully"
4. ✅ No errors in backend console

**Debug:**
```bash
# Check backend logs
docker-compose logs backend | grep "Email"

# Look for:
# ✅ Email sent successfully
# OR
# ❌ Error sending OTP email
```

---

### **Issue 3: "⚠️ Email credentials not configured"**

**Cause:** `.env` file missing or variables not set

**Solution:**
1. Check `.env` file exists in Backend folder
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
3. Restart backend after adding variables

---

### **Issue 4: Gmail blocks the login**

**Cause:** Gmail security blocking "less secure app"

**Solution:**
1. Make sure you're using **App Password**, not regular password
2. Enable 2-Step Verification
3. Generate new App Password
4. Try from a different Gmail account

---

## 📊 How It Works

### **Flow Diagram:**

```
User Signup
    ↓
Backend creates account
    ↓
Backend calls sendOTPEmail()
    ↓
Check if EMAIL_USER & EMAIL_PASSWORD exist
    ↓
    ├─ YES → Send real email via Gmail
    │         ├─ Create nodemailer transporter
    │         ├─ Build HTML email
    │         ├─ Send via Gmail SMTP
    │         └─ Log success ✅
    │
    └─ NO  → Log warning ⚠️
              └─ OTP only in console (fallback)
    ↓
Return success to frontend
    ↓
User receives email
    ↓
User enters OTP
    ↓
Verification complete ✅
```

---

## 🔒 Security Best Practices

### **DO:**
✅ Use App Password, not regular password  
✅ Keep `.env` file in `.gitignore`  
✅ Never commit credentials to Git  
✅ Use environment variables  
✅ Rotate App Password periodically  

### **DON'T:**
❌ Share App Password  
❌ Commit `.env` to repository  
❌ Use regular Gmail password  
❌ Hardcode credentials in code  
❌ Use same password for multiple services  

---

## 📝 .env File Template

Create/update your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fluentify

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Nodemailer installed (`npm list nodemailer`)
- [ ] `.env` file created in Backend folder
- [ ] `EMAIL_USER` set to your Gmail
- [ ] `EMAIL_PASSWORD` set to App Password (16 chars)
- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] Backend restarted after adding credentials
- [ ] Test email sent successfully
- [ ] Email received in inbox
- [ ] OTP works for verification
- [ ] No errors in backend logs

---

## 🎉 Success Indicators

### **When Everything Works:**

**Backend Console:**
```
========================================
📧 SENDING EMAIL VERIFICATION OTP
========================================
To: user@gmail.com
Name: John Doe
OTP Code: 123456
Valid for: 2 minutes
========================================

✅ Email sent successfully to user@gmail.com
```

**User's Email Inbox:**
- ✅ Email from your configured Gmail
- ✅ Subject: "Verify Your Email - Fluentify"
- ✅ Beautiful HTML template
- ✅ 6-digit OTP clearly visible
- ✅ 2-minute expiry notice
- ✅ Security tips included

**Frontend:**
- ✅ User redirected to verification page
- ✅ Can enter OTP
- ✅ Verification succeeds
- ✅ Redirected to dashboard

---

## 🚀 Quick Start Commands

```bash
# 1. Install nodemailer (already done)
npm install nodemailer

# 2. Create .env file
cd Fluentify-Backend
notepad .env

# 3. Add credentials:
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password

# 4. Restart backend
npm run dev

# 5. Test
curl -X POST http://localhost:5000/api/email-verification/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@gmail.com\",\"name\":\"Test\"}"

# 6. Check your email!
```

---

## 📞 Need Help?

### **Common Questions:**

**Q: Do I need a special Gmail account?**  
A: No, any Gmail account works. But consider creating a dedicated one for the app.

**Q: Is App Password safe?**  
A: Yes! It's more secure than using your regular password. It's app-specific and can be revoked anytime.

**Q: What if I don't have Gmail?**  
A: You can use Outlook, Yahoo, or any SMTP service. Just change the `service` in the code.

**Q: Will this work in production?**  
A: For small scale, yes. For production, consider SendGrid or AWS SES for better deliverability.

**Q: How many emails can I send?**  
A: Gmail: 500/day. For more, use SendGrid (100/day free) or AWS SES (cheap, unlimited).

---

## 🎯 Summary

### **What You Get:**

✅ **Real email sending** - OTPs delivered to user's inbox  
✅ **Beautiful HTML template** - Professional-looking emails  
✅ **Fallback to console** - Works even without email config  
✅ **Easy setup** - Just add 2 lines to `.env`  
✅ **Secure** - Uses App Password, not regular password  
✅ **Production-ready** - Can switch to SendGrid/SES easily  

### **Next Steps:**

1. Generate Gmail App Password
2. Add to `.env` file
3. Restart backend
4. Test signup flow
5. Check email inbox
6. Celebrate! 🎉

**Your users will now receive OTPs directly in their email!** 📧✨
