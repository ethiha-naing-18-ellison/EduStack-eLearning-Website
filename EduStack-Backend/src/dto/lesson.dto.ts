export interface CreateLessonDto {
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  courseId: string;
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
  isPublished?: boolean;
}

export interface LessonResponseDto {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  courseId: string;
  isPublished: boolean;
  progress?: {
    progress: number;
    completedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonListResponseDto {
  lessons: LessonResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
