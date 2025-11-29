# Docker Setup Guide for Fluentify Backend

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

---

## 🚀 Start Everything with One Command

```bash
cd Fluentify-Backend
docker-compose up --build
```

This will:
- ✅ Start PostgreSQL database
- ✅ Run all database migrations automatically
- ✅ Start backend server
- ✅ Set up networking between containers

**Wait for this message:**
```
fluentify-backend  | 🚀 Server running at http://localhost:5000
fluentify-backend  | 🌍 Environment: development
```

---

## 📋 Step-by-Step Setup

### Step 1: Create .env File

Create `.env` file in `Fluentify-Backend` folder:

```env
# Database (Docker uses these defaults)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fluentify
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your_secret_key_at_least_32_characters_long_for_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important**: 
- `DB_HOST=postgres` (container name, not localhost!)
- Get Gmail App Password from: Google Account → Security → App Passwords

### Step 2: Build and Start Containers

```bash
docker-compose up --build
```

**First time**: This will download images and build containers (takes 2-3 minutes)

**Subsequent runs**: Much faster (30 seconds)

### Step 3: Verify Everything is Running

**Check containers:**
```bash
docker ps
```

Should see:
```
CONTAINER ID   IMAGE                    STATUS         PORTS
xxxxx          fluentify-backend        Up 2 minutes   0.0.0.0:5000->5000/tcp
xxxxx          postgres:16-alpine       Up 2 minutes   0.0.0.0:5432->5432/tcp
```

**Test backend:**
Open browser: `http://localhost:5000/health`

Should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-30T..."
}
```

---

## 🛠️ Common Docker Commands

### Start Containers (Detached Mode)
```bash
docker-compose up -d
```

### Stop Containers
```bash
docker-compose down
```

### View Logs
```bash
# All containers
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# PostgreSQL only
docker-compose logs -f postgres
```

### Rebuild Containers
```bash
docker-compose up --build
```

### Restart Containers
```bash
docker-compose restart
```

### Stop and Remove Everything (including volumes)
```bash
docker-compose down -v
```
⚠️ **Warning**: This deletes all database data!

---

## 🔍 Troubleshooting

### Issue 1: "Port 5000 is already in use"

**Cause**: Another service using port 5000

**Solution 1**: Stop the other service
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Solution 2**: Change port in docker-compose.yml
```yaml
ports:
  - "5001:5000"  # Use 5001 instead
```

### Issue 2: "Port 5432 is already in use"

**Cause**: Local PostgreSQL running

**Solution**: Stop local PostgreSQL or change port
```yaml
ports:
  - "5433:5432"  # Use 5433 instead
```

And update `.env`:
```env
DB_PORT=5433
```

### Issue 3: "Database connection failed"

**Cause**: Database not ready yet

**Solution**: Wait 30 seconds for healthcheck, or check logs:
```bash
docker-compose logs postgres
```

### Issue 4: "Email not sending"

**Cause**: EMAIL_USER or EMAIL_PASS not set

**Solution**: 
1. Add to `.env` file
2. Restart containers: `docker-compose restart`

### Issue 5: "nodemailer not found"

**Cause**: node_modules not installed

**Solution**: Rebuild containers
```bash
docker-compose down
docker-compose up --build
```

### Issue 6: "Migration files not found"

**Cause**: SQL files not mounted

**Solution**: Check docker-compose.yml has all migration files:
```yaml
volumes:
  - ./src/database/01-tables.sql:/docker-entrypoint-initdb.d/01-tables.sql
  - ./src/database/02-tables.sql:/docker-entrypoint-initdb.d/02-tables.sql
  - ./src/database/03-auth-enhancements.sql:/docker-entrypoint-initdb.d/03-auth-enhancements.sql
```

---

## 🗄️ Database Management

### Access PostgreSQL Container
```bash
docker exec -it fluentify-postgres psql -U postgres -d fluentify
```

### Run SQL Queries
```sql
-- Check tables
\dt

-- View OTP codes
SELECT * FROM otp_codes;

-- View users
SELECT id, name, email, is_email_verified FROM learners;

-- Exit
\q
```

### Backup Database
```bash
docker exec fluentify-postgres pg_dump -U postgres fluentify > backup.sql
```

### Restore Database
```bash
docker exec -i fluentify-postgres psql -U postgres fluentify < backup.sql
```

### Reset Database (Fresh Start)
```bash
docker-compose down -v
docker-compose up --build
```

---

## 📁 Docker Files Explained

### Dockerfile
Defines how to build the backend container:
- Uses Node.js 22 Alpine (lightweight)
- Installs dependencies
- Copies source code
- Exposes port 5000
- Runs `npm run dev`

### docker-compose.yml
Orchestrates multiple containers:
- **postgres**: Database container
- **backend**: Application container
- Handles networking, volumes, environment variables

### .dockerignore
Files to exclude from Docker build:
- node_modules
- .env
- .git
- logs

---

## 🔄 Development Workflow

### 1. Start Development
```bash
docker-compose up
```

### 2. Make Code Changes
- Edit files in `src/` folder
- Nodemon auto-restarts server
- Changes reflect immediately

### 3. View Logs
```bash
docker-compose logs -f backend
```

### 4. Stop Development
```bash
# Press Ctrl+C
# Or in another terminal:
docker-compose down
```

---

## 🌐 Connect Frontend to Docker Backend

Frontend should connect to: `http://localhost:5000`

File: `Fluentify-Frontend/src/api/apiHelpers.js`
```javascript
export const API_BASE_URL = 'http://localhost:5000';
```

---

## 📊 Health Checks

### Backend Health
```bash
curl http://localhost:5000/health
```

### Database Health
```bash
docker exec fluentify-postgres pg_isready -U postgres
```

### Container Status
```bash
docker-compose ps
```

---

## 🚨 Common Errors & Solutions

### Error: "Cannot connect to Docker daemon"
**Solution**: Start Docker Desktop

### Error: "network fluentify_default not found"
**Solution**: 
```bash
docker-compose down
docker network prune
docker-compose up
```

### Error: "Container name already in use"
**Solution**:
```bash
docker rm fluentify-backend fluentify-postgres
docker-compose up
```

### Error: "Volume is in use"
**Solution**:
```bash
docker-compose down
docker volume rm fluentify-backend_postgres_data
docker-compose up
```

---

## 🎯 Production Deployment

For production, update docker-compose.yml:

```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
    command: npm start  # Use production start
```

And use production `.env`:
```env
NODE_ENV=production
JWT_SECRET=very_long_random_secret_for_production
DB_PASSWORD=strong_password_here
```

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] Docker Desktop is running
- [ ] `.env` file created with all variables
- [ ] Gmail App Password added to `.env`
- [ ] Containers built: `docker-compose up --build`
- [ ] Backend healthy: `http://localhost:5000/health`
- [ ] Database healthy: `docker exec fluentify-postgres pg_isready`
- [ ] No errors in logs: `docker-compose logs`

---

## 🎉 Success!

If you see:
```
fluentify-postgres | database system is ready to accept connections
fluentify-backend  | 🚀 Server running at http://localhost:5000
```

**You're ready to go!**

Test it: `http://localhost:5000/health`

---

## 📚 Additional Resources

- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **PostgreSQL Docker**: https://hub.docker.com/_/postgres

---

**Last Updated**: October 30, 2025  
**Docker Version**: Compatible with Docker 20.10+  
**Status**: ✅ Production Ready
