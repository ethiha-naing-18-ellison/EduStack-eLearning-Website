-- =====================================================
-- EduStack Database Queries and Maintenance Script
-- =====================================================
-- This script contains common queries, maintenance procedures,
-- and utility functions for the EduStack database
-- =====================================================

USE EduStackDB;

-- =====================================================
-- COMMON QUERIES
-- =====================================================

-- 1. Get all published courses with instructor information
SELECT 
    c.Id,
    c.Title,
    c.Description,
    c.Price,
    c.Category,
    c.Level,
    c.Duration,
    u.FullName as InstructorName,
    u.Avatar as InstructorAvatar,
    COUNT(DISTINCT e.Id) as EnrollmentCount,
    AVG(r.Rating) as AverageRating,
    COUNT(DISTINCT r.Id) as ReviewCount
FROM Courses c
JOIN Users u ON c.InstructorId = u.Id
LEFT JOIN Enrollments e ON c.Id = e.CourseId AND e.Status = 'ACTIVE'
LEFT JOIN Reviews r ON c.Id = r.CourseId
WHERE c.IsPublished = TRUE
GROUP BY c.Id, c.Title, c.Description, c.Price, c.Category, c.Level, c.Duration, u.FullName, u.Avatar
ORDER BY c.CreatedAt DESC;

-- 2. Get user's enrolled courses with progress
SELECT 
    u.FullName as StudentName,
    c.Title as CourseTitle,
    c.Category,
    c.Level,
    e.Status as EnrollmentStatus,
    e.EnrolledAt,
    COUNT(DISTINCT l.Id) as TotalLessons,
    COUNT(DISTINCT p.Id) as CompletedLessons,
    ROUND((COUNT(DISTINCT p.Id) / COUNT(DISTINCT l.Id)) * 100, 2) as ProgressPercentage
FROM Users u
JOIN Enrollments e ON u.Id = e.UserId
JOIN Courses c ON e.CourseId = c.Id
LEFT JOIN Lessons l ON c.Id = l.CourseId AND l.IsPublished = TRUE
LEFT JOIN Progress p ON u.Id = p.UserId AND c.Id = p.CourseId AND p.ProgressPercentage = 100
WHERE u.Role = 'STUDENT'
GROUP BY u.FullName, c.Title, c.Category, c.Level, e.Status, e.EnrolledAt
ORDER BY u.FullName, e.EnrolledAt DESC;

-- 3. Get course statistics by category
SELECT 
    Category,
    COUNT(*) as TotalCourses,
    COUNT(CASE WHEN IsPublished = TRUE THEN 1 END) as PublishedCourses,
    AVG(Price) as AveragePrice,
    SUM(CASE WHEN IsPublished = TRUE THEN 1 ELSE 0 END) as PublishedCount
FROM Courses
GROUP BY Category
ORDER BY TotalCourses DESC;

-- 4. Get instructor performance metrics
SELECT 
    u.FullName as InstructorName,
    u.Email,
    COUNT(DISTINCT c.Id) as TotalCourses,
    COUNT(DISTINCT CASE WHEN c.IsPublished = TRUE THEN c.Id END) as PublishedCourses,
    COUNT(DISTINCT e.Id) as TotalEnrollments,
    AVG(r.Rating) as AverageRating,
    COUNT(DISTINCT r.Id) as TotalReviews
FROM Users u
LEFT JOIN Courses c ON u.Id = c.InstructorId
LEFT JOIN Enrollments e ON c.Id = e.CourseId AND e.Status = 'ACTIVE'
LEFT JOIN Reviews r ON c.Id = r.CourseId
WHERE u.Role = 'INSTRUCTOR'
GROUP BY u.Id, u.FullName, u.Email
ORDER BY TotalEnrollments DESC;

-- 5. Get recent activity (enrollments, reviews, progress updates)
SELECT 
    'Enrollment' as ActivityType,
    u.FullName as UserName,
    c.Title as CourseTitle,
    e.EnrolledAt as ActivityDate
