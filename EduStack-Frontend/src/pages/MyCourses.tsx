import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayCircleOutline,
  AccessTime,
  CheckCircle,
  School
} from '@mui/icons-material';

interface EnrolledCourse {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  lastAccessed: string;
  status: 'in-progress' | 'completed' | 'not-started';
}

const MyCourses: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const enrolledCourses: EnrolledCourse[] = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Johnson",
      instructorAvatar: "SJ",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      progress: 75,
      totalLessons: 40,
      completedLessons: 30,
      duration: "12 weeks",
      lastAccessed: "2 days ago",
      status: 'in-progress'
    },
    {
      id: 2,
      title: "Advanced React & Redux",
      instructor: "Mike Chen",
      instructorAvatar: "MC",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      progress: 100,
      totalLessons: 24,
      completedLessons: 24,
      duration: "8 weeks",
      lastAccessed: "1 week ago",
      status: 'completed'
    },
    {
      id: 3,
      title: "Python Data Science Masterclass",
      instructor: "Dr. Emily Rodriguez",
      instructorAvatar: "ER",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      progress: 0,
      totalLessons: 32,
      completedLessons: 0,
      duration: "16 weeks",
      lastAccessed: "Never",
      status: 'not-started'
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Thompson",
      instructorAvatar: "AT",
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop",
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      duration: "6 weeks",
      lastAccessed: "3 days ago",
      status: 'in-progress'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'not-started':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const handleContinueCourse = (courseId: number) => {
    alert(`Continuing course ${courseId}. This will redirect to the course content.`);
  };

  const handleViewCertificate = (courseId: number) => {
    alert(`Viewing certificate for course ${courseId}.`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 2
            }}
          >
            My Courses
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary'
            }}
          >
            Continue your learning journey and track your progress
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {enrolledCourses.map((course) => (
            <Grid item xs={12} sm={6} md={6} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={course.thumbnail}
                    alt={course.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <Chip
                    label={getStatusLabel(course.status)}
                    color={getStatusColor(course.status) as any}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      lineHeight: 1.3,
                      mb: 2
                    }}
                  >
                    {course.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                      {course.instructorAvatar}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {course.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <School sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.totalLessons} lessons
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Last accessed: {course.lastAccessed}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  {course.status === 'completed' ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleViewCertificate(course.id)}
                      startIcon={<CheckCircle />}
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleContinueCourse(course.id)}
                      startIcon={<PlayCircleOutline />}
                    >
                      {course.status === 'not-started' ? 'Start Course' : 'Continue Learning'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {enrolledCourses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <School sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
              No courses enrolled yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Start your learning journey by enrolling in a course
            </Typography>
            <Button variant="contained" size="large" href="/courses">
              Browse Courses
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyCourses;
