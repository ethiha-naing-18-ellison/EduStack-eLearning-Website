import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  enrollInCourse: (course: Course) => void;
  isEnrolled: (courseId: number) => boolean;
  updateCourseProgress: (courseId: number, progress: number, completedLessons: number) => void;
  getEnrolledCourse: (courseId: number) => EnrolledCourse | undefined;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

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

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    const savedEnrollments = localStorage.getItem('enrolledCourses');
    if (savedEnrollments) {
      try {
        setEnrolledCourses(JSON.parse(savedEnrollments));
      } catch (error) {
        console.error('Error loading enrolled courses:', error);
      }
    }
  }, []);

  // Save enrolled courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const enrollInCourse = (course: Course) => {
    const isAlreadyEnrolled = enrolledCourses.some(enrolled => enrolled.id === course.id);
    
    if (!isAlreadyEnrolled) {
      const enrolledCourse: EnrolledCourse = {
        ...course,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        totalLessons: Math.floor(Math.random() * 30) + 20, // Random number of lessons between 20-50
        completedLessons: 0,
        lastAccessed: 'Never',
        status: 'not-started'
      };

      setEnrolledCourses(prev => [...prev, enrolledCourse]);
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
