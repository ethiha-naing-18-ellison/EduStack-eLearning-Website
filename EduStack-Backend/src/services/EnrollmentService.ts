import { EnrollmentRepository } from '@/repositories/EnrollmentRepository';
import { CreateEnrollmentDto, EnrollmentResponseDto, EnrollmentListResponseDto, EnrollmentQueryDto } from '@/dto/enrollment.dto';
import { createError } from '@/middleware/error';
import { EnrollmentStatus } from '@prisma/client';

export class EnrollmentService {
  private enrollmentRepository: EnrollmentRepository;

  constructor() {
    this.enrollmentRepository = new EnrollmentRepository();
  }

  async enrollInCourse(data: CreateEnrollmentDto, userId: string): Promise<EnrollmentResponseDto> {
    // Check if user is already enrolled
    const existingEnrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (existingEnrollment) {
      throw createError('You are already enrolled in this course', 409);
    }

    // Create enrollment
    const enrollment = await this.enrollmentRepository.create({
      userId,
      courseId: data.courseId,
    });

    // Get progress for the enrollment
    const enrollmentsWithProgress = await this.enrollmentRepository.getUserEnrollments(userId, {
      limit: 1,
    });

    const enrollmentWithProgress = enrollmentsWithProgress.find(
      e => e.id === enrollment.id
    );

    return {
      id: enrollment.id,
      course: enrollment.course,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      progress: enrollmentWithProgress?.progress || {
        progress: 0,
        completedLessons: 0,
        totalLessons: 0,
      },
    };
  }

  async getUserEnrollments(userId: string, query: EnrollmentQueryDto): Promise<EnrollmentListResponseDto> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const enrollments = await this.enrollmentRepository.getUserEnrollments(userId, {
      ...query,
      page,
      limit,
    });

    const total = await this.enrollmentRepository.count({
      userId,
      status: query.status,
    });

    const totalPages = Math.ceil(total / limit);

    const enrollmentResponses: EnrollmentResponseDto[] = enrollments.map(enrollment => ({
      id: enrollment.id,
      course: enrollment.course,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      progress: enrollment.progress,
    }));

    return {
      enrollments: enrollmentResponses,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getEnrollmentById(id: string, userId: string): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw createError('Enrollment not found', 404);
    }

    // Check if user owns this enrollment
    if (enrollment.userId !== userId) {
      throw createError('Unauthorized to access this enrollment', 403);
    }

    // Get progress for the enrollment
    const enrollmentsWithProgress = await this.enrollmentRepository.getUserEnrollments(userId, {
      limit: 1,
    });

    const enrollmentWithProgress = enrollmentsWithProgress.find(
      e => e.id === enrollment.id
    );

    return {
      id: enrollment.id,
      course: enrollment.course,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      progress: enrollmentWithProgress?.progress || {
        progress: 0,
        completedLessons: 0,
        totalLessons: 0,
      },
    };
  }

  async updateEnrollmentStatus(
    id: string,
    status: EnrollmentStatus,
    userId: string
  ): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw createError('Enrollment not found', 404);
    }

    // Check if user owns this enrollment
    if (enrollment.userId !== userId) {
      throw createError('Unauthorized to update this enrollment', 403);
    }

    const updatedEnrollment = await this.enrollmentRepository.update(id, {
      status,
      completedAt: status === 'COMPLETED' ? new Date() : undefined,
    });

    // Get progress for the enrollment
    const enrollmentsWithProgress = await this.enrollmentRepository.getUserEnrollments(userId, {
      limit: 1,
    });

    const enrollmentWithProgress = enrollmentsWithProgress.find(
      e => e.id === updatedEnrollment.id
    );

    return {
      id: updatedEnrollment.id,
      course: updatedEnrollment.course,
      status: updatedEnrollment.status,
      enrolledAt: updatedEnrollment.enrolledAt,
      completedAt: updatedEnrollment.completedAt,
      progress: enrollmentWithProgress?.progress || {
        progress: 0,
        completedLessons: 0,
        totalLessons: 0,
      },
    };
  }

  async cancelEnrollment(id: string, userId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw createError('Enrollment not found', 404);
    }

    // Check if user owns this enrollment
    if (enrollment.userId !== userId) {
      throw createError('Unauthorized to cancel this enrollment', 403);
    }

    // Check if enrollment can be cancelled
    if (enrollment.status === 'CANCELLED') {
      throw createError('Enrollment is already cancelled', 400);
    }

    await this.enrollmentRepository.update(id, {
      status: 'CANCELLED',
    });
  }

  async checkEnrollment(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    return enrollment !== null && enrollment.status === 'ACTIVE';
  }

  async getEnrollmentStats(userId: string) {
    const totalEnrollments = await this.enrollmentRepository.count({ userId });
    const activeEnrollments = await this.enrollmentRepository.count({ 
      userId, 
      status: 'ACTIVE' 
    });
    const completedEnrollments = await this.enrollmentRepository.count({ 
      userId, 
      status: 'COMPLETED' 
    });

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
    };
  }
}
