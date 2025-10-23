export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  courseId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  courseId: string;
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
  isPublished?: boolean;
}

export interface LessonWithProgress extends Lesson {
  progress?: {
    progress: number;
    completedAt?: Date;
  };
}
