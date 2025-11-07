# Quick Start Guide - User Management Feature

## 🚀 Starting the Application

### Step 1: Start Backend (with Docker)
```powershell
cd Fluentify-Backend

# If this is your first time OR you need to apply database migrations:
docker-compose down -v
docker-compose up --build

# If containers are already running and database is initialized:
docker-compose up
```

**Wait for:** 
- ✅ `fluentify-postgres` container healthy
- ✅ `fluentify-backend` container running
- ✅ Message: "Server running at http://localhost:5000"

### Step 2: Start Frontend
```powershell
# Open a new terminal
cd Fluentify-Frontend
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

---

## 🔑 Accessing User Management

### 1. Create Admin Account (if needed)
- Navigate to: `http://localhost:5173/signup`
- Select "Admin" role
- Fill in details and sign up

### 2. Login as Admin
- Navigate to: `http://localhost:5173/login`
- Enter admin credentials
- You'll be redirected to `/admin-dashboard`

### 3. Access User Management
- Click on the **"User Management"** card (green card with Users icon)
- You'll be redirected to `/admin/users`

---

## 📋 User Management Features

### User List Page
- **View all users** with pagination (20 per page)
- **Search users** by name or email
- **See user status** (Active/Inactive badge)
- **Click on any user** to view details

### User Details Page
- **View user information**: name, email, status, join date
- **Edit user**: Click "Edit" button to modify name/email
- **Deactivate user**: Click "Deactivate" to soft-delete
- **View course progress**: See all enrolled courses with completion %
- **Navigate back**: Click "Back to Users" or browser back button

---

## 🗄️ Database Migration (Important!)

### For Existing Database
If you already have a running database, you need to add the `is_active` column:

**Option 1: Manual Migration**
```powershell
docker exec -it fluentify-postgres psql -U postgres -d fluentify
```
Then run:
```sql
ALTER TABLE learners ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_learners_is_active ON learners(is_active);
\q
```

**Option 2: Rebuild Containers (Resets Data)**
```powershell
cd Fluentify-Backend
docker-compose down -v
docker-compose up --build
```

### For Fresh Setup
Just run `docker-compose up --build` - the migration will run automatically.

---

## 🐛 Troubleshooting

### Backend won't start
**Error:** `ERR_MODULE_NOT_FOUND` for axios
**Solution:** Rebuild containers
```powershell
cd Fluentify-Backend
docker-compose down
docker-compose up --build
```

### User Management shows "Coming Soon"
**Problem:** Frontend not updated
**Solution:** Clear browser cache and refresh, or restart frontend dev server

### "is_active column does not exist" error
**Problem:** Database migration not applied
**Solution:** Run the manual migration (see Database Migration section above)

### Search not working
**Check:** 
1. Backend is running on port 5000
2. No CORS errors in browser console
3. JWT token is valid (try logging out and back in)

---

## 🧪 Testing the Feature

### Create Test Users (as learners)
1. Logout from admin account
2. Go to `/signup`
3. Select "Learner" role
4. Create 2-3 test accounts
5. Login back as admin

### Test User Management
1. Go to User Management
2. You should see the test learners
3. Click on a user to view details
4. Try editing the user's name
5. Try searching for a user
6. Try deactivating a user
7. Verify the user shows as "Inactive"

---

## 📊 API Endpoints (for testing)

### Test Backend Directly
```bash
# Get all users (requires admin JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/admin/users

# Search users
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/admin/users/search?q=john

# Get user details
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/admin/users/1

# Update user
curl -X PUT -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}' http://localhost:5000/api/admin/users/1

# Deactivate user
curl -X DELETE -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/admin/users/1
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Database has `is_active` column in `learners` table
- [ ] Can login as admin
- [ ] User Management card is enabled (not "Coming Soon")
- [ ] Can view user list
- [ ] Can search users
- [ ] Can view user details
- [ ] Can edit user information
- [ ] Can deactivate users
- [ ] Pagination works (if > 20 users)

---

## 🎉 You're All Set!

The user management feature is now fully functional. Enjoy managing your users!

For any issues, check the troubleshooting section or review the implementation details in `USER_MANAGEMENT_IMPLEMENTATION.md`.
