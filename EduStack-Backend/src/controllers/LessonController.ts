import { Request, Response } from 'express';
import Joi from 'joi';
import { LessonService } from '@/services/LessonService';
import { asyncHandler } from '@/middleware/error';
import { AuthRequest } from '@/middleware/auth';

export class LessonController {
  private lessonService: LessonService;

  constructor() {
    this.lessonService = new LessonService();
  }

  // Validation schemas
  private createLessonSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000),
    videoUrl: Joi.string().uri(),
    duration: Joi.number().min(1).max(600).required(), // 1 minute to 10 hours
    order: Joi.number().min(1).required(),
    courseId: Joi.string().required(),
  });

  private updateLessonSchema = Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(1000),
    videoUrl: Joi.string().uri(),
    duration: Joi.number().min(1).max(600),
    order: Joi.number().min(1),
    isPublished: Joi.boolean(),
  });

  private lessonQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    courseId: Joi.string(),
    isPublished: Joi.boolean(),
    sortBy: Joi.string().valid('order', 'title', 'createdAt').default('order'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  });

  // Create lesson
  createLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.createLessonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const lesson = await this.lessonService.createLesson(value);
    
    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    });
  });

  // Get lessons
  getLessons = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = this.lessonQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const result = await this.lessonService.getLessons(value);
    
    res.status(200).json({
      success: true,
      message: 'Lessons retrieved successfully',
      data: result,
    });
  });

  // Get lesson by ID
  getLessonById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lesson = await this.lessonService.getLessonById(id);
    
    res.status(200).json({
      success: true,
      message: 'Lesson retrieved successfully',
      data: lesson,
    });
  });

  // Update lesson
  updateLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.updateLessonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const { id } = req.params;
    const lesson = await this.lessonService.updateLesson(id, value);
    
    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson,
    });
  });

  // Delete lesson
  deleteLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    await this.lessonService.deleteLesson(id);
    
    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  });

  // Get course lessons
  getCourseLessons = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { error, value } = this.lessonQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const result = await this.lessonService.getLessons({
      ...value,
      courseId,
    });
    
    res.status(200).json({
      success: true,
      message: 'Course lessons retrieved successfully',
      data: result,
    });
  });

  // Get lessons with progress
  getLessonsWithProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user!.id;
    const lessons = await this.lessonService.getLessonsWithProgress(courseId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Lessons with progress retrieved successfully',
      data: lessons,
    });
  });
}
