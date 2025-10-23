-- =====================================================
-- EduStack eLearning Platform Database Schema (PostgreSQL)
-- =====================================================
-- This script creates the complete database schema for the EduStack eLearning platform
-- Includes all tables, relationships, indexes, and seed data
-- 
-- Database: EduStackDB
-- Version: 1.0
-- Created: 2025-10-23
-- =====================================================

-- Create Database
-- =====================================================
CREATE DATABASE "EduStackDB";
\c "EduStackDB";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE CREATION
-- =====================================================

-- Users Table
-- =====================================================
CREATE TABLE Users (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL DEFAULT 'STUDENT' CHECK (Role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')),
    Avatar VARCHAR(500) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function for updating UpdatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for Users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON Users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Categories Table
-- =====================================================
CREATE TABLE Categories (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT NULL,
    Icon VARCHAR(500) NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for Categories table
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON Categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Courses Table
-- =====================================================
CREATE TABLE Courses (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Thumbnail VARCHAR(500) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER' CHECK (Level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    Duration INTEGER NOT NULL, -- Duration in weeks
    InstructorId UUID NOT NULL,
    IsPublished BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (InstructorId) REFERENCES Users(Id) ON DELETE RESTRICT
);

-- Create trigger for Courses table
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON Courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lessons Table
-- =====================================================
CREATE TABLE Lessons (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Title VARCHAR(255) NOT NULL,
    Description TEXT NULL,
    VideoUrl VARCHAR(500) NULL,
    Duration INTEGER NOT NULL, -- Duration in minutes
    OrderIndex INTEGER NOT NULL,
    CourseId UUID NOT NULL,
    IsPublished BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE
);

-- Create trigger for Lessons table
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON Lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enrollments Table
-- =====================================================
CREATE TABLE Enrollments (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UserId UUID NOT NULL,
    CourseId UUID NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (Status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    EnrolledAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CompletedAt TIMESTAMP NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    UNIQUE (UserId, CourseId)
);

-- Progress Table
-- =====================================================
CREATE TABLE Progress (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UserId UUID NOT NULL,
    CourseId UUID NOT NULL,
    LessonId UUID NULL,
    ProgressPercentage INTEGER NOT NULL DEFAULT 0 CHECK (ProgressPercentage >= 0 AND ProgressPercentage <= 100),
    CompletedAt TIMESTAMP NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id) ON DELETE SET NULL,
    UNIQUE (UserId, CourseId, LessonId)
);

-- Create trigger for Progress table
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON Progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reviews Table
-- =====================================================
CREATE TABLE Reviews (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UserId UUID NOT NULL,
    CourseId UUID NOT NULL,
    Rating INTEGER NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    UNIQUE (UserId, CourseId)
);

-- Create trigger for Reviews table
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON Reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_role ON Users(Role);
CREATE INDEX idx_users_active ON Users(IsActive);
CREATE INDEX idx_users_created_at ON Users(CreatedAt);

-- Categories indexes
CREATE INDEX idx_categories_name ON Categories(Name);

-- Courses indexes
CREATE INDEX idx_courses_instructor ON Courses(InstructorId);
CREATE INDEX idx_courses_category ON Courses(Category);
CREATE INDEX idx_courses_level ON Courses(Level);
CREATE INDEX idx_courses_published ON Courses(IsPublished);
CREATE INDEX idx_courses_price ON Courses(Price);
CREATE INDEX idx_courses_created_at ON Courses(CreatedAt);
CREATE INDEX idx_courses_updated_at ON Courses(UpdatedAt);

-- Lessons indexes
CREATE INDEX idx_lessons_course ON Lessons(CourseId);
CREATE INDEX idx_lessons_order ON Lessons(CourseId, OrderIndex);
CREATE INDEX idx_lessons_published ON Lessons(IsPublished);

-- Enrollments indexes
CREATE INDEX idx_enrollments_user ON Enrollments(UserId);
CREATE INDEX idx_enrollments_course ON Enrollments(CourseId);
CREATE INDEX idx_enrollments_status ON Enrollments(Status);
CREATE INDEX idx_enrollments_enrolled_at ON Enrollments(EnrolledAt);

-- Progress indexes
CREATE INDEX idx_progress_user ON Progress(UserId);
CREATE INDEX idx_progress_course ON Progress(CourseId);
CREATE INDEX idx_progress_lesson ON Progress(LessonId);
CREATE INDEX idx_progress_created_at ON Progress(CreatedAt);

-- Reviews indexes
CREATE INDEX idx_reviews_user ON Reviews(UserId);
CREATE INDEX idx_reviews_course ON Reviews(CourseId);
CREATE INDEX idx_reviews_rating ON Reviews(Rating);
CREATE INDEX idx_reviews_created_at ON Reviews(CreatedAt);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert Categories
INSERT INTO Categories (Id, Name, Description, Icon) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Web Development', 'Learn modern web development technologies', 'code'),
('550e8400-e29b-41d4-a716-446655440002', 'Data Science', 'Master data analysis and machine learning', 'science'),
('550e8400-e29b-41d4-a716-446655440003', 'UI/UX Design', 'Create beautiful and user-friendly interfaces', 'palette'),
('550e8400-e29b-41d4-a716-446655440004', 'Business', 'Develop business and management skills', 'business'),
('550e8400-e29b-41d4-a716-446655440005', 'Cybersecurity', 'Protect systems and data from threats', 'security'),
('550e8400-e29b-41d4-a716-446655440006', 'Cloud Computing', 'Learn cloud platforms and services', 'cloud'),
('550e8400-e29b-41d4-a716-446655440007', 'Mobile Development', 'Build mobile applications', 'phone_android'),
('550e8400-e29b-41d4-a716-446655440008', 'Programming', 'Master programming fundamentals', 'school');

-- Insert Sample Admin User
INSERT INTO Users (Id, Email, PasswordHash, FullName, Role, IsActive) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EduStack Admin', 'ADMIN', TRUE);

-- Insert Sample Instructor
INSERT INTO Users (Id, Email, PasswordHash, FullName, Role, IsActive) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'instructor@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Instructor', 'INSTRUCTOR', TRUE);

-- Insert Sample Student
INSERT INTO Users (Id, Email, PasswordHash, FullName, Role, IsActive) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'student@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Student', 'STUDENT', TRUE);

-- Insert Sample Course
INSERT INTO Courses (Id, Title, Description, Thumbnail, Price, Category, Level, Duration, InstructorId, IsPublished) VALUES
('550e8400-e29b-41d4-a716-446655440100', 'Complete Web Development Bootcamp', 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 199.99, 'Web Development', 'BEGINNER', 12, '550e8400-e29b-41d4-a716-446655440010', TRUE),
('550e8400-e29b-41d4-a716-446655440101', 'UI/UX Design Fundamentals', 'Learn the fundamentals of UI/UX design, user research, wireframing, prototyping, and visual design. Perfect for beginners and intermediate designers.', 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 149.99, 'UI/UX Design', 'BEGINNER', 6, '550e8400-e29b-41d4-a716-446655440010', TRUE);

-- Insert Sample Lessons for Web Development Course
INSERT INTO Lessons (Id, Title, Description, VideoUrl, Duration, OrderIndex, CourseId, IsPublished) VALUES
('550e8400-e29b-41d4-a716-446655440200', 'Introduction to Web Development', 'Overview of web development, tools, and technologies', 'https://example.com/video1', 45, 1, '550e8400-e29b-41d4-a716-446655440100', TRUE),
('550e8400-e29b-41d4-a716-446655440201', 'HTML Fundamentals', 'Learn HTML structure, tags, and semantic markup', 'https://example.com/video2', 60, 2, '550e8400-e29b-41d4-a716-446655440100', TRUE),
('550e8400-e29b-41d4-a716-446655440202', 'CSS Styling', 'Master CSS selectors, properties, and layouts', 'https://example.com/video3', 75, 3, '550e8400-e29b-41d4-a716-446655440100', TRUE),
('550e8400-e29b-41d4-a716-446655440203', 'JavaScript Basics', 'Introduction to JavaScript programming fundamentals', 'https://example.com/video4', 90, 4, '550e8400-e29b-41d4-a716-446655440100', TRUE);

-- Insert Sample Lessons for UI/UX Design Course
INSERT INTO Lessons (Id, Title, Description, VideoUrl, Duration, OrderIndex, CourseId, IsPublished) VALUES
('550e8400-e29b-41d4-a716-446655440210', 'Introduction to UI/UX Design', 'What is UI/UX Design? Design Thinking Process', 'https://example.com/video5', 50, 1, '550e8400-e29b-41d4-a716-446655440101', TRUE),
('550e8400-e29b-41d4-a716-446655440211', 'User Research & Analysis', 'User Research Methods, Creating User Personas', 'https://example.com/video6', 55, 2, '550e8400-e29b-41d4-a716-446655440101', TRUE),
('550e8400-e29b-41d4-a716-446655440212', 'Wireframing & Prototyping', 'Low-fidelity Wireframes, Interactive Prototypes', 'https://example.com/video7', 65, 3, '550e8400-e29b-41d4-a716-446655440101', TRUE);

-- Insert Sample Enrollment
INSERT INTO Enrollments (Id, UserId, CourseId, Status, EnrolledAt) VALUES
('550e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440100', 'ACTIVE', NOW());

-- Insert Sample Progress
INSERT INTO Progress (Id, UserId, CourseId, LessonId, ProgressPercentage, CompletedAt) VALUES
('550e8400-e29b-41d4-a716-446655440400', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440200', 100, NOW()),
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440201', 75, NULL);

-- Insert Sample Review
INSERT INTO Reviews (Id, UserId, CourseId, Rating, Comment, CreatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440500', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440100', 5, 'Excellent course! Very well structured and easy to follow.', NOW());

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Course Statistics View
CREATE VIEW CourseStats AS
SELECT 
    c.Id,
    c.Title,
    c.Price,
    c.Category,
    c.Level,
    c.Duration,
    c.IsPublished,
    u.FullName as InstructorName,
    COUNT(DISTINCT e.Id) as EnrollmentCount,
    COUNT(DISTINCT l.Id) as LessonCount,
    AVG(r.Rating) as AverageRating,
    COUNT(DISTINCT r.Id) as ReviewCount
FROM Courses c
LEFT JOIN Users u ON c.InstructorId = u.Id
LEFT JOIN Enrollments e ON c.Id = e.CourseId AND e.Status = 'ACTIVE'
LEFT JOIN Lessons l ON c.Id = l.CourseId AND l.IsPublished = TRUE
LEFT JOIN Reviews r ON c.Id = r.CourseId
GROUP BY c.Id, c.Title, c.Price, c.Category, c.Level, c.Duration, c.IsPublished, u.FullName;

-- User Progress View
CREATE VIEW UserProgress AS
SELECT 
    u.Id as UserId,
    u.FullName,
    u.Email,
    c.Id as CourseId,
    c.Title as CourseTitle,
    e.Status as EnrollmentStatus,
    e.EnrolledAt,
    e.CompletedAt,
    COUNT(DISTINCT l.Id) as TotalLessons,
    COUNT(DISTINCT p.Id) as CompletedLessons,
    ROUND((COUNT(DISTINCT p.Id)::DECIMAL / COUNT(DISTINCT l.Id)) * 100, 2) as ProgressPercentage
FROM Users u
JOIN Enrollments e ON u.Id = e.UserId
JOIN Courses c ON e.CourseId = c.Id
LEFT JOIN Lessons l ON c.Id = l.CourseId AND l.IsPublished = TRUE
LEFT JOIN Progress p ON u.Id = p.UserId AND c.Id = p.CourseId AND p.ProgressPercentage = 100
GROUP BY u.Id, u.FullName, u.Email, c.Id, c.Title, e.Status, e.EnrolledAt, e.CompletedAt;

-- =====================================================
-- STORED PROCEDURES (PostgreSQL Functions)
-- =====================================================

-- Function to enroll a user in a course
CREATE OR REPLACE FUNCTION EnrollUser(p_user_id UUID, p_course_id UUID)
RETURNS UUID AS $$
DECLARE
    enrollment_id UUID;
BEGIN
    -- Check if user is already enrolled
    IF EXISTS (SELECT 1 FROM Enrollments WHERE UserId = p_user_id AND CourseId = p_course_id) THEN
        RAISE EXCEPTION 'User is already enrolled in this course';
    END IF;
    
    -- Insert enrollment
    INSERT INTO Enrollments (Id, UserId, CourseId, Status, EnrolledAt)
    VALUES (uuid_generate_v4(), p_user_id, p_course_id, 'ACTIVE', NOW())
    RETURNING Id INTO enrollment_id;
    
    RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress
CREATE OR REPLACE FUNCTION UpdateProgress(
    p_user_id UUID, 
    p_course_id UUID, 
    p_lesson_id UUID, 
    p_progress_percentage INTEGER
)
RETURNS UUID AS $$
DECLARE
    progress_id UUID;
BEGIN
    -- Update or insert progress
    INSERT INTO Progress (Id, UserId, CourseId, LessonId, ProgressPercentage, CompletedAt, CreatedAt, UpdatedAt)
    VALUES (uuid_generate_v4(), p_user_id, p_course_id, p_lesson_id, p_progress_percentage, 
            CASE WHEN p_progress_percentage = 100 THEN NOW() ELSE NULL END, NOW(), NOW())
    ON CONFLICT (UserId, CourseId, LessonId) DO UPDATE SET
        ProgressPercentage = p_progress_percentage,
        CompletedAt = CASE WHEN p_progress_percentage = 100 THEN NOW() ELSE Progress.CompletedAt END,
        UpdatedAt = NOW()
    RETURNING Id INTO progress_id;
    
    RETURN progress_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATABASE COMPLETION MESSAGE
-- =====================================================
SELECT 'EduStack Database Schema Created Successfully!' as Status;
