import { Request, Response } from 'express';
import Joi from 'joi';
import { AuthService } from '@/services/AuthService';
import { asyncHandler } from '@/middleware/error';
import { AuthRequest } from '@/middleware/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Validation schemas
  private registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('STUDENT', 'INSTRUCTOR').required(),
  });

  private loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  private changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  });

  private updateProfileSchema = Joi.object({
    fullName: Joi.string().min(2).max(100),
    avatar: Joi.string().uri(),
  });

  // Register new user
  register = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = this.registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const result = await this.authService.register(value);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  // Login user
  login = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = this.loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const result = await this.authService.login(value);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  // Get user profile
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const profile = await this.authService.getProfile(userId);
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    });
  });

  // Update user profile
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const profile = await this.authService.updateProfile(userId, value);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  });

  // Change password
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = this.changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const userId = req.user!.id;
    const result = await this.authService.changePassword(
      userId,
      value.currentPassword,
      value.newPassword
    );
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  // Verify token
  verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const user = await this.authService.verifyToken(token);
    
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: user,
    });
  });
}
