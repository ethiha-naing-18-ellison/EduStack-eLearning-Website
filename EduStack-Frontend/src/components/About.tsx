import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School,
  People,
  Star,
  TrendingUp,
  Security,
  Support
} from '@mui/icons-material';

const About: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    {
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      number: '10,000+',
      label: 'Active Students',
      description: 'Students learning and growing with us'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      number: '100+',
      label: 'Expert Courses',
      description: 'Comprehensive courses across all fields'
    },
    {
      icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
      number: '4.8/5',
      label: 'Average Rating',
      description: 'Highly rated by our students'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      number: '95%',
      label: 'Success Rate',
      description: 'Students achieve their learning goals'
    }
  ];

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Learning',
      description: 'Your data and progress are protected with enterprise-grade security.'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience.'
    }
  ];

  return (
    <Box id="about" sx={{ py: 8, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 3
            }}
          >
            About EduStack
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            We provide affordable and flexible learning opportunities across various disciplines. 
            Our mission is to make quality education accessible to everyone, everywhere.
          </Typography>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 1
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 3
              }}
            >
              Why Choose EduStack?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                mb: 4
              }}
            >
              We believe that education should be accessible, engaging, and effective. 
              Our platform combines cutting-edge technology with proven teaching methods 
              to deliver an exceptional learning experience.
            </Typography>
            
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ mr: 3, mt: 1 }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 4,
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Join Our Learning Community
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Connect with like-minded learners, share your progress, 
                and get support from our vibrant community of students and instructors.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    50+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Expert Instructors
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    15+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Categories
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    24/7
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Support
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
