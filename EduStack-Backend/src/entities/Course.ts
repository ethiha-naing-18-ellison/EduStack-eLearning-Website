import { CourseLevel } from '@prisma/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: CourseLevel;
  duration: number; // in weeks
  instructorId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseData {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: CourseLevel;
  duration: number;
  instructorId: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  category?: string;
  level?: CourseLevel;
  duration?: number;
  isPublished?: boolean;
}

export interface CourseWithInstructor extends Course {
  instructor: {
    id: string;
    fullName: string;
    avatar?: string;
  };
}

export interface CourseWithStats extends CourseWithInstructor {
  enrollmentCount: number;
  averageRating: number;
  reviewCount: number;
}
