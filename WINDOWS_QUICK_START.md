# HRMS Quick Start - Windows Setup

## ⚡ Quick Fix (Do This First)

### 1. Verify .env File
Check `backend/.env` exists with:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=hrms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

### 2. Install PostgreSQL

**Download:** https://www.postgresql.org/download/windows/

**Installation:**
- Click "Download the installer"
- Run the installer
- **Important:** Remember the password you set for `postgres` user
- Use default settings for everything else
- Make sure PostgreSQL service is running

**Verify Installation:**
Open Command Prompt and run:
```cmd
"C:\Program Files\PostgreSQL\15\bin\psql" -U postgres -c "SELECT version();"
```

If it shows version info, PostgreSQL is working! ✅

### 3. Create Database

Open Command Prompt and run:
```cmd
"C:\Program Files\PostgreSQL\15\bin\createdb" -U postgres hrms_db
```

Or use pgAdmin to create database named `hrms_db`

### 4. Update backend/.env (if PostgreSQL password is different)

If you set a different password during PostgreSQL installation, update:
```
DB_PASS=your_actual_password
```

---

## 🚀 Start the Application

### Terminal 1 - Backend

```powershell
cd C:\Users\mouni\OneDrive\Desktop\hrms\backend
npm install
npm start
```

**Wait for:**
```
✅ Database tables synchronized
🚀 Server listening on port 5000
```

If you see errors, check:
- PostgreSQL is running
- Database `hrms_db` exists
- .env file has correct credentials

### Terminal 2 - Frontend

```powershell
cd C:\Users\mouni\OneDrive\Desktop\hrms\frontend
npm install
npm run dev
```

**Wait for:**
```
Local:   http://localhost:5173/
```

### 3. Open Browser

Go to: **http://localhost:5173**

---

## ✅ Test Registration

1. Click **"Register one here"**
2. Fill form:
   - Organization Name: `Acme Corp`
   - Admin Full Name: `John Doe`
   - Email: `john@acme.com`
   - Password: `Password123`
3. Click **"Register & Log In"**

**Expected:** Auto-login and see Employees page ✅

---

## ❌ Troubleshooting

### "Registration failed due to server error"

**Solution 1: Check backend logs**
- Look at Terminal 1 (backend)
- What error do you see?
- Copy the exact error message

**Solution 2: Verify database connection**
```powershell
# In new terminal:
"C:\Program Files\PostgreSQL\15\bin\psql" -U postgres -d hrms_db -c "SELECT 1;"
```
Should return: `1` ✅

**Solution 3: Restart everything**
```powershell
# Stop Terminal 1 (Ctrl+C)
# Stop Terminal 2 (Ctrl+C)
# Wait 2 seconds
# Start Terminal 1 again
# Start Terminal 2 again
```

**Solution 4: Clear frontend cache**
- Press Ctrl+Shift+Delete in browser
- Clear cache
- Refresh page

### "Cannot connect to server"

Check both are running:
- Backend: http://localhost:5000 (should show "HRMS Backend is running!")
- Frontend: http://localhost:5173

### "Cannot POST /api/auth/register"

- Backend not running on port 5000
- OR frontend .env.local is wrong

Check frontend/.env.local:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📊 Check Database Was Created

```powershell
# List all tables:
"C:\Program Files\PostgreSQL\15\bin\psql" -U postgres -d hrms_db -c "\dt"
```

Should show:
```
           List of relations
 Schema |       Name       | Type  | Owner
--------+------------------+-------+----------
 public | employee_teams   | table | postgres
 public | employees        | table | postgres
 public | logs             | table | postgres
 public | organisations    | table | postgres
 public | teams            | table | postgres
 public | users            | table | postgres
```

---

## 🎯 Once Working

1. Register organization
2. Create employees
3. Create teams
4. Assign employees to teams
5. View audit logs
6. Test logout
7. Test login with same credentials

Follow the full testing guide: `TESTING_GUIDE.md`

---

## 💾 Reset Everything (if needed)

```powershell
# Drop database
"C:\Program Files\PostgreSQL\15\bin\dropdb" -U postgres hrms_db

# Recreate database
"C:\Program Files\PostgreSQL\15\bin\createdb" -U postgres hrms_db

# Restart backend (Terminal 1)
# Tables will be created automatically
```

---

## ⚙️ PostgreSQL Common Paths

- **Windows Installation:** `C:\Program Files\PostgreSQL\15\bin\`
- **Adjust "15" if you installed PostgreSQL 14 or 16**

---

## 🆘 Still Having Issues?

1. Check backend Terminal 1 for exact error message
2. Copy the error
3. Check PostgreSQL is running:
   - Windows Services (services.msc)
   - Look for "postgresql-x64" service
   - Should be Running status
4. Verify .env credentials match PostgreSQL settings

**Backend should show:**
```
✅ Database connection has been established successfully.
✅ Database tables synchronized
🚀 Server listening on port 5000
```

**If you see different messages, paste them here!**
