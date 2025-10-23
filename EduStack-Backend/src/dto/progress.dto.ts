export interface UpdateProgressDto {
  lessonId?: string;
  progress: number;
}

export interface ProgressResponseDto {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnail: string;
  };
  lesson?: {
    id: string;
    title: string;
    duration: number;
  };
  progress: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseProgressDto {
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lastAccessed?: Date;
  lessons: {
    id: string;
    title: string;
    duration: number;
    order: number;
    progress: number;
    completedAt?: Date;
  }[];
}
