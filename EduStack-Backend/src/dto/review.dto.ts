export interface CreateReviewDto {
  courseId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export interface ReviewResponseDto {
  id: string;
  user: {
    id: string;
    fullName: string;
    avatar?: string;
  };
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewListResponseDto {
  reviews: ReviewResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewQueryDto {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
