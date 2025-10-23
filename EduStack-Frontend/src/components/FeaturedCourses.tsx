import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayCircleOutline,
  AccessTime,
  People,
  Star
} from '@mui/icons-material';

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

const FeaturedCourses: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const courses: Course[] = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Johnson",
      instructorAvatar: "SJ",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      rating: 4.8,
      students: 1250,
      duration: "12 weeks",
      price: "$199",
      category: "Web Development",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Advanced React & Redux",
      instructor: "Mike Chen",
      instructorAvatar: "MC",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      rating: 4.9,
      students: 890,
      duration: "8 weeks",
      price: "$149",
      category: "Frontend",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Python Data Science Masterclass",
      instructor: "Dr. Emily Rodriguez",
      instructorAvatar: "ER",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      rating: 4.7,
      students: 2100,
      duration: "16 weeks",
      price: "$299",
      category: "Data Science",
      level: "Advanced"
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Thompson",
      instructorAvatar: "AT",
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop",
      rating: 4.6,
      students: 750,
      duration: "6 weeks",
      price: "$99",
      category: "Design",
      level: "Beginner"
    },
    {
      id: 5,
      title: "Machine Learning with TensorFlow",
      instructor: "Prof. David Kim",
      instructorAvatar: "DK",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      rating: 4.9,
      students: 1800,
      duration: "20 weeks",
      price: "$399",
      category: "AI/ML",
      level: "Advanced"
    },
    {
      id: 6,
      title: "Digital Marketing Strategy",
      instructor: "Lisa Wang",
      instructorAvatar: "LW",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      rating: 4.5,
      students: 950,
      duration: "10 weeks",
      price: "$129",
      category: "Marketing",
      level: "Intermediate"
    }
  ];

  const handleEnroll = (courseId: number) => {
    // Check if user is logged in (simulate with localStorage or context)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      alert('Please sign up or login to enroll in courses!');
      // Redirect to login/signup
      return;
    }
    
    alert(`Enrolled in course ${courseId}!`);
  };

  const handleViewDetails = (courseId: number) => {
    // Navigate to course details page
    alert(`Viewing details for course ${courseId}`);
  };

  return (
    <Box id="courses" sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 2
            }}
          >
            Popular Courses
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Discover our most popular courses taught by industry experts. 
            Start your learning journey today!
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnail}
                  alt={course.title}
                  sx={{
                    objectFit: 'cover',
                    position: 'relative'
                  }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <Chip
                    label={course.category}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    label={course.level}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: 'white',
                      color: 'text.primary'
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
                      lineHeight: 1.3
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

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                      value={course.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {course.rating} ({course.students} students)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.students}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: 2
                    }}
                  >
                    {course.price}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, gap: 1, display: 'flex' }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewDetails(course.id)}
                    sx={{ flex: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleEnroll(course.id)}
                    startIcon={<PlayCircleOutline />}
                    sx={{ flex: 1 }}
                  >
                    Enroll Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            View All Courses
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedCourses;
