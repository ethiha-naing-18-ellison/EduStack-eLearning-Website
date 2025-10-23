-- =====================================================
-- EduStack Sample Data Script
-- =====================================================
-- This script inserts comprehensive sample data for testing and development
-- Run this after creating the database schema
-- =====================================================

USE EduStackDB;

-- =====================================================
-- ADDITIONAL SAMPLE USERS
-- =====================================================

-- Insert more instructors
INSERT INTO Users (Id, Email, PasswordHash, FullName, Role, Avatar, IsActive) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'sarah.johnson@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah Johnson', 'INSTRUCTOR', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE),
('550e8400-e29b-41d4-a716-446655440012', 'mike.chen@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike Chen', 'INSTRUCTOR', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE),
('550e8400-e29b-41d4-a716-446655440013', 'emma.wilson@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emma Wilson', 'INSTRUCTOR', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE);

-- Insert more students
INSERT INTO Users (Id, Email, PasswordHash, FullName, Role, Avatar, IsActive) VALUES
('550e8400-e29b-41d4-a716-446655440021', 'alex.smith@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alex Smith', 'STUDENT', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE),
('550e8400-e29b-41d4-a716-446655440022', 'lisa.brown@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lisa Brown', 'STUDENT', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE),
('550e8400-e29b-41d4-a716-446655440023', 'david.garcia@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David Garcia', 'STUDENT', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE),
('550e8400-e29b-41d4-a716-446655440024', 'maria.rodriguez@edustack.com', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Maria Rodriguez', 'STUDENT', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', TRUE);

-- =====================================================
-- ADDITIONAL SAMPLE COURSES
-- =====================================================

