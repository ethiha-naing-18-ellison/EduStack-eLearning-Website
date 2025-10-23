import { Request, Response } from 'express';
import Joi from 'joi';
import { CourseService } from '@/services/CourseService';
import { asyncHandler } from '@/middleware/error';
import { AuthRequest } from '@/middleware/auth';
import { CourseLevel } from '@prisma/client';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  // Validation schemas
  private createCourseSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    thumbnail: Joi.string().uri().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(2).max(50).required(),
    level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').required(),
    duration: Joi.number().min(1).max(52).required(), // 1 week to 1 year
  });

  private updateCourseSchema = Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().min(10).max(2000),
    thumbnail: Joi.string().uri(),
    price: Joi.number().min(0),
    category: Joi.string().min(2).max(50),
    level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    duration: Joi.number().min(1).max(52),
    isPublished: Joi.boolean(),
  });

  private courseQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    search: Joi.string().max(100),
    category: Joi.string().max(50),
    level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    sortBy: Joi.string().valid('title', 'price', 'createdAt', 'rating').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  });

  // Create new course
  createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.createCourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const instructorId = req.user!.id;
    const course = await this.courseService.createCourse(value, instructorId);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  });

  // Get all courses
  getCourses = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = this.courseQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const result = await this.courseService.getCourses(value);
    
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: result,
    });
  });

  // Get course by ID
  getCourseById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await this.courseService.getCourseById(id);
    
    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course,
    });
  });

  // Update course
  updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.updateCourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const course = await this.courseService.updateCourse(id, value, userId, userRole);
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  });

  // Delete course
  deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    
    await this.courseService.deleteCourse(id, userId, userRole);
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  });

  // Get instructor courses
  getInstructorCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.courseQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const instructorId = req.user!.id;
    const result = await this.courseService.getInstructorCourses(instructorId, value);
    
    res.status(200).json({
      success: true,
      message: 'Instructor courses retrieved successfully',
      data: result,
    });
  });

  // Get featured courses
  getFeaturedCourses = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;
    const courses = await this.courseService.getFeaturedCourses(limit);
    
    res.status(200).json({
      success: true,
      message: 'Featured courses retrieved successfully',
      data: courses,
    });
  });

  // Get popular courses
  getPopularCourses = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;
    const courses = await this.courseService.getPopularCourses(limit);
    
    res.status(200).json({
      success: true,
      message: 'Popular courses retrieved successfully',
      data: courses,
    });
  });
}
