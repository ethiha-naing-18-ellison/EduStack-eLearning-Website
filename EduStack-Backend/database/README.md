# EduStack Database Setup

This directory contains SQL scripts to set up the EduStack eLearning platform database.

## 📁 Files

- `create_tables.sql` - Creates all necessary tables, indexes, and triggers
- `insert_sample_data.sql` - Inserts sample data for testing and development

## 🚀 Quick Setup

### 1. Create Database Tables

Run the following SQL script in your EduStackDB database:

```sql
-- Execute the create_tables.sql file
\i database/create_tables.sql
```

Or copy and paste the contents of `create_tables.sql` into your database management tool.

### 2. Insert Sample Data (Optional)

To populate the database with sample data for testing:

```sql
-- Execute the insert_sample_data.sql file
\i database/insert_sample_data.sql
```

## 📊 Database Schema

### Tables Created:

1. **users** - User accounts (students, instructors, admins)
2. **categories** - Course categories
3. **courses** - Course information
4. **lessons** - Course lessons
5. **enrollments** - User course enrollments
6. **progress** - User progress tracking
7. **reviews** - Course reviews and ratings

### Key Features:

- **UUID Primary Keys**: All tables use UUID primary keys
- **Foreign Key Constraints**: Proper relationships between tables
- **Indexes**: Performance indexes on frequently queried columns
- **Triggers**: Automatic `updated_at` timestamp updates
- **Enums**: Type-safe enums for roles, levels, and statuses
- **Unique Constraints**: Prevent duplicate enrollments and reviews

## 🔧 Database Connection

Update your backend configuration to connect to the database:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/EduStackDB"
```

## 📝 Sample Data Included:

- **Categories**: 8 course categories (Web Development, Data Science, etc.)
- **Users**: 7 sample users (1 admin, 4 instructors, 2 students)
- **Courses**: 4 sample courses with different levels and categories
- **Lessons**: Sample lessons for the first course
- **Enrollments**: Sample student enrollments
- **Progress**: Sample progress tracking data
- **Reviews**: Sample course reviews and ratings

## 🛠️ Manual Setup Steps:

1. **Connect to your EduStackDB database**
2. **Run the create_tables.sql script**
3. **Optionally run insert_sample_data.sql for sample data**
4. **Verify tables are created successfully**

## ✅ Verification Queries:

```sql
-- Check if all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check sample data
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as course_count FROM courses;
SELECT COUNT(*) as enrollment_count FROM enrollments;
```

Your database is now ready for the EduStack eLearning platform! 🚀
