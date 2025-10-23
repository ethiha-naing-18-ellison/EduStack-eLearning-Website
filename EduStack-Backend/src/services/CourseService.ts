import { CourseRepository } from '@/repositories/CourseRepository';
import { CreateCourseDto, UpdateCourseDto, CourseResponseDto, CourseListResponseDto, CourseQueryDto } from '@/dto/course.dto';
import { createError } from '@/middleware/error';
import { UserRole } from '@prisma/client';

export class CourseService {
  private courseRepository: CourseRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
  }

  async createCourse(data: CreateCourseDto, instructorId: string): Promise<CourseResponseDto> {
    const course = await this.courseRepository.create({
      ...data,
      instructorId,
    });

    const stats = await this.courseRepository.getCourseStats(course.id);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: Number(course.price),
      category: course.category,
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      isPublished: course.isPublished,
      enrollmentCount: stats?.enrollmentCount || 0,
      averageRating: stats?.averageRating || 0,
      reviewCount: stats?.reviewCount || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  async getCourseById(id: string): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw createError('Course not found', 404);
    }

    const stats = await this.courseRepository.getCourseStats(course.id);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: Number(course.price),
      category: course.category,
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      isPublished: course.isPublished,
      enrollmentCount: stats?.enrollmentCount || 0,
      averageRating: stats?.averageRating || 0,
      reviewCount: stats?.reviewCount || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  async getCourses(query: CourseQueryDto): Promise<CourseListResponseDto> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const courses = await this.courseRepository.findMany({
      ...query,
      page,
      limit,
    });

    const total = await this.courseRepository.count(query);
    const totalPages = Math.ceil(total / limit);

    const courseResponses: CourseResponseDto[] = await Promise.all(
      courses.map(async (course) => {
        const stats = await this.courseRepository.getCourseStats(course.id);
        
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          price: Number(course.price),
          category: course.category,
          level: course.level,
          duration: course.duration,
          instructor: course.instructor,
          isPublished: course.isPublished,
          enrollmentCount: stats?.enrollmentCount || 0,
          averageRating: stats?.averageRating || 0,
          reviewCount: stats?.reviewCount || 0,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        };
      })
    );

    return {
      courses: courseResponses,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updateCourse(id: string, data: UpdateCourseDto, userId: string, userRole: UserRole): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw createError('Course not found', 404);
    }

    // Check if user is the instructor or admin
    if (userRole !== 'ADMIN' && course.instructorId !== userId) {
      throw createError('Unauthorized to update this course', 403);
    }

    const updatedCourse = await this.courseRepository.update(id, data);
    const stats = await this.courseRepository.getCourseStats(updatedCourse.id);

    return {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      thumbnail: updatedCourse.thumbnail,
      price: Number(updatedCourse.price),
      category: updatedCourse.category,
      level: updatedCourse.level,
      duration: updatedCourse.duration,
      instructor: updatedCourse.instructor,
      isPublished: updatedCourse.isPublished,
      enrollmentCount: stats?.enrollmentCount || 0,
      averageRating: stats?.averageRating || 0,
      reviewCount: stats?.reviewCount || 0,
      createdAt: updatedCourse.createdAt,
      updatedAt: updatedCourse.updatedAt,
    };
  }

  async deleteCourse(id: string, userId: string, userRole: UserRole): Promise<void> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw createError('Course not found', 404);
    }

    // Check if user is the instructor or admin
    if (userRole !== 'ADMIN' && course.instructorId !== userId) {
      throw createError('Unauthorized to delete this course', 403);
    }

    await this.courseRepository.delete(id);
  }

  async getInstructorCourses(instructorId: string, query: CourseQueryDto): Promise<CourseListResponseDto> {
    return this.getCourses({
      ...query,
      instructorId,
    });
  }

  async getFeaturedCourses(limit: number = 6): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.findMany({
      limit,
      isPublished: true,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const courseResponses: CourseResponseDto[] = await Promise.all(
      courses.map(async (course) => {
        const stats = await this.courseRepository.getCourseStats(course.id);
        
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          price: Number(course.price),
          category: course.category,
          level: course.level,
          duration: course.duration,
          instructor: course.instructor,
          isPublished: course.isPublished,
          enrollmentCount: stats?.enrollmentCount || 0,
          averageRating: stats?.averageRating || 0,
          reviewCount: stats?.reviewCount || 0,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        };
      })
    );

    return courseResponses;
  }

  async getPopularCourses(limit: number = 6): Promise<CourseResponseDto[]> {
    // Get courses with highest enrollment count
    const courses = await this.courseRepository.findMany({
      limit,
      isPublished: true,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    // Sort by enrollment count
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const stats = await this.courseRepository.getCourseStats(course.id);
        return { course, stats };
      })
    );

    coursesWithStats.sort((a, b) => (b.stats?.enrollmentCount || 0) - (a.stats?.enrollmentCount || 0));

    return coursesWithStats.slice(0, limit).map(({ course, stats }) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: Number(course.price),
      category: course.category,
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      isPublished: course.isPublished,
      enrollmentCount: stats?.enrollmentCount || 0,
      averageRating: stats?.averageRating || 0,
      reviewCount: stats?.reviewCount || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));
  }
}
