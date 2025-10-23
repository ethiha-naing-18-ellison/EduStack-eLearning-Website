import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School,
  Star,
  People,
  Work
} from '@mui/icons-material';

interface Instructor {
  id: number;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  students: number;
  courses: number;
  avatar: string;
  bio: string;
}

const Instructors: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const instructors: Instructor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Senior Web Developer",
      expertise: ["React", "Node.js", "JavaScript", "Full Stack"],
      rating: 4.9,
      students: 2500,
      courses: 8,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      bio: "10+ years experience in web development with expertise in modern JavaScript frameworks."
    },
    {
      id: 2,
      name: "Mike Chen",
      title: "Data Science Lead",
      expertise: ["Python", "Machine Learning", "Data Analysis", "AI"],
      rating: 4.8,
      students: 3200,
      courses: 12,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      bio: "Former Google data scientist with PhD in Computer Science and 15+ years in AI research."
    },
    {
      id: 3,
      name: "Alex Thompson",
      title: "UX Design Director",
      expertise: ["UI/UX Design", "Figma", "User Research", "Design Systems"],
      rating: 4.7,
      students: 1800,
      courses: 6,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      bio: "Award-winning designer with experience at top tech companies including Apple and Microsoft."
    },
    {
      id: 4,
      name: "Dr. Emily Rodriguez",
      title: "AI Research Scientist",
      expertise: ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"],
      rating: 4.9,
      students: 4100,
      courses: 15,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      bio: "Leading AI researcher with publications in top-tier conferences and 20+ years in academia."
    },
    {
      id: 5,
      name: "James Wilson",
      title: "Mobile Development Expert",
      expertise: ["React Native", "Flutter", "iOS", "Android"],
      rating: 4.6,
      students: 2200,
      courses: 10,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      bio: "Senior mobile developer with experience building apps for millions of users worldwide."
    },
    {
      id: 6,
      name: "Lisa Wang",
      title: "Digital Marketing Strategist",
      expertise: ["SEO", "Social Media", "Content Marketing", "Analytics"],
      rating: 4.5,
      students: 1900,
      courses: 7,
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
      bio: "Marketing expert with 12+ years helping companies grow their online presence and revenue."
    },
    {
      id: 7,
      name: "Prof. David Kim",
      title: "Cybersecurity Specialist",
      expertise: ["Ethical Hacking", "Network Security", "Penetration Testing", "Security Audits"],
      rating: 4.8,
      students: 1600,
      courses: 9,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      bio: "Former NSA cybersecurity analyst with certifications in ethical hacking and security management."
    },
    {
      id: 8,
      name: "Maria Garcia",
      title: "Cloud Solutions Architect",
      expertise: ["AWS", "Azure", "DevOps", "Kubernetes"],
      rating: 4.7,
      students: 2800,
      courses: 11,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
      bio: "Cloud architect with experience designing scalable solutions for Fortune 500 companies."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Our Expert Instructors
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Learn from industry professionals and academic experts who bring real-world experience to every course.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {instructors.map((instructor) => (
            <Grid item xs={12} sm={6} md={4} key={instructor.id}>
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
                <CardContent sx={{ flexGrow: 1, p: 4, textAlign: 'center' }}>
                  <Avatar
                    src={instructor.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 3,
                      border: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 1
                    }}
                  >
                    {instructor.name}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 'bold',
                      mb: 2
                    }}
                  >
                    {instructor.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      mb: 3
                    }}
                  >
                    {instructor.bio}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
                    {instructor.expertise.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main'
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Rating
                      value={instructor.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {instructor.rating}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                        <People sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {instructor.students.toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Students
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                        <School sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {instructor.courses}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Courses
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Instructors;
