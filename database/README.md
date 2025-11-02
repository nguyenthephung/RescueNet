# Database Folder - README

## 📁 Files in this folder

### 🔧 Active Files (Use these)

1. **`clean-database.sql`**
   - **Purpose**: Drop all tables to reset database
   - **When to use**: Before letting Hibernate recreate schema
   - **How to use**: Copy SQL and run in Neon Console SQL Editor
   
### 📚 Reference Files (Keep for reference)

2. **`db_v1.sql`**
   - Old database dump (backup)
   - Reference only, not for use

3. **`initial.sql`**
   - Original database schema design
   - Reference only, not for use

## 🚀 How to Reset Database

### Option 1: Using Neon Console (Recommended)

1. Go to [Neon Console](https://console.neon.tech)
2. Open SQL Editor
3. Copy content from `clean-database.sql`
4. Click **Run**
5. Restart auth-service: `cd ..\backend; .\run-auth.bat`

### Option 2: Using psql

```powershell
cd database
psql "postgresql://phungthetest_owner@ep-still-heart-a1yimu0p.ap-southeast-1.aws.neon.tech/RescureNet?sslmode=require" -f clean-database.sql
```

## ⚠️ Important Notes

- **Hibernate Auto-Create**: After dropping tables, Hibernate will automatically recreate with correct schema on next startup
- **No manual migration needed**: Just drop tables and restart
- **Development only**: Only use this in development, not production

## 📋 What Hibernate Will Create

After restart, these tables will be auto-created:

### Main Tables:
- `users` (with `email_verified` column)
- `roles`
- `permissions`
- `otp_codes` (for email verification)
- `invalidated_token` (for JWT blacklist)

### Junction Tables (Many-to-Many relationships):
- `users_roles` (User ↔ Role relationship)
- `roles_permissions` (Role ↔ Permission relationship)

## 🔧 Fixed Issues

### User-Role Relationship
**Before** (Wrong):
```java
@ManyToMany
Set<Role> roles;  // ❌ No join table specified
```

**After** (Correct):
```java
@ManyToMany(fetch = FetchType.EAGER)
@JoinTable(
    name = "users_roles",  // ✅ Explicit join table name
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id")
)
Set<Role> roles;
```

### Role-Permission Relationship
**Before** (Wrong):
```java
@ManyToMany
Set<Permission> permissions;  // ❌ No join table specified
```

**After** (Correct):
```java
@ManyToMany(fetch = FetchType.EAGER)
@JoinTable(
    name = "roles_permissions",  // ✅ Explicit join table name
    joinColumns = @JoinColumn(name = "role_id"),
    inverseJoinColumns = @JoinColumn(name = "permission_id")
)
Set<Permission> permissions;
```

## ✅ Verification

After restart, check logs for:
```
Hibernate: create table users (...)
Hibernate: create table roles (...)
Hibernate: create table users_roles (...)
Hibernate: create table roles_permissions (...)
Hibernate: create table otp_codes (...)
```

Then verify in database:
```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check users_roles structure
\d users_roles

-- Check roles_permissions structure
\d roles_permissions
```

Then test registration:
```
POST http://localhost:8888/api/v1/auth/register
```

## 🎯 Expected Schema

### users_roles (junction table)
| Column | Type | Description |
|--------|------|-------------|
| user_id | bigint | FK to users.user_id |
| role_id | bigint | FK to roles.role_id |

### roles_permissions (junction table)
| Column | Type | Description |
|--------|------|-------------|
| role_id | bigint | FK to roles.role_id |
| permission_id | bigint | FK to permissions.permission_id |
