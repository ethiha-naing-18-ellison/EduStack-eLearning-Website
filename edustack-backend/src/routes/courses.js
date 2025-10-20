const express = require('express');
const router = express.Router();
const { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getInstructorCourses 
} = require('../controllers/courseController');
const { 
  authenticateToken, 
  requireInstructor, 
  requireAdmin 
} = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (authentication required)
router.post('/', authenticateToken, requireInstructor, createCourse);
router.put('/:id', authenticateToken, requireInstructor, updateCourse);
router.delete('/:id', authenticateToken, requireInstructor, deleteCourse);

// Get instructor's courses
router.get('/instructor/:instructorId', getInstructorCourses);

module.exports = router;
