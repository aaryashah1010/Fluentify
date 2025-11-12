# 🐳 Start Backend with Docker - Simple Steps

## Step 1: Make Sure Docker is Running

Open Docker Desktop and wait for it to start.

---

## Step 2: Create .env File (If Not Already Done)

In `Fluentify-Backend` folder, create `.env` file:

```env
# Database (Docker defaults - don't change these)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fluentify
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret
JWT_SECRET=your_secret_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy the 16-character password
6. Use it as `EMAIL_PASS` above

---

## Step 3: Start Everything

Open terminal in `Fluentify-Backend` folder:

```bash
docker-compose up --build
```

**Wait for these messages:**
```
fluentify-postgres | database system is ready to accept connections
fluentify-backend  | 🚀 Server running at http://localhost:5000
```

---

## Step 4: Test It Works

Open browser: `http://localhost:5000/health`

Should see:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

✅ **Success! Backend is running!**

---

## To Stop:

Press `Ctrl+C` in the terminal

Or run:
```bash
docker-compose down
```

---

## Next Time (After First Setup):

Just run:
```bash
docker-compose up
```

(No need for `--build` unless you change dependencies)

---

## Common Issues:

### "Port 5000 is already in use"

**Solution:**
```bash
docker-compose down
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
docker-compose up
```

### "Cannot connect to Docker daemon"

**Solution:** Start Docker Desktop

### "Database connection failed"

**Solution:** Wait 30 seconds for database to initialize

### "Email not sending"

**Solution:** 
- Check `.env` has `EMAIL_USER` and `EMAIL_PASS`
- Restart: `docker-compose restart`

---

## View Logs:

```bash
docker-compose logs -f
```

---

## Reset Everything (Fresh Start):

```bash
docker-compose down -v
docker-compose up --build
```

⚠️ **Warning:** This deletes all database data!

---

That's it! Your backend should now be running on `http://localhost:5000`

For more details, see `DOCKER_SETUP.md`
