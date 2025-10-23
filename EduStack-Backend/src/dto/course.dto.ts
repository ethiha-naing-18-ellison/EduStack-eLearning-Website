import { CourseLevel } from '@prisma/client';

export interface CreateCourseDto {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: CourseLevel;
  duration: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  category?: string;
  level?: CourseLevel;
  duration?: number;
  isPublished?: boolean;
}

export interface CourseResponseDto {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: CourseLevel;
  duration: number;
  instructor: {
    id: string;
    fullName: string;
    avatar?: string;
  };
  isPublished: boolean;
  enrollmentCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseListResponseDto {
  courses: CourseResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
