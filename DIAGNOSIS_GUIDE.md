# HRMS Diagnosis Guide

## If You're Getting "Registration failed due to server error"

This guide helps identify exactly where the problem is.

### Step 1: Check Backend Terminal

When you try to register, look at **Terminal 1 (Backend)** and tell me what error message appears.

**Common errors:**

#### Error 1: "Cannot find module 'dotenv'"
```
Cannot find module 'dotenv'
```
**Fix:** Run `npm install` in backend folder

#### Error 2: "ENOENT: no such file or directory"
```
ENOENT: no such file or directory, open 'C:\...\backend\.env'
```
**Fix:** Create `.env` file in backend folder with correct values

#### Error 3: "connect ECONNREFUSED 127.0.0.1:5432"
```
connect ECONNREFUSED 127.0.0.1:5432
```
**Meaning:** PostgreSQL is not running
**Fix:** Start PostgreSQL service

#### Error 4: "password authentication failed for user"
```
password authentication failed for user "postgres"
```
**Meaning:** Wrong database password
**Fix:** Update `.env` file with correct password

#### Error 5: "database \"hrms_db\" does not exist"
```
database "hrms_db" does not exist
```
**Meaning:** Database wasn't created
**Fix:** Create database using pgAdmin or command line

---

## Step 2: Test Database Connection

Run this in PowerShell to test the database:

```powershell
# Find PostgreSQL installation (adjust version if needed)
$pgPath = "C:\Program Files\PostgreSQL\15\bin"

# Test connection
& "$pgPath\psql" -U postgres -h localhost -c "SELECT 1;"
```

**Expected output:**
```
 ?column?
----------
        1
```

**If error:** PostgreSQL not installed or not running

---

## Step 3: Test Backend Startup

```powershell
cd C:\Users\mouni\OneDrive\Desktop\hrms\backend

# Clear node_modules and reinstall
Remove-Item -Recurse node_modules -Force -ErrorAction SilentlyContinue
npm install

# Start backend
npm start
```

**Expected output:**
```
Database connection has been established successfully.
✅ Database tables synchronized
🚀 Server listening on port 5000
```

**If you see different output, tell me what it says!**

---

## Step 4: Test Backend Directly

In a new terminal, test the backend API:

```powershell
# Test if backend is running
$response = Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "✅ Backend is running!"
} else {
    Write-Host "❌ Backend not responding"
}
```

---

## Step 5: Check Frontend .env.local

Make sure `frontend/.env.local` contains:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then test frontend:

```powershell
cd C:\Users\mouni\OneDrive\Desktop\hrms\frontend

# Open browser console (F12) while running
npm run dev
```

Open DevTools (F12) → Console tab → Try registering again

**What errors appear in console?** Copy them!

---

## Step 6: Manual API Test

Test the API directly with Invoke-RestMethod:

```powershell
# Test registration
$body = @{
    orgName = "Test Org"
    adminName = "Admin"
    email = "test@test.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -ErrorAction Stop

$response | ConvertTo-Json
```

**Copy any error message you see!**

---

## Summary of What to Check

1. ✅ PostgreSQL is running (check Windows Services)
2. ✅ Database `hrms_db` exists
3. ✅ Backend `.env` has correct DB credentials
4. ✅ Backend starts without errors
5. ✅ Frontend can reach backend at `http://localhost:5000`
6. ✅ Frontend `.env.local` has correct API URL
7. ✅ All npm packages installed (`npm install`)

---

## Getting Help

When asking for help, provide:
1. **Exact error message** from backend terminal
2. **Browser console errors** (F12)
3. **Your database setup** (PostgreSQL version, username, password)
4. **Your .env files** (don't share JWT_SECRET)
5. **Steps you tried to fix it**

---

## Quick Health Check Script

Save this as `healthcheck.ps1` and run it:

```powershell
Write-Host "🔍 HRMS Health Check`n" -ForegroundColor Cyan

# Check 1: Backend running
Write-Host "1. Checking backend..." -NoNewline
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction Stop
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌ (Not running on port 5000)" -ForegroundColor Red
}

# Check 2: Frontend running
Write-Host "2. Checking frontend..." -NoNewline
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:5173" -ErrorAction Stop
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌ (Not running on port 5173)" -ForegroundColor Red
}

# Check 3: PostgreSQL
Write-Host "3. Checking PostgreSQL..." -NoNewline
try {
    $pgPath = "C:\Program Files\PostgreSQL\15\bin\psql"
    $output = & $pgPath -U postgres -c "SELECT 1;" 2>&1
    if ($output -like "*1*") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
}

# Check 4: Database exists
Write-Host "4. Checking hrms_db..." -NoNewline
try {
    $pgPath = "C:\Program Files\PostgreSQL\15\bin\psql"
    $output = & $pgPath -U postgres -c "SELECT 1;" -d hrms_db 2>&1
    if ($output -like "*1*") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
}

Write-Host "`n✅ All checks completed!`n"
```

---

**Now follow the steps above and let me know what you find!**
