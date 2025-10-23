import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@/config/app';
import { UserRepository } from '@/repositories/UserRepository';
import { RegisterDto, LoginDto, AuthResponseDto } from '@/dto/auth.dto';
import { UserRole } from '@prisma/client';
import { createError } from '@/middleware/error';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: data.role,
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError('Account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, data: {
    fullName?: string;
    avatar?: string;
  }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    const updatedUser = await this.userRepository.update(userId, data);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw createError('Current password is incorrect', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Password updated successfully' };
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { id: userId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user || !user.isActive) {
        throw createError('Invalid token', 401);
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw createError('Invalid token', 401);
    }
  }
}
