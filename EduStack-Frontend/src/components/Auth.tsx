import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardActionArea
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  School,
  TrendingUp,
  People,
  Star,
  PersonAdd,
  School as SchoolIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Auth: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
    setErrors({});
    setSuccess(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value
    }));
    // Clear role error when user selects
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (tabValue === 1 && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (tabValue === 1) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm Password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.role) {
        newErrors.role = 'Please select your role';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      console.log(`${tabValue === 0 ? 'Login' : 'Signup'} data:`, formData);
      
      try {
        if (tabValue === 0) {
          // Login API call
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            alert('Login successful!');
          } else {
            const error = await response.json();
            console.error('Login failed:', error);
            alert(`Login failed: ${error.message || 'Unknown error'}`);
          }
        } else {
          // Signup API call
          const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              fullName: formData.name,
              role: formData.role.toUpperCase() // Convert to STUDENT/INSTRUCTOR
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Signup successful:', data);
            setSuccess(true);
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: ''
            });
          } else {
            const error = await response.json();
            console.error('Signup failed:', error);
            alert(`Signup failed: ${error.message || 'Unknown error'}`);
          }
        }
      } catch (error) {
        console.error('API call failed:', error);
        alert('Network error. Please check if the backend is running.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const features = [
    { icon: <School />, title: "Expert Instructors", description: "Learn from industry professionals" },
    { icon: <TrendingUp />, title: "Career Growth", description: "Advance your career with new skills" },
    { icon: <People />, title: "Community", description: "Join thousands of learners worldwide" },
    { icon: <Star />, title: "Quality Content", description: "High-quality, up-to-date courses" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Features */}
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 3
                }}>
                  Welcome to EduStack
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  mb: 4,
                  lineHeight: 1.6
                }}>
                  Your Gateway to eLearning Excellence. Join thousands of learners and start your journey today.
                </Typography>
                
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <Box sx={{ 
                          color: 'white', 
                          mr: 2,
                          '& .MuiSvgIcon-root': { fontSize: 28 }
                        }}>
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ 
                            color: 'white', 
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.85rem'
                          }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          )}

          {/* Right Side - Auth Form */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={24} 
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="authentication tabs"
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      py: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none'
                    },
                    '& .Mui-selected': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <Tab label="Sign In" id="auth-tab-0" aria-controls="auth-tabpanel-0" />
                  <Tab label="Sign Up" id="auth-tab-1" aria-controls="auth-tabpanel-1" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue your learning journey
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 3, 
                      mb: 2, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2
                    }}
                    size="large"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                      Forgot your password?
                    </Link>
                  </Box>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join EduStack and start your learning journey
                  </Typography>
                </Box>

                {success && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    Account created successfully! You can now sign in.
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  {/* Role Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                      Select Your Role
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Card 
                          sx={{ 
                            border: formData.role === 'student' ? '2px solid' : '1px solid',
                            borderColor: formData.role === 'student' ? 'primary.main' : 'divider',
                            backgroundColor: formData.role === 'student' ? 'primary.50' : 'background.paper',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'primary.50'
                            }
                          }}
                        >
                          <CardActionArea onClick={() => handleRoleChange({ target: { value: 'student' } } as React.ChangeEvent<HTMLInputElement>)}>
                            <CardContent sx={{ textAlign: 'center', py: 2, px: 2 }}>
                              <PersonAdd sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                Student
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Learn new skills
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Card 
                          sx={{ 
                            border: formData.role === 'instructor' ? '2px solid' : '1px solid',
                            borderColor: formData.role === 'instructor' ? 'primary.main' : 'divider',
                            backgroundColor: formData.role === 'instructor' ? 'primary.50' : 'background.paper',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'primary.50'
                            }
                          }}
                        >
                          <CardActionArea onClick={() => handleRoleChange({ target: { value: 'instructor' } } as React.ChangeEvent<HTMLInputElement>)}>
                            <CardContent sx={{ textAlign: 'center', py: 2, px: 2 }}>
                              <SchoolIcon sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                Instructor
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Teach others
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                    {errors.role && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {errors.role}
                      </Typography>
                    )}
                  </Box>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 3, 
                      mb: 2, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2
                    }}
                    size="large"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Auth;
