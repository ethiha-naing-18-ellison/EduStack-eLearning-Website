import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses, loading, pagination } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    category: '',
  });

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isInstructor = user?.role?.name === 'Instructor' || user?.role?.name === 'Admin';

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Courses
          </Typography>
          {isInstructor && (
            <Button
              variant="contained"
              onClick={() => navigate('/courses/create')}
            >
              Create Course
            </Button>
          )}
        </Box>

        {/* Filters */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Search courses"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filters.difficulty}
              label="Difficulty"
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Courses Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description?.substring(0, 120)}...
                  </Typography>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={course.difficulty_level}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={course.language}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" color="primary">
                    ${course.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Details
                  </Button>
                  {isInstructor && course.instructor_id === user?.id && (
                    <Button
                      size="small"
                      onClick={() => navigate(`/courses/${course.id}/edit`)}
                    >
                      Edit
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && courses.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Courses;