-- Data Science Course
INSERT INTO Courses (Id, Title, Description, Thumbnail, Price, Category, Level, Duration, InstructorId, IsPublished) VALUES
('550e8400-e29b-41d4-a716-446655440102', 'Data Science with Python', 'Learn data analysis, machine learning, and statistical modeling with Python. Master pandas, numpy, scikit-learn, and visualization libraries.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 249.99, 'Data Science', 'INTERMEDIATE', 10, '550e8400-e29b-41d4-a716-446655440011', TRUE),
('550e8400-e29b-41d4-a716-446655440103', 'Advanced Machine Learning', 'Deep dive into advanced ML algorithms, neural networks, and deep learning frameworks like TensorFlow and PyTorch.', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 399.99, 'Data Science', 'ADVANCED', 16, '550e8400-e29b-41d4-a716-446655440011', TRUE),
('550e8400-e29b-41d4-a716-446655440104', 'Cybersecurity Fundamentals', 'Learn essential cybersecurity concepts, ethical hacking, network security, and incident response.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 299.99, 'Cybersecurity', 'BEGINNER', 8, '550e8400-e29b-41d4-a716-446655440012', TRUE),
('550e8400-e29b-41d4-a716-446655440105', 'Cloud Computing with AWS', 'Master Amazon Web Services, cloud architecture, deployment strategies, and DevOps practices.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 349.99, 'Cloud Computing', 'INTERMEDIATE', 12, '550e8400-e29b-41d4-a716-446655440012', TRUE),
('550e8400-e29b-41d4-a716-446655440106', 'Mobile App Development', 'Build native iOS and Android apps using React Native, Flutter, and modern development practices.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 279.99, 'Mobile Development', 'INTERMEDIATE', 14, '550e8400-e29b-41d4-a716-446655440013', TRUE),
('550e8400-e29b-41d4-a716-446655440107', 'Business Strategy & Management', 'Learn strategic thinking, leadership, project management, and business analysis techniques.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 199.99, 'Business', 'BEGINNER', 6, '550e8400-e29b-41d4-a716-446655440013', TRUE);

-- =====================================================
-- ADDITIONAL LESSONS
-- =====================================================

-- Data Science Course Lessons
INSERT INTO Lessons (Id, Title, Description, VideoUrl, Duration, OrderIndex, CourseId, IsPublished) VALUES
('550e8400-e29b-41d4-a716-446655440220', 'Python for Data Science', 'Introduction to Python programming for data analysis', 'https://example.com/ds-video1', 60, 1, '550e8400-e29b-41d4-a716-446655440102', TRUE),
('550e8400-e29b-41d4-a716-446655440221', 'Data Manipulation with Pandas', 'Master pandas for data cleaning and manipulation', 'https://example.com/ds-video2', 75, 2, '550e8400-e29b-41d4-a716-446655440102', TRUE),
('550e8400-e29b-41d4-a716-446655440222', 'Data Visualization', 'Create compelling visualizations with matplotlib and seaborn', 'https://example.com/ds-video3', 80, 3, '550e8400-e29b-41d4-a716-446655440102', TRUE),
('550e8400-e29b-41d4-a716-446655440223', 'Machine Learning Basics', 'Introduction to supervised and unsupervised learning', 'https://example.com/ds-video4', 90, 4, '550e8400-e29b-41d4-a716-446655440102', TRUE);

-- Cybersecurity Course Lessons
INSERT INTO Lessons (Id, Title, Description, VideoUrl, Duration, OrderIndex, CourseId, IsPublished) VALUES
('550e8400-e29b-41d4-a716-446655440230', 'Introduction to Cybersecurity', 'Understanding threats, vulnerabilities, and security principles', 'https://example.com/cyber-video1', 50, 1, '550e8400-e29b-41d4-a716-446655440104', TRUE),
('550e8400-e29b-41d4-a716-446655440231', 'Network Security', 'Protecting networks from attacks and intrusions', 'https://example.com/cyber-video2', 65, 2, '550e8400-e29b-41d4-a716-446655440104', TRUE),
('550e8400-e29b-41d4-a716-446655440232', 'Ethical Hacking', 'Learn penetration testing and vulnerability assessment', 'https://example.com/cyber-video3', 70, 3, '550e8400-e29b-41d4-a716-446655440104', TRUE);

-- =====================================================
-- SAMPLE ENROLLMENTS
-- =====================================================

-- Multiple enrollments for different users
INSERT INTO Enrollments (Id, UserId, CourseId, Status, EnrolledAt) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440102', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 30 DAY)),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440101', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440104', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440105', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440103', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440106', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 45 DAY));

-- =====================================================
-- SAMPLE PROGRESS DATA
-- =====================================================

-- Progress for various users and courses
INSERT INTO Progress (Id, UserId, CourseId, LessonId, ProgressPercentage, CompletedAt, CreatedAt, UpdatedAt) VALUES
-- Alex Smith's progress in Data Science course
('550e8400-e29b-41d4-a716-446655440410', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440220', 100, DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY)),
('550e8400-e29b-41d4-a716-446655440411', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440221', 100, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
('550e8400-e29b-41d4-a716-446655440412', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440222', 75, NULL, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- Lisa Brown's progress in UI/UX course
('550e8400-e29b-41d4-a716-446655440420', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440210', 100, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('550e8400-e29b-41d4-a716-446655440421', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440211', 50, NULL, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- David Garcia's progress in Cybersecurity course
('550e8400-e29b-41d4-a716-446655440430', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440230', 100, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440431', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440231', 25, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- =====================================================
-- SAMPLE REVIEWS
-- =====================================================

-- Reviews for different courses
INSERT INTO Reviews (Id, UserId, CourseId, Rating, Comment, CreatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440102', 5, 'Excellent course! The instructor explains complex concepts very clearly. Highly recommended for anyone interested in data science.', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440101', 4, 'Great course for beginners. The UI/UX concepts are well explained with practical examples.', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440104', 5, 'Very comprehensive cybersecurity course. Learned a lot about network security and ethical hacking.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('550e8400-e29b-41d4-a716-446655440504', '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440105', 4, 'Good introduction to cloud computing. The AWS hands-on labs are very helpful.', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('550e8400-e29b-41d4-a716-446655440505', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440103', 5, 'Advanced course with deep technical content. Perfect for those who want to master machine learning.', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
SELECT 'Sample data inserted successfully!' as Status;
