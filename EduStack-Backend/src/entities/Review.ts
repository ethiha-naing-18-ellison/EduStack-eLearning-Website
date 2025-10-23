export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewData {
  userId: string;
  courseId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    fullName: string;
    avatar?: string;
  };
}

export interface CourseRating {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
