import { Request, Response } from 'express';
import Joi from 'joi';
import { EnrollmentService } from '@/services/EnrollmentService';
import { asyncHandler } from '@/middleware/error';
import { AuthRequest } from '@/middleware/auth';
import { EnrollmentStatus } from '@prisma/client';

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    this.enrollmentService = new EnrollmentService();
  }

  // Validation schemas
  private createEnrollmentSchema = Joi.object({
    courseId: Joi.string().required(),
  });

  private enrollmentQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    status: Joi.string().valid('ACTIVE', 'COMPLETED', 'CANCELLED'),
    sortBy: Joi.string().valid('enrolledAt', 'courseTitle', 'progress').default('enrolledAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  });

  private updateEnrollmentSchema = Joi.object({
    status: Joi.string().valid('ACTIVE', 'COMPLETED', 'CANCELLED').required(),
  });

  // Enroll in course
  enrollInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.createEnrollmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const enrollment = await this.enrollmentService.enrollInCourse(value, userId);
    
    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment,
    });
  });

  // Get user enrollments
  getUserEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.enrollmentQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const result = await this.enrollmentService.getUserEnrollments(userId, value);
    
    res.status(200).json({
      success: true,
      message: 'Enrollments retrieved successfully',
      data: result,
    });
  });

  // Get enrollment by ID
  getEnrollmentById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const enrollment = await this.enrollmentService.getEnrollmentById(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment retrieved successfully',
      data: enrollment,
    });
  });

  // Update enrollment status
  updateEnrollmentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.updateEnrollmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const { id } = req.params;
    const userId = req.user!.id;
    const enrollment = await this.enrollmentService.updateEnrollmentStatus(
      id,
      value.status as EnrollmentStatus,
      userId
    );
    
    res.status(200).json({
      success: true,
      message: 'Enrollment status updated successfully',
      data: enrollment,
    });
  });

  // Cancel enrollment
  cancelEnrollment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    
    await this.enrollmentService.cancelEnrollment(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment cancelled successfully',
    });
  });

  // Check enrollment status
  checkEnrollment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user!.id;
    
    const isEnrolled = await this.enrollmentService.checkEnrollment(userId, courseId);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment status checked successfully',
      data: { isEnrolled },
    });
  });

  // Get enrollment stats
  getEnrollmentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const stats = await this.enrollmentService.getEnrollmentStats(userId);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment stats retrieved successfully',
      data: stats,
    });
  });
}
