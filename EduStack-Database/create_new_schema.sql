-- =====================================================
-- Create New Database Schema
-- =====================================================
-- This script creates a new, improved schema that solves all issues
-- Run this after dropping all tables

-- Connect to the database
\c "EduStackDB";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordhash VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
    avatar VARCHAR(500) NULL,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for Users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Categories Table
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for Categories table
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Courses Table
-- =====================================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER' CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    duration INTEGER NOT NULL, -- Duration in weeks
    instructorid UUID NOT NULL,
    ispublished BOOLEAN NOT NULL DEFAULT FALSE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (instructorid) REFERENCES users(id) ON DELETE RESTRICT
);

-- Create trigger for Courses table
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Lessons Table
-- =====================================================
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    videourl VARCHAR(500) NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    orderindex INTEGER NOT NULL DEFAULT 0, -- This fixes the order column issue
    courseid UUID NOT NULL,
    ispublished BOOLEAN NOT NULL DEFAULT FALSE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create trigger for Lessons table
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Enrollments Table
-- =====================================================
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    courseid UUID NOT NULL,
    enrolledat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    completedat TIMESTAMP NULL,
    
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userid, courseid)
);

-- =====================================================
-- Reviews Table
-- =====================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    courseid UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userid, courseid)
);

-- Create trigger for Reviews table
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Progress Table
-- =====================================================
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    courseid UUID NOT NULL,
    lessonid UUID NOT NULL,
    completedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lessonid) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE(userid, lessonid)
);

-- =====================================================
-- Create Indexes for Performance
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_instructorid ON courses(instructorid);
CREATE INDEX idx_courses_ispublished ON courses(ispublished);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_lessons_courseid ON lessons(courseid);
CREATE INDEX idx_lessons_orderindex ON lessons(orderindex);
CREATE INDEX idx_enrollments_userid ON enrollments(userid);
CREATE INDEX idx_enrollments_courseid ON enrollments(courseid);
CREATE INDEX idx_reviews_courseid ON reviews(courseid);
CREATE INDEX idx_progress_userid ON progress(userid);
CREATE INDEX idx_progress_courseid ON progress(courseid);

-- =====================================================
-- Insert Sample Data
-- =====================================================

-- Insert sample users
INSERT INTO users (id, email, passwordhash, fullname, role, isactive) VALUES
('78abc482-8fe6-428c-8e48-6b3d2171bc39', 'instructor@edustack.com', '$2a$11$example_hash', 'John Instructor', 'INSTRUCTOR', TRUE),
('88bcd482-8fe6-428c-8e48-6b3d2171bc40', 'student@edustack.com', '$2a$11$example_hash', 'Jane Student', 'STUDENT', TRUE),
('98cde482-8fe6-428c-8e48-6b3d2171bc41', 'admin@edustack.com', '$2a$11$example_hash', 'Admin User', 'ADMIN', TRUE);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Programming', 'Software development and coding courses'),
('Design', 'UI/UX and graphic design courses'),
('Business', 'Business and entrepreneurship courses'),
('Marketing', 'Digital marketing and advertising courses');

-- Insert sample courses
INSERT INTO courses (id, title, description, thumbnail, price, category, level, duration, instructorid, ispublished) VALUES
('2a1b2c3d-4e5f-6789-abcd-ef1234567890', 'Complete Web Development', 'Learn full-stack web development from scratch', 'https://example.com/thumb1.jpg', 99.99, 'Programming', 'BEGINNER', 12, '78abc482-8fe6-428c-8e48-6b3d2171bc39', TRUE),
('3b2c3d4e-5f6g-7890-bcde-f23456789012', 'Advanced React', 'Master React with hooks and context', 'https://example.com/thumb2.jpg', 149.99, 'Programming', 'INTERMEDIATE', 8, '78abc482-8fe6-428c-8e48-6b3d2171bc39', TRUE);

-- Insert sample lessons
INSERT INTO lessons (title, description, videourl, duration, orderindex, courseid, ispublished) VALUES
('Introduction to HTML', 'Learn the basics of HTML', 'https://example.com/video1.mp4', 30, 1, '2a1b2c3d-4e5f-6789-abcd-ef1234567890', TRUE),
('CSS Fundamentals', 'Master CSS styling', 'https://example.com/video2.mp4', 45, 2, '2a1b2c3d-4e5f-6789-abcd-ef1234567890', TRUE),
('JavaScript Basics', 'Introduction to JavaScript', 'https://example.com/video3.mp4', 60, 3, '2a1b2c3d-4e5f-6789-abcd-ef1234567890', TRUE);

-- Verify the schema
SELECT 'New schema created successfully with sample data' as status;
