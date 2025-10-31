-- =========================================================
-- CLEAN DATABASE SCRIPT
-- Use this to reset database before letting Hibernate create schema
-- =========================================================

-- WARNING: This will delete ALL data!
-- Only run this in development environment

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS invalidated_token CASCADE;
DROP TABLE IF EXISTS users_roles CASCADE;
DROP TABLE IF EXISTS roles_permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;

-- Verify tables are dropped
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'roles', 'permissions', 'otp_codes', 'users_roles', 'roles_permissions', 'invalidated_token')
ORDER BY tablename;

-- Success message
SELECT 'All tables dropped successfully. Restart auth-service to let Hibernate recreate schema.' AS status;
