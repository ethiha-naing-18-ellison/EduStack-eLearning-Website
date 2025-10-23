# EduStack eLearning Platform - Backend API

A comprehensive .NET 8 Web API for the EduStack eLearning platform with JWT authentication, Entity Framework Core, and Swagger documentation.

## 🛠️ Technology Stack

- **.NET 8** - Latest .NET framework
- **Entity Framework Core** - ORM for database operations
- **SQL Server** - Database (LocalDB for development)
- **JWT Authentication** - Secure token-based authentication
- **AutoMapper** - Object-to-object mapping
- **Swagger/OpenAPI** - API documentation
- **Serilog** - Structured logging
- **BCrypt** - Password hashing

## 📁 Project Structure

```
EduStack-Backend/
├── EduStack.API/                 # Main API project
│   ├── Controllers/              # API Controllers
│   │   ├── AuthController.cs     # Authentication endpoints
│   │   ├── CoursesController.cs  # Course management
│   │   └── EnrollmentsController.cs # Enrollment management
│   ├── Properties/
│   │   └── launchSettings.json   # Launch configuration
│   ├── Program.cs                # Application startup
│   ├── appsettings.json         # Configuration
│   └── AutoMapperProfile.cs      # AutoMapper configuration
├── EduStack.Core/                # Core business logic
│   ├── Entities/                 # Domain entities
│   │   ├── User.cs
│   │   ├── Course.cs
│   │   ├── Enrollment.cs
│   │   ├── Lesson.cs
│   │   ├── Progress.cs
│   │   ├── Review.cs
│   │   └── Category.cs
│   ├── DTOs/                     # Data Transfer Objects
│   │   ├── Auth/
│   │   ├── Course/
│   │   ├── Enrollment/
│   │   └── Common/
│   └── Interfaces/               # Service interfaces
├── EduStack.Infrastructure/      # Data access layer
│   ├── Data/
│   │   └── EduStackDbContext.cs  # Entity Framework context
│   └── Services/                  # Service implementations
└── EduStack.API.sln             # Solution file
```

## 🚀 Getting Started

### Prerequisites

- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Visual Studio 2022** or **Visual Studio Code**
- **SQL Server LocalDB** (included with Visual Studio)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduStack-Backend
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Update connection string** (if needed)
   - Edit `EduStack.API/appsettings.json`
   - Update the `DefaultConnection` string for your database

4. **Build the solution**
   ```bash
   dotnet build
   ```

5. **Run the application**
   ```bash
   dotnet run --project EduStack.API
   ```

### Visual Studio Setup

1. **Open the solution**
   - Open `EduStack.API.sln` in Visual Studio 2022

2. **Set startup project**
   - Right-click on `EduStack.API` project
   - Select "Set as Startup Project"

3. **Run the application**
   - Press `F5` or click "Start Debugging"
   - The API will start on `http://localhost:5000`
   - Swagger UI will be available at `http://localhost:5000`

## 📚 API Documentation

### Swagger UI
Once the application is running, visit:
- **Swagger UI**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/{id}` - Get user by ID

#### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/category/{category}` - Get courses by category
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/instructor/{instructorId}` - Get courses by instructor

#### Enrollments (Requires Authentication)
- `POST /api/enrollments/enroll/{courseId}` - Enroll in course
- `GET /api/enrollments/my-enrollments` - Get user enrollments
- `GET /api/enrollments/check/{courseId}` - Check enrollment status
- `GET /api/enrollments/course/{courseId}` - Get enrollment details

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register** a new user via `POST /api/auth/register`
2. **Login** via `POST /api/auth/login` to get a JWT token
3. **Include the token** in the Authorization header for protected endpoints:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## 🗄️ Database

### Entity Framework Migrations

The application uses Entity Framework Code First approach:

1. **Database is automatically created** on first run
2. **Seed data** is included for categories
3. **No manual migrations needed** for development

### Database Schema

- **Users** - User accounts and authentication
- **Courses** - Course information and metadata
- **Enrollments** - User course enrollments
- **Lessons** - Course lessons and content
- **Progress** - User progress tracking
- **Reviews** - Course reviews and ratings
- **Categories** - Course categories

## 🔧 Configuration

### JWT Settings
```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-jwt-key-here",
    "Issuer": "EduStack",
    "Audience": "EduStack-Users",
    "ExpiryInDays": 7
  }
}
```

### CORS Settings
The API is configured to allow requests from:
- `http://localhost:3000` (React frontend)

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "errors": []
}
```

## 🧪 Testing the API

### Using Swagger UI
1. Open `http://localhost:5000` in your browser
2. Use the "Authorize" button to add JWT token
3. Test endpoints directly from the Swagger interface

### Using Postman/Insomnia
1. Register a new user via `POST /api/auth/register`
2. Copy the JWT token from the response
3. Add the token to Authorization header: `Bearer <token>`
4. Test protected endpoints

## 🚀 Deployment

### Production Configuration
1. Update `appsettings.json` with production database connection
2. Set strong JWT secret key
3. Configure CORS for production frontend URL
4. Set up proper logging configuration

### Docker Support (Optional)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
COPY . /app
WORKDIR /app
EXPOSE 80
ENTRYPOINT ["dotnet", "EduStack.API.dll"]
```

## 📊 Logging

The application uses Serilog for structured logging:
- **Console output** for development
- **File logging** to `logs/` directory
- **Log levels** configurable via appsettings

## 🔄 Frontend Integration

This API is designed to work with the EduStack React frontend:
- **CORS** configured for `http://localhost:3000`
- **JWT authentication** for protected routes
- **RESTful endpoints** matching frontend requirements

## 📞 Support

For issues or questions:
- Check the Swagger documentation at `/swagger`
- Review the logs in the `logs/` directory
- Ensure database connection is properly configured

---

**EduStack eLearning Platform Backend API**  
Built with .NET 8, Entity Framework Core, and JWT Authentication
