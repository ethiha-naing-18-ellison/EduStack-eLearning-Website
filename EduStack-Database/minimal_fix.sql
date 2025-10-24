-- Minimal Database Fix
-- This will fix the immediate 500 error
-- Run this script while connected to EduStackDB database

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

-- Drop existing tables if they exist
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordhash VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    avatar VARCHAR(500) NULL,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER',
    duration INTEGER NOT NULL,
    instructorid UUID NOT NULL,
    ispublished BOOLEAN NOT NULL DEFAULT FALSE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructorid) REFERENCES users(id) ON DELETE RESTRICT
);

-- Create Lessons table with correct column name
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    videourl VARCHAR(500) NULL,
    duration INTEGER NOT NULL,
    orderindex INTEGER NOT NULL DEFAULT 0,
    courseid UUID NOT NULL,
    ispublished BOOLEAN NOT NULL DEFAULT FALSE,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    courseid UUID NOT NULL,
    enrolledat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'not-started',
    completedat TIMESTAMP NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userid, courseid)
);

-- Create Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    courseid UUID NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseid) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userid, courseid)
);

-- Create Progress table
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

-- Create basic indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_instructorid ON courses(instructorid);
CREATE INDEX idx_lessons_courseid ON lessons(courseid);
CREATE INDEX idx_lessons_orderindex ON lessons(orderindex);

SELECT 'Database fixed successfully!' as status;
