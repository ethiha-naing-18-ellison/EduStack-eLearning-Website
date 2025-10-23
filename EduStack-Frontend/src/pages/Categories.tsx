import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School,
  Code,
  Palette,
  Business,
  Science,
  Security,
  Cloud,
  PhoneAndroid
} from '@mui/icons-material';

interface Category {
  id: number;
  name: string;
  description: string;
  courseCount: number;
  icon: React.ReactNode;
  color: string;
}

const Categories: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories: Category[] = [
    {
      id: 1,
      name: "Web Development",
      description: "Learn modern web technologies including HTML, CSS, JavaScript, React, and more.",
      courseCount: 25,
      icon: <Code sx={{ fontSize: 40 }} />,
      color: "#1976d2"
    },
    {
      id: 2,
      name: "Data Science",
      description: "Master data analysis, machine learning, and artificial intelligence with Python and R.",
      courseCount: 18,
      icon: <Science sx={{ fontSize: 40 }} />,
      color: "#2e7d32"
    },
    {
      id: 3,
      name: "UI/UX Design",
      description: "Create beautiful and user-friendly interfaces with design principles and tools.",
      courseCount: 12,
      icon: <Palette sx={{ fontSize: 40 }} />,
      color: "#ed6c02"
    },
    {
      id: 4,
      name: "Business",
      description: "Develop business skills including marketing, management, and entrepreneurship.",
      courseCount: 20,
      icon: <Business sx={{ fontSize: 40 }} />,
      color: "#9c27b0"
    },
    {
      id: 5,
      name: "Cybersecurity",
      description: "Learn to protect systems and data from cyber threats and attacks.",
      courseCount: 15,
      icon: <Security sx={{ fontSize: 40 }} />,
      color: "#d32f2f"
    },
    {
      id: 6,
      name: "Cloud Computing",
      description: "Master cloud platforms like AWS, Azure, and Google Cloud for scalable solutions.",
      courseCount: 10,
      icon: <Cloud sx={{ fontSize: 40 }} />,
      color: "#0288d1"
    },
    {
      id: 7,
      name: "Mobile Development",
      description: "Build mobile apps for iOS and Android using React Native and Flutter.",
      courseCount: 14,
      icon: <PhoneAndroid sx={{ fontSize: 40 }} />,
      color: "#7b1fa2"
    },
    {
      id: 8,
      name: "Programming",
      description: "Learn programming fundamentals and advanced concepts in various languages.",
      courseCount: 30,
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#388e3c"
    }
  ];

  const handleCategoryClick = (categoryId: number) => {
    // Future: Filter courses by category
    alert(`Filtering courses by category ${categoryId}. This feature will be implemented soon!`);
  };

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
            Course Categories
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Explore our diverse range of course categories and find the perfect learning path for your goals.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
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
                  <Box
                    sx={{
                      color: category.color,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {category.icon}
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2
                    }}
                  >
                    {category.name}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      mb: 3
                    }}
                  >
                    {category.description}
                  </Typography>
                  
                  <Chip
                    label={`${category.courseCount} Courses`}
                    sx={{
                      backgroundColor: category.color,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                      borderColor: category.color,
                      color: category.color,
                      '&:hover': {
                        backgroundColor: category.color,
                        color: 'white'
                      }
                    }}
                  >
                    Explore Courses
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Categories;
