-- =====================================================
-- Drop All Tables and Data
-- =====================================================
-- This script will drop all existing tables and data
-- Run this script to start fresh

-- Connect to the database
\c "EduStackDB";

-- Drop all tables in the correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any remaining sequences
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS courses_id_seq CASCADE;
DROP SEQUENCE IF EXISTS lessons_id_seq CASCADE;
DROP SEQUENCE IF EXISTS enrollments_id_seq CASCADE;
DROP SEQUENCE IF EXISTS reviews_id_seq CASCADE;
DROP SEQUENCE IF EXISTS progress_id_seq CASCADE;

-- Drop any remaining functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Verify all tables are dropped
SELECT 'All tables dropped successfully' as status;
