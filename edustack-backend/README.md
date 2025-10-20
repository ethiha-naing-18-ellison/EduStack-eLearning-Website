# 🎓 EduStack Backend API

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edustack
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the API
- Health Check: `http://localhost:5000/api/health`
- Database Check: `http://localhost:5000/api/health/database`

## 📊 Database Models

The following models are automatically created:

- **Users** - User accounts with roles
- **Roles** - Admin, Instructor, Student roles
- **Courses** - Course information
- **CourseSections** - Course sections/chapters
- **Lessons** - Individual lessons
- **Resources** - Lesson resources (files, videos)
- **Enrollments** - Student course enrollments
- **LessonProgress** - Student progress tracking
- **Payments** - Payment transactions
- **Reviews** - Course reviews and ratings
- **InstructorApplications** - Instructor applications
- **Categories** - Course categories

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## 📁 Project Structure

```
edustack-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── role.js
│   │   ├── course.js
│   │   └── ... (other models)
│   ├── migrations/
│   ├── seeds/
│   └── app.js
├── .env
└── package.json
```

## 🗄️ Database Setup

Make sure you have PostgreSQL running and create a database named `edustack`. The application will automatically create all necessary tables when you start the server.

## 🔍 API Endpoints

### Health Endpoints
- `GET /` - Welcome message
- `GET /api/health` - API health check
- `GET /api/health/database` - Database connection check

## 🛠️ Development

The server uses Sequelize ORM with PostgreSQL. All models are defined in the `src/models/` directory with proper associations.

For production deployment, make sure to:
1. Set proper environment variables
2. Use a production database
3. Configure proper security settings
4. Set up SSL/TLS certificates
