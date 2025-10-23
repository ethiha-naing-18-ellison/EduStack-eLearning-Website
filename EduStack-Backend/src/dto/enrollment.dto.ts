import { EnrollmentStatus } from '@prisma/client';

export interface CreateEnrollmentDto {
  courseId: string;
}

export interface EnrollmentResponseDto {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnail: string;
    instructor: {
      id: string;
      fullName: string;
      avatar?: string;
    };
  };
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  progress: {
    progress: number;
    completedLessons: number;
    totalLessons: number;
  };
}

export interface EnrollmentListResponseDto {
  enrollments: EnrollmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EnrollmentQueryDto {
  page?: number;
  limit?: number;
  status?: EnrollmentStatus;
  sortBy?: 'enrolledAt' | 'courseTitle' | 'progress';
  sortOrder?: 'asc' | 'desc';
}
