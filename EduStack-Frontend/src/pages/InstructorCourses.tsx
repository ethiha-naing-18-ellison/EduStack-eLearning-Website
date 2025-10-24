import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  School,
  AccessTime,
  People,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: string;
  duration: number; // in weeks
  isPublished: boolean;
  studentCount: number;
  createdAt: string;
}

const InstructorCourses: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDialog, setCourseDialog] = useState<{
    open: boolean;
    course: Course | null;
    mode: 'create' | 'edit';
  }>({ open: false, course: null, mode: 'create' });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Sample course data - in a real app, this would come from an API
  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and more.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      price: 199.99,
      category: 'Web Development',
      level: 'BEGINNER',
      duration: 12,
      isPublished: true,
      studentCount: 1250,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the fundamentals of UI/UX design, user research, wireframing, and prototyping.',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
      price: 149.99,
      category: 'UI/UX Design',
      level: 'BEGINNER',
      duration: 6,
      isPublished: true,
      studentCount: 750,
      createdAt: '2024-02-01'
    }
  ];

  // Load courses from API
  React.useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await apiService.getMyCourses();
      if (response.success && response.data) {
        // Transform API response to match our interface
        const transformedCourses = response.data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          price: course.price,
          category: course.category,
          level: course.level,
          duration: course.duration,
          isPublished: course.isPublished,
          studentCount: course.totalStudents || 0,
          createdAt: course.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
        }));
        setCourses(transformedCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback to sample data if API fails
      setCourses(sampleCourses);
    }
  };

  const handleCreateCourse = () => {
    setCourseDialog({ open: true, course: null, mode: 'create' });
  };

  const handleEditCourse = (course: Course) => {
    setCourseDialog({ open: true, course, mode: 'edit' });
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await apiService.deleteCourse(courseId);
        if (response.success) {
          setCourses(prev => prev.filter(course => course.id !== courseId));
          setSnackbar({
            open: true,
            message: 'Course deleted successfully!',
            severity: 'success'
          });
        } else {
          throw new Error(response.message || 'Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete course. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      const response = await apiService.updateCourse(courseId, {
        isPublished: !course.isPublished
      });

      if (response.success) {
        setCourses(prev => prev.map(c => 
          c.id === courseId 
            ? { ...c, isPublished: !c.isPublished }
            : c
        ));
        setSnackbar({
          open: true,
          message: 'Course status updated!',
          severity: 'success'
        });
      } else {
        throw new Error(response.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update course status. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course-details/${courseId}`);
  };

  const handleCloseDialog = () => {
    setCourseDialog({ open: false, course: null, mode: 'create' });
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    try {
      if (courseDialog.mode === 'create') {
        const response = await apiService.createCourse({
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnail,
          price: courseData.price,
          category: courseData.category,
          level: courseData.level,
          duration: courseData.duration
        });

        if (response.success) {
          // Reload courses from API
          await loadCourses();
          setSnackbar({
            open: true,
            message: 'Course created successfully!',
            severity: 'success'
          });
        } else {
          throw new Error(response.message || 'Failed to create course');
        }
      } else {
        const updateData = {
          title: courseData.title,
          description: courseData.description,
          thumbnail: courseData.thumbnail,
          price: courseData.price,
          category: courseData.category,
          level: courseData.level,
          duration: courseData.duration
        };
        
        console.log('Updating course with data:', updateData);
        console.log('Course ID:', courseDialog.course!.id);
        
        const response = await apiService.updateCourse(courseDialog.course!.id, updateData);

        if (response.success) {
          // Reload courses from API
          await loadCourses();
          setSnackbar({
            open: true,
            message: 'Course updated successfully!',
            severity: 'success'
          });
        } else {
          throw new Error(response.message || 'Failed to update course');
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving course:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${courseDialog.mode === 'create' ? 'create' : 'update'} course. Please try again.`,
        severity: 'error'
      });
    }
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'success' : 'warning';
  };

  const getStatusLabel = (isPublished: boolean) => {
    return isPublished ? 'Published' : 'Draft';
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
            Manage Courses
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary'
            }}
          >
            Create, edit, and manage your courses
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
                    label={getStatusLabel(course.isPublished)}
                    color={getStatusColor(course.isPublished) as any}
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

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {course.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration} weeks
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.studentCount} students
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ${course.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {course.createdAt}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewCourse(course.id)}
                    startIcon={<Visibility />}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditCourse(course)}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleTogglePublish(course.id)}
                    color={course.isPublished ? 'warning' : 'success'}
                  >
                    {course.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {courses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <School sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
              No courses created yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Start creating your first course to share your knowledge
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={handleCreateCourse}
              startIcon={<Add />}
            >
              Create Your First Course
            </Button>
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add course"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleCreateCourse}
        >
          <Add />
        </Fab>

        {/* Course Dialog */}
        <CourseDialog
          open={courseDialog.open}
          course={courseDialog.course}
          mode={courseDialog.mode}
          onClose={handleCloseDialog}
          onSave={handleSaveCourse}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

// Course Dialog Component
interface CourseDialogProps {
  open: boolean;
  course: Course | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({
  open,
  course,
  mode,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    thumbnail: course?.thumbnail || '',
    price: course?.price || 0,
    category: course?.category || '',
    level: course?.level || 'BEGINNER',
    duration: course?.duration || 1
  });

  React.useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        category: course.category,
        level: course.level,
        duration: course.duration
      });
    } else {
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
        price: 0,
        category: '',
        level: 'BEGINNER',
        duration: 1
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create New Course' : 'Edit Course'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                value={formData.thumbnail}
                onChange={(e) => handleChange('thumbnail', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={formData.level}
                  onChange={(e) => handleChange('level', e.target.value)}
                >
                  <MenuItem value="BEGINNER">Beginner</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (weeks)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === 'create' ? 'Create Course' : 'Update Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructorCourses;
