export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  progress: number; // percentage
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProgressData {
  userId: string;
  courseId: string;
  lessonId?: string;
  progress: number;
}

export interface UpdateProgressData {
  progress?: number;
  completedAt?: Date;
}

export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lastAccessed?: Date;
}
