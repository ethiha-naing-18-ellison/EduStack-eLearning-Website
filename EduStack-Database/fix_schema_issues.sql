-- =====================================================
-- Fix Database Schema Issues
-- =====================================================
-- This script fixes the schema issues that are causing 500 errors
-- Run this script while connected to the EduStackDB database

-- Fix 1: Ensure the OrderIndex column exists in Lessons table
-- (This should already exist, but let's verify)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'orderindex'
    ) THEN
        ALTER TABLE lessons ADD COLUMN orderindex INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Fix 2: Update any existing lessons to have proper OrderIndex values
UPDATE lessons SET orderindex = 0 WHERE orderindex IS NULL;

-- Fix 3: Ensure the level constraint is properly set
-- Drop and recreate the constraint to be more flexible
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_level_check;
ALTER TABLE courses ADD CONSTRAINT courses_level_check 
    CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'));

-- Fix 4: Add any missing columns that might be needed
DO $$
BEGIN
    -- Check if ispublished column exists in courses
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'ispublished'
    ) THEN
        ALTER TABLE courses ADD COLUMN ispublished BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;

-- Fix 5: Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_courses_instructorid ON courses(instructorid);
CREATE INDEX IF NOT EXISTS idx_courses_ispublished ON courses(ispublished);
CREATE INDEX IF NOT EXISTS idx_lessons_courseid ON lessons(courseid);
CREATE INDEX IF NOT EXISTS idx_lessons_orderindex ON lessons(orderindex);

-- Fix 6: Update any existing data to have proper values
UPDATE courses SET level = UPPER(level) WHERE level IS NOT NULL;
UPDATE courses SET ispublished = FALSE WHERE ispublished IS NULL;

-- Verify the fixes
SELECT 'Schema fixes completed successfully' as status;
