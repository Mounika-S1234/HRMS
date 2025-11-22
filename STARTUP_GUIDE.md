# HRMS Startup Guide

## Step 1: Database Setup

### Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- Install with default settings
- Default credentials: `username: postgres`, `password: postgres`

### Create Database
```sql
-- Open pgAdmin or psql terminal and run:
CREATE DATABASE hrms_db;
```

### Verify Connection
```bash
psql -U postgres -d hrms_db -c "SELECT 1;"
```

---

## Step 2: Backend Setup

### 1. Navigate to backend folder
```powershell
cd c:\Users\mouni\OneDrive\Desktop\hrms\backend
```

### 2. Verify .env file exists and has correct values
File: `backend\.env`

Contents should be:
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

### 3. Install dependencies (if not already done)
```powershell
npm install
```

### 4. Start backend server
```powershell
npm start
```

**Expected output:**
```
Database connection has been established successfully.
Server listening on port 5000
```

### 5. Test backend is running
Open browser and go to: `http://localhost:5000`
Should see: "HRMS Backend is running!"

---

## Step 3: Frontend Setup

### 1. Open new terminal and navigate to frontend
```powershell
cd c:\Users\mouni\OneDrive\Desktop\hrms\frontend
```

### 2. Verify .env.local file
File: `frontend\.env.local`

Contents should be:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install dependencies (if not already done)
```powershell
npm install
```

### 4. Start frontend dev server
```powershell
npm run dev
```

**Expected output:**
```
  VITE v5.2.13  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

### 5. Open in browser
Go to: `http://localhost:5173`

---

## Step 4: Test the Application

### Test Registration

1. **Click "Register one here"** link
2. **Fill the registration form:**
   - Organization Name: `Acme Corporation`
   - Admin Full Name: `John Doe`
   - Email: `john@acme.com`
   - Password: `SecurePass123`
3. **Click "Register & Log In"**

**Expected:**
- ✅ No errors
- ✅ Auto-login
- ✅ Redirected to Employees page
- ✅ See navigation bar with "Employees", "Teams", "Logs", "Log Out"

### Test Login (from different session)

1. **Open new incognito/private window**
2. **Go to:** `http://localhost:5173/login`
3. **Fill login form:**
   - Email: `john@acme.com`
   - Password: `SecurePass123`
4. **Click "Log In"**

**Expected:**
- ✅ Login succeeds
- ✅ Redirected to Employees page
- ✅ Token stored in browser localStorage

### Test Employee CRUD

1. **Click "+ Add New Employee"**
2. **Fill form:**
   - First Name: `Alice`
   - Last Name: `Johnson`
   - Email: `alice@acme.com`
   - Phone: `555-0001`
3. **Click "Create Employee"**

**Expected:**
- ✅ Employee added to table
- ✅ Can edit/delete employee

### Test Team Management

1. **Click "Teams"** in navigation
2. **Click "+ Create New Team"**
3. **Fill form:**
   - Team Name: `Engineering`
   - Description: `Development Team`
4. **Click "Create Team"**

**Expected:**
- ✅ Team created
- ✅ Click "Manage" to assign employees

### Test Audit Logs

1. **Click "Logs"** in navigation
2. **Should see entries for:**
   - `org_registered` - Registration action
   - `employee_created` - Each employee created
   - `team_created` - Each team created
   - etc.

**Expected:**
- ✅ All actions logged with timestamps
- ✅ Metadata shows details

---

## Troubleshooting

### Backend won't start - "Database connection failed"

**Solution:**
1. Check PostgreSQL is running
   ```powershell
   # Windows - check if PostgreSQL service is running
   Get-Service "postgresql*"
   ```
2. Verify database exists:
   ```powershell
   psql -U postgres -l | findstr hrms_db
   ```
3. Check .env file has correct credentials
4. Try creating database if missing:
   ```powershell
   psql -U postgres -c "CREATE DATABASE hrms_db;"
   ```

### Frontend can't reach backend - "Cannot POST /api/auth/register"

**Solution:**
1. Verify backend is running on port 5000
   ```powershell
   netstat -ano | findstr 5000
   ```
2. Check .env.local has correct API URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Restart frontend dev server:
   ```powershell
   # Press Ctrl+C to stop, then:
   npm run dev
   ```

### "CORS error" or "Network request failed"

**Solution:**
1. Make sure backend CORS middleware is enabled (it is by default)
2. Check backend is running on `http://localhost:5000`
3. Check frontend is running on `http://localhost:5173`
4. Restart both servers

### Registration fails - "User with this email already exists"

**Solution:**
- This is expected if you already registered with that email
- Use a different email address: `john2@acme.com`
- Or delete the database and recreate it

### Can't login after registration

**Solution:**
1. Check backend logs for errors
2. Verify email and password are correct
3. Check browser console (F12) for frontend errors
4. Try registering a new account and login immediately

---

## Database Cleanup (if needed)

To reset the database:

```powershell
# Drop database
psql -U postgres -c "DROP DATABASE hrms_db;"

# Recreate database
psql -U postgres -c "CREATE DATABASE hrms_db;"

# Restart backend - Sequelize will create tables automatically
```

---

## Ports Used

- **Backend API:** http://localhost:5000
- **Frontend UI:** http://localhost:5173
- **PostgreSQL:** localhost:5432

Make sure these ports are not in use by other applications!

---

## Next Steps

After successful startup and testing:

1. ✅ Test all 15 scenarios from TESTING_GUIDE.md
2. ✅ Try performance testing with multiple users
3. ✅ Test on different browsers
4. ✅ Prepare for production deployment

---

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Use strong database password
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure environment variables on server
- [ ] Set up database backups
- [ ] Monitor application logs

**You're ready to test! 🚀**
