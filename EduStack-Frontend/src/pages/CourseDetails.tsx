import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayCircleOutline,
  AccessTime,
  People,
  Star,
  CheckCircle,
  School,
  Code,
  Palette,
  Business,
  Science,
  Security,
  Cloud,
  PhoneAndroid
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../contexts/EnrollmentContext';

interface CourseDetails {
  id: number;
  title: string;
  instructor: string;
  instructorInitials: string;
  rating: number;
  studentCount: number;
  duration: string;
  price: number;
  description: string;
  image: string;
  category: string;
  categoryIcon: React.ReactNode;
  categoryColor: string;
  whatYouWillLearn: string[];
  curriculum: {
    week: number;
    title: string;
    topics: string[];
  }[];
  requirements: string[];
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();
  const { enrollInCourse, isEnrolled } = useEnrollment();

  // Sample course data - in a real app, this would come from an API
  const courseData: CourseDetails = {
    id: parseInt(id || '1'),
    title: "UI/UX Design Fundamentals",
    instructor: "Alex Thompson",
    instructorInitials: "AT",
    rating: 4.6,
    studentCount: 750,
    duration: "6 weeks",
    price: 99,
    description: "Master the fundamentals of UI/UX design with this comprehensive course. Learn design principles, user research, wireframing, prototyping, and visual design. Perfect for beginners and intermediate designers looking to enhance their skills.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "UI/UX Design",
    categoryIcon: <Palette sx={{ fontSize: 24 }} />,
    categoryColor: "#ed6c02",
    whatYouWillLearn: [
      "Design thinking and user-centered design principles",
      "User research and persona development",
      "Wireframing and prototyping techniques",
      "Visual design fundamentals and color theory",
      "Typography and layout design",
      "Usability testing and design iteration",
      "Design tools like Figma, Sketch, and Adobe XD",
      "Creating responsive and accessible designs"
    ],
    curriculum: [
      {
        week: 1,
        title: "Introduction to UI/UX Design",
        topics: ["What is UI/UX Design?", "Design Thinking Process", "User-Centered Design", "Design Tools Overview"]
      },
      {
        week: 2,
        title: "User Research & Analysis",
        topics: ["User Research Methods", "Creating User Personas", "User Journey Mapping", "Competitive Analysis"]
      },
      {
        week: 3,
        title: "Information Architecture",
        topics: ["Site Mapping", "Card Sorting", "Navigation Design", "Content Strategy"]
      },
      {
        week: 4,
        title: "Wireframing & Prototyping",
        topics: ["Low-fidelity Wireframes", "High-fidelity Wireframes", "Interactive Prototypes", "User Testing"]
      },
      {
        week: 5,
        title: "Visual Design",
        topics: ["Color Theory", "Typography", "Layout Principles", "Visual Hierarchy"]
      },
      {
        week: 6,
        title: "Final Project & Portfolio",
        topics: ["Design System Creation", "Portfolio Development", "Presentation Skills", "Career Preparation"]
      }
    ],
    requirements: [
      "Basic computer skills",
      "Access to a computer with internet connection",
      "No prior design experience required",
      "Willingness to learn and practice"
    ]
  };

  const handleEnroll = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      alert('Please sign up or login to enroll in courses!');
      navigate('/auth');
      return;
    }

    // Check if already enrolled
    if (isEnrolled(courseData.id)) {
      alert('You are already enrolled in this course!');
      return;
    }

    // Convert CourseDetails to Course format for enrollment
    const course = {
      id: courseData.id,
      title: courseData.title,
      instructor: courseData.instructor,
      instructorAvatar: courseData.instructorInitials,
      thumbnail: courseData.image,
      rating: courseData.rating,
      students: courseData.studentCount,
      duration: courseData.duration,
      price: `$${courseData.price}`,
      category: courseData.category,
      level: courseData.category // Using category as level for now
    };

    // Enroll in the course
    enrollInCourse(course);
    alert(`Successfully enrolled in "${courseData.title}"!`);
  };

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          variant="outlined"
          onClick={handleBackToCourses}
          sx={{ mb: 4 }}
        >
          ← Back to Courses
        </Button>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Course Header */}
            <Card sx={{ mb: 4 }}>
              <CardMedia
                component="img"
                height="300"
                image={courseData.image}
                alt={courseData.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: courseData.categoryColor, mr: 1 }}>
                    {courseData.categoryIcon}
                  </Box>
                  <Chip
                    label={courseData.category}
                    sx={{
                      backgroundColor: courseData.categoryColor,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {courseData.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {courseData.instructorInitials}
                  </Avatar>
                  <Typography variant="h6" sx={{ mr: 3 }}>
                    {courseData.instructor}
                  </Typography>
                  <Rating value={courseData.rating} precision={0.1} readOnly sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {courseData.rating} ({courseData.studentCount} students)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {courseData.duration}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {courseData.studentCount} students
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  {courseData.description}
                </Typography>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  What You'll Learn
                </Typography>
                <Grid container spacing={2}>
                  {courseData.whatYouWillLearn.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Curriculum
                </Typography>
                {courseData.curriculum.map((week, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Week {week.week}: {week.title}
                    </Typography>
                    <List dense>
                      {week.topics.map((topic, topicIndex) => (
                        <ListItem key={topicIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <PlayCircleOutline sx={{ fontSize: 16, color: 'text.secondary' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={topic}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {index < courseData.curriculum.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Requirements
                </Typography>
                <List>
                  {courseData.requirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary={requirement} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${courseData.price}
                </Typography>
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleEnroll}
                  startIcon={<School />}
                  sx={{ 
                    mb: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Enroll
                </Button>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    30-day money-back guarantee
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  This course includes:
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PlayCircleOutline sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="6 weeks of content"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccessTime sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Lifetime access"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Certificate of completion"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <People sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Community support"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetails;
