import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Home from './components/Home';
import Auth from './components/Auth';
import Courses from './pages/Courses';
import Categories from './pages/Categories';
import Instructors from './pages/Instructors';
import About from './components/About';
import Contact from './components/Contact';
import MyCourses from './pages/MyCourses';
import CourseDetails from './pages/CourseDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/courses" element={<Layout><Courses /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
          <Route path="/instructors" element={<Layout><Instructors /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/mycourses" element={<Layout><MyCourses /></Layout>} />
          <Route path="/course-details/:id" element={<Layout><CourseDetails /></Layout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
