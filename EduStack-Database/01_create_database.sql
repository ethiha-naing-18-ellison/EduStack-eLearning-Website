-- =====================================================
-- EduStack eLearning Platform Database Schema (MySQL)
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
CREATE DATABASE IF NOT EXISTS EduStackDB;
USE EduStackDB;

-- =====================================================
-- TABLE CREATION
-- =====================================================

-- Users Table
-- =====================================================
CREATE TABLE Users (
    Id CHAR(36) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(255) NOT NULL,
    Role ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    Avatar VARCHAR(500) NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (Email),
    INDEX idx_users_role (Role),
    INDEX idx_users_active (IsActive)
);

-- Categories Table
-- =====================================================
CREATE TABLE Categories (
    Id CHAR(36) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT NULL,
    Icon VARCHAR(500) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categories_name (Name)
);

-- Courses Table
-- =====================================================
CREATE TABLE Courses (
    Id CHAR(36) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Thumbnail VARCHAR(500) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    Duration INT NOT NULL COMMENT 'Duration in weeks',
    InstructorId CHAR(36) NOT NULL,
    IsPublished BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (InstructorId) REFERENCES Users(Id) ON DELETE RESTRICT,
    INDEX idx_courses_instructor (InstructorId),
    INDEX idx_courses_category (Category),
    INDEX idx_courses_level (Level),
    INDEX idx_courses_published (IsPublished),
    INDEX idx_courses_price (Price)
);

-- Lessons Table
-- =====================================================
CREATE TABLE Lessons (
    Id CHAR(36) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NULL,
    VideoUrl VARCHAR(500) NULL,
    Duration INT NOT NULL COMMENT 'Duration in minutes',
    OrderIndex INT NOT NULL,
    CourseId CHAR(36) NOT NULL,
    IsPublished BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    INDEX idx_lessons_course (CourseId),
    INDEX idx_lessons_order (CourseId, OrderIndex),
    INDEX idx_lessons_published (IsPublished)
);

-- Enrollments Table
-- =====================================================
CREATE TABLE Enrollments (
    Id CHAR(36) PRIMARY KEY,
    UserId CHAR(36) NOT NULL,
    CourseId CHAR(36) NOT NULL,
    Status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    EnrolledAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CompletedAt DATETIME NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (UserId, CourseId),
    INDEX idx_enrollments_user (UserId),
    INDEX idx_enrollments_course (CourseId),
    INDEX idx_enrollments_status (Status)
);

-- Progress Table
-- =====================================================
CREATE TABLE Progress (
    Id CHAR(36) PRIMARY KEY,
    UserId CHAR(36) NOT NULL,
    CourseId CHAR(36) NOT NULL,
    LessonId CHAR(36) NULL,
    ProgressPercentage INT NOT NULL DEFAULT 0 CHECK (ProgressPercentage >= 0 AND ProgressPercentage <= 100),
    CompletedAt DATETIME NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    FOREIGN KEY (LessonId) REFERENCES Lessons(Id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_course_lesson (UserId, CourseId, LessonId),
    INDEX idx_progress_user (UserId),
    INDEX idx_progress_course (CourseId),
    INDEX idx_progress_lesson (LessonId)
);

-- Reviews Table
-- =====================================================
CREATE TABLE Reviews (
    Id CHAR(36) PRIMARY KEY,
    UserId CHAR(36) NOT NULL,
    CourseId CHAR(36) NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course_review (UserId, CourseId),
    INDEX idx_reviews_user (UserId),
    INDEX idx_reviews_course (CourseId),
    INDEX idx_reviews_rating (Rating)
);

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
    ROUND((COUNT(DISTINCT p.Id) / COUNT(DISTINCT l.Id)) * 100, 2) as ProgressPercentage
FROM Users u
JOIN Enrollments e ON u.Id = e.UserId
JOIN Courses c ON e.CourseId = c.Id
LEFT JOIN Lessons l ON c.Id = l.CourseId AND l.IsPublished = TRUE
LEFT JOIN Progress p ON u.Id = p.UserId AND c.Id = p.CourseId AND p.ProgressPercentage = 100
GROUP BY u.Id, u.FullName, u.Email, c.Id, c.Title, e.Status, e.EnrolledAt, e.CompletedAt;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to enroll a user in a course
CREATE PROCEDURE EnrollUser(IN p_user_id CHAR(36), IN p_course_id CHAR(36))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Check if user is already enrolled
    IF EXISTS (SELECT 1 FROM Enrollments WHERE UserId = p_user_id AND CourseId = p_course_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is already enrolled in this course';
    END IF;
    
    -- Insert enrollment
    INSERT INTO Enrollments (Id, UserId, CourseId, Status, EnrolledAt)
    VALUES (UUID(), p_user_id, p_course_id, 'ACTIVE', NOW());
    
    COMMIT;
END //

-- Procedure to update user progress
CREATE PROCEDURE UpdateProgress(
    IN p_user_id CHAR(36), 
    IN p_course_id CHAR(36), 
    IN p_lesson_id CHAR(36), 
    IN p_progress_percentage INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update or insert progress
    INSERT INTO Progress (Id, UserId, CourseId, LessonId, ProgressPercentage, CompletedAt, CreatedAt, UpdatedAt)
    VALUES (UUID(), p_user_id, p_course_id, p_lesson_id, p_progress_percentage, 
            CASE WHEN p_progress_percentage = 100 THEN NOW() ELSE NULL END, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
        ProgressPercentage = p_progress_percentage,
        CompletedAt = CASE WHEN p_progress_percentage = 100 THEN NOW() ELSE CompletedAt END,
        UpdatedAt = NOW();
    
    COMMIT;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update course enrollment count
DELIMITER //
CREATE TRIGGER tr_enrollment_insert
AFTER INSERT ON Enrollments
FOR EACH ROW
BEGIN
    -- This trigger can be used for logging or additional business logic
    -- For now, it's a placeholder for future enhancements
END //
DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for common queries
CREATE INDEX idx_courses_created_at ON Courses(CreatedAt);
CREATE INDEX idx_courses_updated_at ON Courses(UpdatedAt);
CREATE INDEX idx_users_created_at ON Users(CreatedAt);
CREATE INDEX idx_enrollments_enrolled_at ON Enrollments(EnrolledAt);
CREATE INDEX idx_progress_created_at ON Progress(CreatedAt);
CREATE INDEX idx_reviews_created_at ON Reviews(CreatedAt);

-- =====================================================
-- DATABASE COMPLETION MESSAGE
-- =====================================================
SELECT 'EduStack Database Schema Created Successfully!' as Status;
