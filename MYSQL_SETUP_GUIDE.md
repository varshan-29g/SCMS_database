# MySQL Connection Setup Guide

## Prerequisites
- MySQL 8.0+ installed ✓
- Node.js installed (for backend)
- Backend dependencies installed

## Step 1: Verify MySQL is Running

**On Windows:**
```powershell
# Check if MySQL service is running
Get-Service MySQL80

# If stopped, start it:
Start-Service MySQL80
```

## Step 2: Fix MySQL Authentication

If you get "Access denied" error, you need to either:

### Option A: Use MySQL with NO password (default installation)
Update your `.env` file:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=scms_db
```

### Option B: Set a new MySQL root password
```powershell
# Login to MySQL (default is no password)
mysql -u root

# Once in MySQL, run:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Varshan291206';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Create the Database

Once MySQL authentication works, run:

```powershell
cd "f:\PROJECTS\DBMS SCMS\database"

# Create database and import schema
mysql -u root [-p if you set a password] < schema.sql

# Import seed data (optional - for test data)
mysql -u root [-p if you set a password] < seed.sql
```

## Step 4: Verify Database Creation

```powershell
mysql -u root [-p]
SHOW DATABASES;
USE scms_db;
SHOW TABLES;
EXIT;
```

## Step 5: Install Backend Dependencies (if not done)

```powershell
cd "f:\PROJECTS\DBMS SCMS\backend"
npm install
```

## Step 6: Start the Backend Server

```powershell
cd "f:\PROJECTS\DBMS SCMS\backend"
npm run dev
```

Expected output:
```
✅ MySQL connected successfully
🔌 Server running on port 5000
```

## Step 7: Test the Connection

In another terminal:
```powershell
curl http://localhost:5000/api/auth/health
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Access denied for user 'root'` | Check MySQL password in `.env` or set it with `ALTER USER` |
| `Can't connect to MySQL server` | Verify MySQL service is running: `Get-Service MySQL80` |
| `Unknown database 'scms_db'` | Run the schema.sql file: `mysql -u root < schema.sql` |
| `Module not found: mysql2` | Run `npm install` in backend folder |

## Your Current Configuration

- **Backend Port:** 5000
- **Database:** scms_db
- **Database User:** root
- **Frontend URL:** http://localhost:3000
- **API Base URL:** http://localhost:5000/api

Ready to connect once you verify MySQL credentials! 🚀
