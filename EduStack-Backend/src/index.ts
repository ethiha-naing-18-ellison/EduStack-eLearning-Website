import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from '@/config/app';
import { errorHandler, notFound } from '@/middleware/error';
import { authenticate, optionalAuth } from '@/middleware/auth';

// Import controllers
import { AuthController } from '@/controllers/AuthController';
import { CourseController } from '@/controllers/CourseController';
import { EnrollmentController } from '@/controllers/EnrollmentController';
import { ProgressController } from '@/controllers/ProgressController';
import { ReviewController } from '@/controllers/ReviewController';
import { LessonController } from '@/controllers/LessonController';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Initialize controllers
const authController = new AuthController();
const courseController = new CourseController();
const enrollmentController = new EnrollmentController();
const progressController = new ProgressController();
const reviewController = new ReviewController();
const lessonController = new LessonController();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduStack API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/verify-token', authController.verifyToken);
app.get('/api/auth/profile', authenticate, authController.getProfile);
app.put('/api/auth/profile', authenticate, authController.updateProfile);
app.put('/api/auth/change-password', authenticate, authController.changePassword);

// Course routes
app.get('/api/courses', courseController.getCourses);
app.get('/api/courses/featured', courseController.getFeaturedCourses);
app.get('/api/courses/popular', courseController.getPopularCourses);
app.get('/api/courses/:id', courseController.getCourseById);
app.post('/api/courses', authenticate, courseController.createCourse);
app.put('/api/courses/:id', authenticate, courseController.updateCourse);
app.delete('/api/courses/:id', authenticate, courseController.deleteCourse);
app.get('/api/courses/instructor/my-courses', authenticate, courseController.getInstructorCourses);

// Enrollment routes
app.post('/api/enrollments', authenticate, enrollmentController.enrollInCourse);
app.get('/api/enrollments', authenticate, enrollmentController.getUserEnrollments);
app.get('/api/enrollments/stats', authenticate, enrollmentController.getEnrollmentStats);
app.get('/api/enrollments/check/:courseId', authenticate, enrollmentController.checkEnrollment);
app.get('/api/enrollments/:id', authenticate, enrollmentController.getEnrollmentById);
app.put('/api/enrollments/:id', authenticate, enrollmentController.updateEnrollmentStatus);
app.delete('/api/enrollments/:id', authenticate, enrollmentController.cancelEnrollment);

// Progress routes
app.put('/api/progress/:courseId', authenticate, progressController.updateProgress);
app.get('/api/progress/:courseId', authenticate, progressController.getCourseProgress);
app.get('/api/progress', authenticate, progressController.getUserProgress);
app.get('/api/progress/stats', authenticate, progressController.getProgressStats);
app.get('/api/progress/:id', authenticate, progressController.getProgressById);
app.delete('/api/progress/:id', authenticate, progressController.deleteProgress);

// Review routes
app.get('/api/reviews/course/:courseId', reviewController.getCourseReviews);
app.get('/api/reviews/course/:courseId/stats', reviewController.getCourseRatingStats);
app.get('/api/reviews/:id', reviewController.getReviewById);
app.post('/api/reviews', authenticate, reviewController.createReview);
app.get('/api/reviews', authenticate, reviewController.getUserReviews);
app.put('/api/reviews/:id', authenticate, reviewController.updateReview);
app.delete('/api/reviews/:id', authenticate, reviewController.deleteReview);

// Lesson routes
app.get('/api/lessons', lessonController.getLessons);
app.get('/api/lessons/:id', lessonController.getLessonById);
app.get('/api/lessons/course/:courseId', lessonController.getCourseLessons);
app.post('/api/lessons', authenticate, lessonController.createLesson);
app.put('/api/lessons/:id', authenticate, lessonController.updateLesson);
app.delete('/api/lessons/:id', authenticate, lessonController.deleteLesson);
app.get('/api/lessons/course/:courseId/progress', authenticate, lessonController.getLessonsWithProgress);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 EduStack API server is running on port ${PORT}`);
  console.log(`📚 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
});

export default app;
