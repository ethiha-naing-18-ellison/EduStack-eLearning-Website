import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  AppBar,
  Toolbar,
  useTheme,
} from '@mui/material';
import {
  School,
  People,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Interactive Learning',
      description: 'Engage with high-quality video lessons, quizzes, and hands-on projects.',
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Your data and learning progress are protected with enterprise-grade security.',
    },
  ];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EduStack
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom>
            Learn Without Limits
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Join thousands of students learning new skills with our comprehensive online courses
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>

        {/* Features Section */}
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose EduStack?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box color="primary.main" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Paper
          elevation={3}
          sx={{
            p: 6,
            mt: 8,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" paragraph>
            Join our community of learners and start your journey today.
          </Typography>
          {!isAuthenticated && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Get Started Now
            </Button>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
