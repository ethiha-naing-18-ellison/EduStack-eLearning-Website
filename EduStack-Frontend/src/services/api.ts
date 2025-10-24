const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Enrollment API methods
  async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/enrollments/enroll/${courseId}`, {
      method: 'POST',
    });
  }

  async getUserEnrollments(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/enrollments/my-enrollments');
  }

  async checkEnrollment(courseId: string): Promise<ApiResponse<{ isEnrolled: boolean }>> {
    return this.makeRequest(`/enrollments/check/${courseId}`);
  }

  async getEnrollmentByCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/enrollments/course/${courseId}`);
  }
}

export const apiService = new ApiService();
