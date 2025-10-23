export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
}

export interface CategoryWithStats extends Category {
  courseCount: number;
  enrollmentCount: number;
}
