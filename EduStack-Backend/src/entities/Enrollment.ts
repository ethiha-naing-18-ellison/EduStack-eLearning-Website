import { EnrollmentStatus } from '@prisma/client';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface CreateEnrollmentData {
  userId: string;
  courseId: string;
}

export interface UpdateEnrollmentData {
  status?: EnrollmentStatus;
  completedAt?: Date;
}

export interface EnrollmentWithDetails extends Enrollment {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
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
  progress: {
    progress: number;
    completedLessons: number;
    totalLessons: number;
  };
}
