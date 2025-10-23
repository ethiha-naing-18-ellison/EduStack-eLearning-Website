import { ProgressRepository } from '@/repositories/ProgressRepository';
import { UpdateProgressDto, ProgressResponseDto, CourseProgressDto } from '@/dto/progress.dto';
import { createError } from '@/middleware/error';

export class ProgressService {
  private progressRepository: ProgressRepository;

  constructor() {
    this.progressRepository = new ProgressRepository();
  }

  async updateProgress(
    userId: string,
    courseId: string,
    data: UpdateProgressDto
  ): Promise<ProgressResponseDto> {
    // Check if user is enrolled in the course
    // This would typically be done by checking enrollment status
    // For now, we'll assume the user is enrolled

    const progress = await this.progressRepository.upsertProgress({
      userId,
      courseId,
      lessonId: data.lessonId,
      progress: data.progress,
    });

    return {
      id: progress.id,
      course: progress.course,
      lesson: progress.lesson,
      progress: progress.progress,
      completedAt: progress.completedAt,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  async getUserCourseProgress(userId: string, courseId: string): Promise<CourseProgressDto> {
    const courseProgress = await this.progressRepository.getUserCourseProgress(userId, courseId);
    
    // Get lessons for the course
    const lessons = await this.progressRepository.findMany({
      userId,
      courseId,
    });

    const lessonsWithProgress = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title || 'Unknown Lesson',
      duration: lesson.duration || 0,
      order: lesson.order || 0,
      progress: lesson.progress,
      completedAt: lesson.completedAt,
    }));

    return {
      courseId: courseProgress.courseId,
      courseTitle: courseProgress.courseTitle,
      courseThumbnail: courseProgress.courseThumbnail,
      totalLessons: courseProgress.totalLessons,
      completedLessons: courseProgress.completedLessons,
      progress: courseProgress.progress,
      lastAccessed: courseProgress.lastAccessed,
      lessons: lessonsWithProgress,
    };
  }

  async getUserProgress(userId: string, options?: {
    page?: number;
    limit?: number;
    courseId?: string;
  }): Promise<ProgressResponseDto[]> {
    const { page = 1, limit = 10, courseId } = options || {};

    const progress = await this.progressRepository.findMany({
      userId,
      courseId,
      page,
      limit,
    });

    return progress.map(p => ({
      id: p.id,
      course: p.course,
      lesson: p.lesson,
      progress: p.progress,
      completedAt: p.completedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async getProgressById(id: string, userId: string): Promise<ProgressResponseDto> {
    const progress = await this.progressRepository.findById(id);
    if (!progress) {
      throw createError('Progress not found', 404);
    }

    // Check if user owns this progress
    if (progress.userId !== userId) {
      throw createError('Unauthorized to access this progress', 403);
    }

    return {
      id: progress.id,
      course: progress.course,
      lesson: progress.lesson,
      progress: progress.progress,
      completedAt: progress.completedAt,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  async deleteProgress(id: string, userId: string): Promise<void> {
    const progress = await this.progressRepository.findById(id);
    if (!progress) {
      throw createError('Progress not found', 404);
    }

    // Check if user owns this progress
    if (progress.userId !== userId) {
      throw createError('Unauthorized to delete this progress', 403);
    }

    await this.progressRepository.delete(id);
  }

  async getProgressStats(userId: string) {
    const totalProgress = await this.progressRepository.count({ userId });
    const completedProgress = await this.progressRepository.count({
      userId,
      // Assuming progress === 100 means completed
    });

    // Get course progress
    const courseProgress = await this.progressRepository.findMany({
      userId,
    });

    const courses = new Set(courseProgress.map(p => p.courseId));
    const totalCourses = courses.size;

    return {
      totalProgress,
      completedProgress,
      totalCourses,
      completionRate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
    };
  }
}
