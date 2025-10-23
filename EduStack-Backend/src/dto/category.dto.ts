export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  courseCount: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryListResponseDto {
  categories: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
