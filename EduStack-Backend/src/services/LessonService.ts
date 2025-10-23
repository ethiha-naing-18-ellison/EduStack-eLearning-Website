import { LessonRepository } from '@/repositories/LessonRepository';
import { CreateLessonDto, UpdateLessonDto, LessonResponseDto, LessonListResponseDto } from '@/dto/lesson.dto';
import { createError } from '@/middleware/error';

export class LessonService {
  private lessonRepository: LessonRepository;

  constructor() {
    this.lessonRepository = new LessonRepository();
  }

  async createLesson(data: CreateLessonDto): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.create(data);

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order,
      courseId: lesson.courseId,
      isPublished: lesson.isPublished,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }

  async getLessons(options?: {
    page?: number;
    limit?: number;
    courseId?: string;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<LessonListResponseDto> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const lessons = await this.lessonRepository.findMany(options);
    const total = await this.lessonRepository.count(options);
    const totalPages = Math.ceil(total / limit);

    const lessonResponses: LessonResponseDto[] = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order,
      courseId: lesson.courseId,
      isPublished: lesson.isPublished,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }));

    return {
      lessons: lessonResponses,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getLessonById(id: string): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw createError('Lesson not found', 404);
    }

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order,
      courseId: lesson.courseId,
      isPublished: lesson.isPublished,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }

  async updateLesson(id: string, data: UpdateLessonDto): Promise<LessonResponseDto> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw createError('Lesson not found', 404);
    }

    const updatedLesson = await this.lessonRepository.update(id, data);

    return {
      id: updatedLesson.id,
      title: updatedLesson.title,
      description: updatedLesson.description,
      videoUrl: updatedLesson.videoUrl,
      duration: updatedLesson.duration,
      order: updatedLesson.order,
      courseId: updatedLesson.courseId,
      isPublished: updatedLesson.isPublished,
      createdAt: updatedLesson.createdAt,
      updatedAt: updatedLesson.updatedAt,
    };
  }

  async deleteLesson(id: string): Promise<void> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw createError('Lesson not found', 404);
    }

    await this.lessonRepository.delete(id);
  }

  async getLessonsWithProgress(courseId: string, userId: string) {
    return this.lessonRepository.getLessonsWithProgress(courseId, userId);
  }
}
