import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface Course {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  rating: number;
  students: number;
  duration: string;
  price: string;
  category: string;
  level: string;
}

interface EnrolledCourse extends Course {
  enrolledAt: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  status: 'in-progress' | 'completed' | 'not-started';
}

interface EnrollmentContextType {
  enrolledCourses: EnrolledCourse[];
  enrollInCourse: (course: Course) => Promise<void>;
  isEnrolled: (courseId: number) => boolean;
  updateCourseProgress: (courseId: number, progress: number, completedLessons: number) => void;
  getEnrolledCourse: (courseId: number) => EnrolledCourse | undefined;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

// Mapping from frontend course IDs to database GUIDs
const courseIdMapping: { [key: number]: string } = {
  1: '550e8400-e29b-41d4-a716-446655440100', // Complete Web Development Bootcamp
  2: '550e8400-e29b-41d4-a716-446655440101', // UI/UX Design Fundamentals
  3: '550e8400-e29b-41d4-a716-446655440102', // Python Data Science Masterclass
  4: '550e8400-e29b-41d4-a716-446655440103', // Advanced React & Redux
  5: '550e8400-e29b-41d4-a716-446655440104', // Machine Learning with TensorFlow
  6: '550e8400-e29b-41d4-a716-446655440105', // Digital Marketing Strategy
  7: '550e8400-e29b-41d4-a716-446655440106', // Mobile App Development with Flutter
  8: '550e8400-e29b-41d4-a716-446655440107', // Cybersecurity Fundamentals
  9: '550e8400-e29b-41d4-a716-446655440108', // Cloud Computing with AWS
};

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (context === undefined) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};

interface EnrollmentProviderProps {
  children: ReactNode;
}

export const EnrollmentProvider: React.FC<EnrollmentProviderProps> = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);

  // Load enrolled courses from API on mount
  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      const response = await apiService.getUserEnrollments();
      if (response.success && response.data) {
        // Transform API response to match our interface
        const transformedCourses = response.data.map((enrollment: any) => {
          // Find the frontend ID from the GUID
          const frontendId = Object.keys(courseIdMapping).find(
            key => courseIdMapping[parseInt(key)] === enrollment.courseId
          );
          
          return {
            id: frontendId ? parseInt(frontendId) : 1, // Default to 1 if not found
            title: enrollment.courseTitle,
            instructor: 'Instructor Name', // This would come from the API
            instructorAvatar: 'I',
            thumbnail: enrollment.courseThumbnail,
            rating: 4.5, // Default rating
            students: 0, // This would come from the API
            duration: '12 weeks', // This would come from the API
            price: '$199.99', // This would come from the API
            category: 'Web Development', // This would come from the API
            level: 'Beginner', // This would come from the API
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progressPercentage || 0,
            totalLessons: 30, // This would come from the API
            completedLessons: Math.floor((enrollment.progressPercentage || 0) * 0.3), // Calculate based on progress
            lastAccessed: 'Today',
            status: (enrollment.status === 'COMPLETED' ? 'completed' : 
                    enrollment.status === 'ACTIVE' ? 'in-progress' : 'not-started') as 'in-progress' | 'completed' | 'not-started'
          };
        });
        setEnrolledCourses(transformedCourses);
      }
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      // Fallback to localStorage if API fails
      const savedEnrollments = localStorage.getItem('enrolledCourses');
      if (savedEnrollments) {
        try {
          setEnrolledCourses(JSON.parse(savedEnrollments));
        } catch (parseError) {
          console.error('Error parsing saved enrollments:', parseError);
        }
      }
    }
  };


  const enrollInCourse = async (course: Course) => {
    const isAlreadyEnrolled = enrolledCourses.some(enrolled => enrolled.id === course.id);
    
    if (!isAlreadyEnrolled) {
      try {
        // Get the actual GUID from the mapping
        const courseGuid = courseIdMapping[course.id];
        
        if (!courseGuid) {
          throw new Error(`Course ID ${course.id} not found in mapping`);
        }
        
        const response = await apiService.enrollInCourse(courseGuid);
        
        if (response.success) {
          // Reload enrollments from API
          await loadEnrolledCourses();
        } else {
          throw new Error(response.message || 'Enrollment failed');
        }
      } catch (error) {
        console.error('Error enrolling in course:', error);
        // Fallback to local state update if API fails
        const enrolledCourse: EnrolledCourse = {
          ...course,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          totalLessons: Math.floor(Math.random() * 30) + 20,
          completedLessons: 0,
          lastAccessed: 'Never',
          status: 'not-started'
        };
        setEnrolledCourses(prev => [...prev, enrolledCourse]);
        // Also save to localStorage as backup
        localStorage.setItem('enrolledCourses', JSON.stringify([...enrolledCourses, enrolledCourse]));
      }
    }
  };

  const isEnrolled = (courseId: number): boolean => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const updateCourseProgress = (courseId: number, progress: number, completedLessons: number) => {
    setEnrolledCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              progress, 
              completedLessons,
              lastAccessed: new Date().toLocaleDateString(),
              status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'
            }
          : course
      )
    );
  };

  const getEnrolledCourse = (courseId: number): EnrolledCourse | undefined => {
    return enrolledCourses.find(course => course.id === courseId);
  };

  const value: EnrollmentContextType = {
    enrolledCourses,
    enrollInCourse,
    isEnrolled,
    updateCourseProgress,
    getEnrolledCourse
  };

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};
