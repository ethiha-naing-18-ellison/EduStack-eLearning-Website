import React from 'react';
import { Box } from '@mui/material';
import Hero from './Hero';
import FeaturedCourses from './FeaturedCourses';
import About from './About';
import Contact from './Contact';

const Home: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Hero />
      <FeaturedCourses />
      <About />
      <Contact />
    </Box>
  );
};

export default Home;