FROM Enrollments e
JOIN Users u ON e.UserId = u.Id
JOIN Courses c ON e.CourseId = c.Id
WHERE e.EnrolledAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)

UNION ALL

SELECT 
    'Review' as ActivityType,
    u.FullName as UserName,
    c.Title as CourseTitle,
    r.CreatedAt as ActivityDate
FROM Reviews r
JOIN Users u ON r.UserId = u.Id
JOIN Courses c ON r.CourseId = c.Id
WHERE r.CreatedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)

UNION ALL

SELECT 
    'Progress' as ActivityType,
    u.FullName as UserName,
    c.Title as CourseTitle,
    p.UpdatedAt as ActivityDate
FROM Progress p
JOIN Users u ON p.UserId = u.Id
JOIN Courses c ON p.CourseId = c.Id
WHERE p.UpdatedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY ActivityDate DESC;

-- =====================================================
-- MAINTENANCE QUERIES
-- =====================================================

-- 1. Find courses with no enrollments
SELECT 
    c.Id,
    c.Title,
    c.Category,
    c.CreatedAt,
    DATEDIFF(NOW(), c.CreatedAt) as DaysSinceCreation
FROM Courses c
LEFT JOIN Enrollments e ON c.Id = e.CourseId
WHERE e.Id IS NULL AND c.IsPublished = TRUE
ORDER BY c.CreatedAt;

-- 2. Find users with no activity (no enrollments)
SELECT 
    u.Id,
    u.FullName,
    u.Email,
    u.CreatedAt,
    DATEDIFF(NOW(), u.CreatedAt) as DaysSinceRegistration
FROM Users u
LEFT JOIN Enrollments e ON u.Id = e.UserId
WHERE u.Role = 'STUDENT' AND e.Id IS NULL
ORDER BY u.CreatedAt;

-- 3. Find courses with low ratings
SELECT 
    c.Id,
    c.Title,
    AVG(r.Rating) as AverageRating,
    COUNT(r.Id) as ReviewCount
FROM Courses c
JOIN Reviews r ON c.Id = r.CourseId
GROUP BY c.Id, c.Title
HAVING AverageRating < 3.0 AND ReviewCount >= 3
ORDER BY AverageRating;

-- 4. Find inactive users (no activity in last 90 days)
SELECT 
    u.Id,
    u.FullName,
    u.Email,
    u.LastActivity
FROM Users u
WHERE u.LastActivity < DATE_SUB(NOW(), INTERVAL 90 DAY)
   OR u.LastActivity IS NULL;

-- =====================================================
-- DATA CLEANUP PROCEDURES
-- =====================================================

-- 1. Clean up old progress records (older than 1 year with 0% progress)
DELETE FROM Progress 
WHERE ProgressPercentage = 0 
  AND CreatedAt < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 2. Archive completed enrollments older than 2 years
