# 🚨 REGISTRATION FAILED - TROUBLESHOOTING

You're getting **"Registration failed due to server error"**

This means the backend API is not responding correctly. Here's the exact issue and how to fix it.

---

## 🔴 Most Likely Cause

**PostgreSQL is not running or not properly installed**

### Quick Fix (60 seconds)

1. **Open Windows Services**
   - Press `Win + R`
   - Type: `services.msc`
   - Press Enter

2. **Find PostgreSQL Service**
   - Look for: `postgresql-x64-15` (or `postgresql-x64-14` or `16`)
   - Check its status: Should be **"Running"**

3. **If NOT Running:**
   - Right-click on it
   - Click **"Start"**
   - Wait 5 seconds

4. **Refresh Browser**
   - Go back to http://localhost:5173
   - Try registering again

---

## ✅ If That Doesn't Work

### Check 1: Is backend actually running?

Look at **Terminal 1 (Backend)** - do you see this?
```
✅ Database connection has been established successfully.
✅ Database tables synchronized
🚀 Server listening on port 5000
```

**If you see this line, backend is working!** ✅

### Check 2: Is database created?

The backend needs a database called `hrms_db` to exist.

**To create it:**

Open PowerShell and run:
```powershell
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
& "$pgPath\createdb" -U postgres hrms_db
```

Then restart backend (Terminal 1: Ctrl+C, then `npm start`)

### Check 3: Is PostgreSQL installed?

```powershell
# Check if PostgreSQL path exists
if (Test-Path "C:\Program Files\PostgreSQL\15") {
    Write-Host "✅ PostgreSQL 15 is installed"
} else {
    Write-Host "❌ PostgreSQL 15 not found"
}
```

If not found, you need to **install PostgreSQL**

---

## 📥 Install PostgreSQL (if needed)

1. **Download:** https://www.postgresql.org/download/windows/
2. **Run installer:**
   - Keep default settings
   - **Remember the password** you set for `postgres` user
   - Let it finish
3. **Verify installation:**
   - Open Services (services.msc)
   - Look for `postgresql-x64-15` service
   - Should be **Running**

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot find module 'dotenv'"
**Solution:** In Terminal 1, run:
```powershell
npm install
```

### Issue: ".env file not found"
**Solution:** Create `backend/.env` with:
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

### Issue: "password authentication failed"
**Solution:** Your .env password doesn't match PostgreSQL password
- Update .env to match the password you set during PostgreSQL installation
- Or reinstall PostgreSQL with `postgres` as password

### Issue: "database hrms_db does not exist"
**Solution:** Create the database:
```powershell
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
& "$pgPath\createdb" -U postgres hrms_db
```

### Issue: Frontend shows "Cannot reach server"
**Solution:**
1. Check backend is running on port 5000
2. Check frontend .env.local has:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Restart frontend: In Terminal 2, Ctrl+C then `npm run dev`

---

## 🆘 Still Not Working? Do This:

### Step 1: Stop everything
- Terminal 1: Press Ctrl+C
- Terminal 2: Press Ctrl+C

### Step 2: Verify database exists
```powershell
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
& "$pgPath\psql" -U postgres -c "SELECT datname FROM pg_database WHERE datname = 'hrms_db';"
```

**Should show:**
```
  datname
-----------
 hrms_db
```

If not, create it:
```powershell
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
& "$pgPath\createdb" -U postgres hrms_db
```

### Step 3: Check PostgreSQL service
```powershell
Get-Service postgres* | Select Name, Status
```

**Should show Status: Running**

If Stopped, start it:
```powershell
Start-Service -Name "postgresql-x64-15"
```

### Step 4: Restart backend
```powershell
cd C:\Users\mouni\OneDrive\Desktop\hrms\backend
npm start
```

**Wait for all 3 lines:**
```
✅ Database connection has been established successfully.
✅ Database tables synchronized
🚀 Server listening on port 5000
```

### Step 5: Restart frontend
```powershell
cd C:\Users\mouni\OneDrive\Desktop\hrms\frontend
npm run dev
```

### Step 6: Try registration again

---

## 📊 Check Backend Logs

When you get the error, look at Terminal 1. Copy the EXACT error message.

Common patterns:

```
Error: connect ECONNREFUSED
→ PostgreSQL not running

Error: password authentication failed
→ Wrong password in .env

Error: database "hrms_db" does not exist
→ Database not created

Error: Cannot find module
→ Missing npm install

Error: ENOENT .env
→ .env file missing
```

---

## 💡 Pro Tips

1. **Always start backend FIRST** (Terminal 1)
2. **Wait for "Server listening" message** before starting frontend
3. **Don't close terminals** - keep them open to see errors
4. **Check PostgreSQL Service is Running** (services.msc)
5. **Clear browser cache** (Ctrl+Shift+Delete) if still seeing old errors

---

## ✅ Success Indicators

When everything works:

**Terminal 1 (Backend):**
```
✅ Database connection has been established successfully.
✅ Database tables synchronized
🚀 Server listening on port 5000
```

**Terminal 2 (Frontend):**
```
➜  Local:   http://localhost:5173/
```

**Browser (at http://localhost:5173):**
- Registration form appears
- Can type in fields
- Can submit without errors
- Auto-logs in
- Sees Employees page

---

## 🎯 Next Action

1. **Right now:** Check if PostgreSQL service is running (services.msc)
2. **If running:** Restart both terminals
3. **If not running:** Start the service and restart
4. **Try registering:** Go to http://localhost:5173 and try again

**Let me know if you still see errors after these steps!**

Copy the exact error message from Terminal 1 (Backend) and share it.
