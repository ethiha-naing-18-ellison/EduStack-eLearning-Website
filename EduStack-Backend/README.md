# EduStack Backend API

A comprehensive backend API for the EduStack eLearning platform built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Course Management**: Full CRUD operations for courses with instructor permissions
- **Enrollment System**: Complete enrollment flow with progress tracking
- **User Management**: User profiles, authentication, and role management
- **Review System**: Course reviews and ratings with statistics
- **Progress Tracking**: Detailed progress tracking for enrolled courses
- **File Upload**: Cloudinary integration for image and video uploads
- **Rate Limiting**: API rate limiting for security
- **Validation**: Comprehensive input validation using Joi
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # API controllers
├── dto/             # Data Transfer Objects
├── entities/        # TypeScript interfaces
├── middleware/      # Custom middleware
├── repositories/    # Data access layer
├── services/        # Business logic layer
└── index.ts         # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduStack-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/edustack_db"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="development"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # (Optional) Open Prisma Studio
   npm run db:studio
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/verify-token` | Verify JWT token | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | Get all courses | No |
| GET | `/courses/featured` | Get featured courses | No |
| GET | `/courses/popular` | Get popular courses | No |
| GET | `/courses/:id` | Get course by ID | No |
| POST | `/courses` | Create new course | Yes |
| PUT | `/courses/:id` | Update course | Yes |
| DELETE | `/courses/:id` | Delete course | Yes |
| GET | `/courses/instructor/my-courses` | Get instructor courses | Yes |

### Enrollment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/enrollments` | Enroll in course | Yes |
| GET | `/enrollments` | Get user enrollments | Yes |
| GET | `/enrollments/stats` | Get enrollment statistics | Yes |
| GET | `/enrollments/check/:courseId` | Check enrollment status | Yes |
| GET | `/enrollments/:id` | Get enrollment by ID | Yes |
| PUT | `/enrollments/:id` | Update enrollment status | Yes |
| DELETE | `/enrollments/:id` | Cancel enrollment | Yes |

### Progress Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/progress/:courseId` | Update course progress | Yes |
| GET | `/progress/:courseId` | Get course progress | Yes |
| GET | `/progress` | Get user progress | Yes |
| GET | `/progress/stats` | Get progress statistics | Yes |
| GET | `/progress/:id` | Get progress by ID | Yes |
| DELETE | `/progress/:id` | Delete progress | Yes |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews/course/:courseId` | Get course reviews | No |
| GET | `/reviews/course/:courseId/stats` | Get course rating stats | No |
| GET | `/reviews/:id` | Get review by ID | No |
| POST | `/reviews` | Create review | Yes |
| GET | `/reviews` | Get user reviews | Yes |
| PUT | `/reviews/:id` | Update review | Yes |
| DELETE | `/reviews/:id` | Delete review | Yes |

### Lesson Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/lessons` | Get all lessons | No |
| GET | `/lessons/:id` | Get lesson by ID | No |
| GET | `/lessons/course/:courseId` | Get course lessons | No |
| POST | `/lessons` | Create lesson | Yes |
| PUT | `/lessons/:id` | Update lesson | Yes |
| DELETE | `/lessons/:id` | Delete lesson | Yes |
| GET | `/lessons/course/:courseId/progress` | Get lessons with progress | Yes |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: User accounts with roles (STUDENT, INSTRUCTOR, ADMIN)
- **Courses**: Course information with instructor relationships
- **Enrollments**: User course enrollments with status tracking
- **Lessons**: Course lessons with video content
- **Progress**: User progress tracking for courses and lessons
- **Reviews**: Course reviews and ratings
- **Categories**: Course categories

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are properly configured:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong secret for JWT signing
- `NODE_ENV`: Set to "production"
- `CLOUDINARY_*`: Cloudinary configuration for file uploads
- `FRONTEND_URL`: Frontend application URL for CORS

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring

The API includes:

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error tracking and reporting
- Rate limiting for API protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