-- (This would typically move to an archive table, but for demo we'll just mark them)
UPDATE Enrollments 
SET Status = 'ARCHIVED'
WHERE Status = 'COMPLETED' 
  AND CompletedAt < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- 3. Remove test data (users with test emails)
DELETE FROM Users 
WHERE Email LIKE '%test%' 
   OR Email LIKE '%example%'
   OR Email LIKE '%demo%';

-- =====================================================
-- PERFORMANCE OPTIMIZATION QUERIES
-- =====================================================

-- 1. Analyze table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows
FROM information_schema.tables
WHERE table_schema = 'EduStackDB'
ORDER BY (data_length + index_length) DESC;

-- 2. Check for missing indexes
SELECT 
    table_name,
    column_name,
    cardinality
FROM information_schema.statistics
WHERE table_schema = 'EduStackDB'
  AND cardinality IS NULL;

-- 3. Find slow queries (requires slow query log to be enabled)
-- This is a placeholder - actual implementation depends on MySQL configuration
-- SHOW PROCESSLIST;

-- =====================================================
-- BACKUP AND RESTORE PROCEDURES
-- =====================================================

-- 1. Create backup script (to be run from command line)
-- mysqldump -u username -p EduStackDB > EduStackDB_backup_$(date +%Y%m%d_%H%M%S).sql

-- 2. Restore from backup (to be run from command line)
-- mysql -u username -p EduStackDB < EduStackDB_backup_YYYYMMDD_HHMMSS.sql

-- =====================================================
-- SECURITY AUDIT QUERIES
-- =====================================================

-- 1. Check for weak passwords (this is a simplified check)
SELECT 
    Id,
    Email,
    FullName,
    'Weak password detected' as SecurityIssue
FROM Users
WHERE LENGTH(PasswordHash) < 60; -- BCrypt hashes should be 60+ characters

-- 2. Check for inactive admin accounts
SELECT 
    Id,
    Email,
    FullName,
    CreatedAt,
    'Inactive admin account' as SecurityIssue
FROM Users
WHERE Role = 'ADMIN' 
  AND (LastActivity < DATE_SUB(NOW(), INTERVAL 30 DAY) OR LastActivity IS NULL);

-- 3. Check for suspicious activity (multiple failed logins, etc.)
-- This would require additional logging tables in a real implementation

-- =====================================================
-- REPORTING QUERIES
-- =====================================================

-- 1. Monthly enrollment report
SELECT 
    DATE_FORMAT(EnrolledAt, '%Y-%m') as Month,
    COUNT(*) as TotalEnrollments,
    COUNT(DISTINCT UserId) as UniqueStudents,
    COUNT(DISTINCT CourseId) as UniqueCourses
FROM Enrollments
WHERE EnrolledAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(EnrolledAt, '%Y-%m')
ORDER BY Month DESC;

-- 2. Revenue report by course
SELECT 
    c.Title,
    c.Price,
    COUNT(e.Id) as EnrollmentCount,
    (c.Price * COUNT(e.Id)) as TotalRevenue
FROM Courses c
JOIN Enrollments e ON c.Id = e.CourseId
WHERE e.Status = 'ACTIVE'
GROUP BY c.Id, c.Title, c.Price
ORDER BY TotalRevenue DESC;

-- 3. Student completion rates
SELECT 
    c.Title,
    COUNT(DISTINCT e.UserId) as TotalEnrolled,
    COUNT(DISTINCT CASE WHEN e.Status = 'COMPLETED' THEN e.UserId END) as Completed,
    ROUND((COUNT(DISTINCT CASE WHEN e.Status = 'COMPLETED' THEN e.UserId END) / COUNT(DISTINCT e.UserId)) * 100, 2) as CompletionRate
FROM Courses c
JOIN Enrollments e ON c.Id = e.CourseId
GROUP BY c.Id, c.Title
ORDER BY CompletionRate DESC;

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to get user's course progress
DELIMITER //
CREATE FUNCTION GetUserCourseProgress(p_user_id CHAR(36), p_course_id CHAR(36))
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_lessons INT DEFAULT 0;
    DECLARE completed_lessons INT DEFAULT 0;
    DECLARE progress_percentage DECIMAL(5,2) DEFAULT 0.00;
    
    SELECT COUNT(*) INTO total_lessons
    FROM Lessons
    WHERE CourseId = p_course_id AND IsPublished = TRUE;
    
    SELECT COUNT(*) INTO completed_lessons
    FROM Progress
    WHERE UserId = p_user_id 
      AND CourseId = p_course_id 
      AND ProgressPercentage = 100;
    
    IF total_lessons > 0 THEN
        SET progress_percentage = (completed_lessons / total_lessons) * 100;
    END IF;
    
    RETURN progress_percentage;
END //
DELIMITER ;

-- Function to check if user is enrolled in course
DELIMITER //
CREATE FUNCTION IsUserEnrolled(p_user_id CHAR(36), p_course_id CHAR(36))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE enrollment_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO enrollment_count
    FROM Enrollments
    WHERE UserId = p_user_id 
      AND CourseId = p_course_id 
      AND Status = 'ACTIVE';
    
    RETURN enrollment_count > 0;
END //
DELIMITER ;

-- =====================================================
-- MAINTENANCE COMPLETION
-- =====================================================
SELECT 'Database maintenance queries and procedures created successfully!' as Status;
