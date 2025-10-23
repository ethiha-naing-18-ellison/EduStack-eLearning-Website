import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Rating,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle,
  AccessTime,
  People,
  School,
  PlayCircleOutline
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

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  course: Course | null;
  loading?: boolean;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  open,
  onClose,
  onConfirm,
  course,
  loading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!course) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Confirm Enrollment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please review your course selection before enrolling
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          {/* Course Image */}
          <Box sx={{ flex: { xs: 'none', sm: '0 0 200px' } }}>
            <Box
              component="img"
              src={course.thumbnail}
              alt={course.title}
              sx={{
                width: '100%',
                height: { xs: 200, sm: 150 },
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2
              }}
            />
          </Box>

          {/* Course Details */}
          <Box sx={{ flex: 1 }}>
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
                sx={{
                  backgroundColor: 'white',
                  color: 'text.primary'
                }}
              />
            </Box>

            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2,
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {course.duration}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {course.students} students
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Enrollment Benefits */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                What you'll get:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2">Lifetime access to course content</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2">Certificate of completion</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2">Community support</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2">30-day money-back guarantee</Typography>
                </Box>
              </Box>
            </Box>

            {/* Price */}
            <Box sx={{ 
              backgroundColor: 'primary.light', 
              p: 2, 
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {course.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                One-time payment
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? null : <PlayCircleOutline />}
          sx={{ 
            minWidth: 140,
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Enrolling...' : 'Confirm Enrollment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnrollmentModal;
