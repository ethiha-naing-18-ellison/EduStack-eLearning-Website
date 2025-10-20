import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
} from '@mui/material';
import {
  School,
  People,
  TrendingUp,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses({ limit: 6 }));
  }, [dispatch]);

  const isInstructor = user?.role?.name === 'Instructor' || user?.role?.name === 'Admin';

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: <School />,
      color: 'primary',
    },
    {
      title: 'Students',
      value: '1,234',
      icon: <People />,
      color: 'secondary',
    },
    {
      title: 'Completion Rate',
      value: '85%',
      icon: <TrendingUp />,
      color: 'success',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your learning journey.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box color={`${stat.color}.main`} mr={2}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<School />}
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </Button>
          {isInstructor && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => navigate('/courses/create')}
            >
              Create Course
            </Button>
          )}
        </Box>
      </Paper>

      {/* Recent Courses */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            Recent Courses
          </Typography>
          <Button onClick={() => navigate('/courses')}>
            View All
          </Button>
        </Box>
        
        {loading ? (
          <Typography>Loading courses...</Typography>
        ) : courses.length > 0 ? (
          <Grid container spacing={2}>
            {courses.slice(0, 3).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description?.substring(0, 100)}...
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${course.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            No courses available yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
