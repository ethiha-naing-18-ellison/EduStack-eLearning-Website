-- Sample data insertion for EduStack database
-- This script inserts sample data for testing and development

-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES
('Web Development', 'Learn modern web development technologies', 'code'),
('Data Science', 'Master data analysis and machine learning', 'science'),
('UI/UX Design', 'Create beautiful and user-friendly interfaces', 'palette'),
('Business', 'Develop business and management skills', 'business'),
('Cybersecurity', 'Protect systems and data from threats', 'security'),
('Cloud Computing', 'Learn cloud platforms and services', 'cloud'),
('Mobile Development', 'Build mobile applications', 'phone_android'),
('Programming', 'Master programming fundamentals', 'school');

-- Insert sample users (instructors and students)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@edustack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'Admin User', 'ADMIN'),
('sarah.johnson@edustack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'Sarah Johnson', 'INSTRUCTOR'),
('mike.chen@edustack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'Mike Chen', 'INSTRUCTOR'),
('emily.rodriguez@edustack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'Dr. Emily Rodriguez', 'INSTRUCTOR'),
('alex.thompson@edustack.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'Alex Thompson', 'INSTRUCTOR'),
('student1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'John Doe', 'STUDENT'),
('student2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'Jane Smith', 'STUDENT');

-- Insert sample courses
INSERT INTO courses (title, description, thumbnail, price, category, level, duration, instructor_id, is_published) VALUES
('Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, React, Node.js and build real-world projects', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop', 199.00, 'Web Development', 'BEGINNER', 12, (SELECT id FROM users WHERE email = 'sarah.johnson@edustack.com'), true),
('Advanced React & Redux', 'Master React hooks, Redux state management, and advanced patterns', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop', 149.00, 'Web Development', 'INTERMEDIATE', 8, (SELECT id FROM users WHERE email = 'mike.chen@edustack.com'), true),
('Python Data Science Masterclass', 'Complete data science course with Python, pandas, scikit-learn, and machine learning', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop', 299.00, 'Data Science', 'ADVANCED', 16, (SELECT id FROM users WHERE email = 'emily.rodriguez@edustack.com'), true),
('UI/UX Design Fundamentals', 'Learn design principles, user research, wireframing, and prototyping', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop', 99.00, 'UI/UX Design', 'BEGINNER', 6, (SELECT id FROM users WHERE email = 'alex.thompson@edustack.com'), true);

-- Insert sample lessons for the first course
INSERT INTO lessons (title, description, video_url, duration, "order", course_id, is_published) VALUES
('Introduction to Web Development', 'Overview of web development and course structure', 'https://example.com/video1', 15, 1, (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), true),
('HTML Fundamentals', 'Learn HTML structure, tags, and semantic markup', 'https://example.com/video2', 45, 2, (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), true),
('CSS Styling', 'Master CSS selectors, properties, and layout techniques', 'https://example.com/video3', 60, 3, (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), true),
('JavaScript Basics', 'Introduction to JavaScript programming fundamentals', 'https://example.com/video4', 90, 4, (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), true);

-- Insert sample enrollments
INSERT INTO enrollments (user_id, course_id, status) VALUES
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), 'ACTIVE'),
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'UI/UX Design Fundamentals'), 'ACTIVE'),
((SELECT id FROM users WHERE email = 'student2@example.com'), (SELECT id FROM courses WHERE title = 'Python Data Science Masterclass'), 'ACTIVE'),
((SELECT id FROM users WHERE email = 'student2@example.com'), (SELECT id FROM courses WHERE title = 'Advanced React & Redux'), 'COMPLETED');

-- Insert sample progress
INSERT INTO progress (user_id, course_id, lesson_id, progress, completed_at) VALUES
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), (SELECT id FROM lessons WHERE title = 'Introduction to Web Development'), 100, CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), (SELECT id FROM lessons WHERE title = 'HTML Fundamentals'), 100, CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), (SELECT id FROM lessons WHERE title = 'CSS Styling'), 75, NULL);

-- Insert sample reviews
INSERT INTO reviews (user_id, course_id, rating, comment) VALUES
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp'), 5, 'Excellent course! Very well structured and easy to follow.'),
((SELECT id FROM users WHERE email = 'student2@example.com'), (SELECT id FROM courses WHERE title = 'Python Data Science Masterclass'), 4, 'Great content, but could use more practical examples.'),
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM courses WHERE title = 'UI/UX Design Fundamentals'), 5, 'Perfect for beginners. Highly recommended!');
