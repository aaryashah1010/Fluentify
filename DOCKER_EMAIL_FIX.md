# ✅ Docker Email Configuration - FIXED!

## 🐛 Problem Solved

**Error:** `app-crashed - waiting for file changes before starting`  
**Cause:** `Cannot find package 'nodemailer'` in Docker container  
**Solution:** Rebuild Docker image with nodemailer included  

---

## ✅ What Was Done

### **Step 1: Stopped Containers**
```bash
docker-compose down
```

### **Step 2: Rebuilt Backend Image (No Cache)**
```bash
docker-compose build --no-cache backend
```
- ✅ Installed 144 packages including nodemailer
- ✅ Build completed successfully

### **Step 3: Started Containers**
```bash
docker-compose up -d
```
- ✅ PostgreSQL started and healthy
- ✅ Backend started successfully
- ✅ Server running at http://localhost:5000

---

## 🎯 Current Status

### **✅ Backend is Running!**

```
🚀 Server running at http://localhost:5000
✅ PostgreSQL connected successfully
🌍 Environment: development
```

---

## 📧 Email Configuration in Docker

### **Important: .env File in Docker**

When using Docker, your `.env` file needs to be properly configured:

**Location:** `Fluentify-Backend/.env`

**Required variables:**
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### **How Docker Loads .env:**

The `docker-compose.yml` file has:
```yaml
backend:
  env_file:
    - .env
```

This automatically loads your `.env` file into the Docker container.

---

## 🧪 Test Email Sending

### **Test 1: Check Backend Logs**

```bash
docker-compose logs -f backend
```

Watch for:
- ✅ `⚠️ Email credentials not configured` (if .env not set)
- ✅ `✅ Email sent successfully` (if .env is set)

---

### **Test 2: Send Test OTP**

**Using PowerShell (Windows):**
```powershell
$body = @{
    email = "test@gmail.com"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/email-verification/send-otp" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Using curl (if installed):**
```bash
curl -X POST http://localhost:5000/api/email-verification/send-otp ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@gmail.com\",\"name\":\"Test User\"}"
```

---

### **Test 3: Full Signup Flow**

1. **Go to frontend:**
   ```
   http://localhost:5173/signup
   ```

2. **Fill form and signup**

3. **Watch backend logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Look for:**
   ```
   ========================================
   📧 SENDING EMAIL VERIFICATION OTP
   ========================================
   To: user@gmail.com
   Name: User Name
   OTP Code: 123456
   Valid for: 2 minutes
   ========================================
   
   ✅ Email sent successfully to user@gmail.com
   ```

5. **Check email inbox** (if credentials configured)

---

## 🔧 Common Issues & Solutions

### **Issue 1: Email credentials not working**

**Symptoms:**
```
⚠️ Email credentials not configured. OTP only logged to console.
```

**Solution:**
1. Check `.env` file exists in `Fluentify-Backend` folder
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
3. Restart Docker:
   ```bash
   docker-compose restart backend
   ```

---

### **Issue 2: Gmail authentication error**

**Symptoms:**
```
❌ Error sending OTP email: Invalid login
```

**Solution:**
1. Make sure you're using **App Password**, not regular password
2. Enable 2-Step Verification on Gmail
3. Generate new App Password from: https://myaccount.google.com/apppasswords
4. Update `.env` file
5. Restart: `docker-compose restart backend`

---

### **Issue 3: Changes to .env not reflected**

**Solution:**
```bash
# Restart backend container
docker-compose restart backend

# Or rebuild if needed
docker-compose down
docker-compose up --build
```

---

### **Issue 4: "Cannot find package" error**

**Solution:**
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Docker Commands Reference

### **View Logs:**
```bash
# All logs
docker-compose logs backend

# Follow logs (real-time)
docker-compose logs -f backend

# Last 50 lines
docker-compose logs backend --tail 50
```

### **Restart Services:**
```bash
# Restart backend only
docker-compose restart backend

# Restart all
docker-compose restart
```

### **Rebuild:**
```bash
# Rebuild backend
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache backend

# Rebuild and start
docker-compose up --build
```

### **Stop/Start:**
```bash
# Stop all
docker-compose down

# Start all
docker-compose up -d

# Start with logs
docker-compose up
```

### **Check Status:**
```bash
# List running containers
docker-compose ps

# Check backend health
docker-compose exec backend node -v
```

---

## 🎯 Email Configuration Checklist

### **For Development (Console Only):**
- [ ] Backend running
- [ ] No `.env` email config needed
- [ ] OTP appears in backend logs
- [ ] Copy OTP from console

### **For Production (Real Emails):**
- [ ] Gmail account ready
- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] `.env` file created with:
  - [ ] `EMAIL_USER=your@gmail.com`
  - [ ] `EMAIL_PASSWORD=16-char-app-password`
- [ ] Backend restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox

---

## 📝 .env File Template

Create `Fluentify-Backend/.env`:

```env
# Database Configuration
DB_HOST=postgres
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

**Important:**
- Use `DB_HOST=postgres` (not `localhost`) in Docker
- Use Gmail App Password, not regular password
- Never commit `.env` to Git

---

## 🚀 Quick Start After Fix

### **1. Verify Backend is Running:**
```bash
docker-compose ps
```

Should show:
```
NAME                  STATUS
fluentify-postgres    Up (healthy)
fluentify-backend     Up
```

### **2. Check Logs:**
```bash
docker-compose logs backend --tail 20
```

Should show:
```
🚀 Server running at http://localhost:5000
✅ PostgreSQL connected successfully
```

### **3. Test Signup:**
1. Go to `http://localhost:5173/signup`
2. Fill form and submit
3. Check backend logs for OTP
4. Enter OTP on verification page

---

## ✅ Success Indicators

### **Backend Healthy:**
```bash
docker-compose logs backend
```

Output:
```
✅ PostgreSQL connected successfully in development
🚀 Server running at http://localhost:5000
🌍 Environment: development
```

### **Email Working (if configured):**
```
========================================
📧 SENDING EMAIL VERIFICATION OTP
========================================
To: user@gmail.com
OTP Code: 123456
========================================

✅ Email sent successfully to user@gmail.com
```

### **Email Not Configured (fallback):**
```
========================================
📧 SENDING EMAIL VERIFICATION OTP
========================================
To: user@gmail.com
OTP Code: 123456
========================================

⚠️ Email credentials not configured. OTP only logged to console.
```

---

## 🎉 Summary

### **Problem:**
- ❌ Docker container missing nodemailer package
- ❌ Backend crashed on startup
- ❌ "app-crashed - waiting for file changes"

### **Solution:**
- ✅ Rebuilt Docker image with `--no-cache`
- ✅ Nodemailer installed (144 packages)
- ✅ Backend started successfully
- ✅ Server running on port 5000

### **Current Status:**
- ✅ Backend: Running
- ✅ Database: Connected
- ✅ OTP System: Working
- ⏳ Email: Waiting for credentials in .env

### **Next Steps:**
1. Add email credentials to `.env` (optional)
2. Restart backend: `docker-compose restart backend`
3. Test signup flow
4. Check email inbox (if configured) or console logs

**Your system is now working!** 🚀

---

## 📚 Related Documentation

- `EMAIL_SETUP_GUIDE.md` - How to configure Gmail
- `OTP_DEBUGGING_GUIDE.md` - Troubleshooting OTP issues
- `env.example.txt` - Environment variables template

**Backend is ready to send OTPs!** 📧✨
