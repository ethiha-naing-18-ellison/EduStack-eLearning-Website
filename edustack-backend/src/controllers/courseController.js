const { Course, User, Category, CourseSection, Lesson, Review, Enrollment } = require('../models');
const { Op } = require('sequelize');

// Get all courses with filters
const getAllCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      instructor, 
      difficulty, 
      search,
      published = true 
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereClause = {};
    let includeClause = [
      {
        model: User,
        as: 'Instructor',
        attributes: ['id', 'name', 'email', 'profile_image']
      },
      {
        model: Category,
        attributes: ['id', 'name', 'description']
      }
    ];

    // Filter by published status
    if (published !== undefined) {
      whereClause.is_published = published === 'true';
    }

    // Filter by category
    if (category) {
      whereClause.category_id = category;
    }

    // Filter by instructor
    if (instructor) {
      whereClause.instructor_id = instructor;
    }

    // Filter by difficulty
    if (difficulty) {
      whereClause.difficulty_level = difficulty;
    }

    // Search by title or description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      message: 'Courses retrieved successfully',
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalCourses: count,
        hasNext: offset + courses.length < count,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      message: 'Failed to retrieve courses',
      error: 'COURSES_ERROR'
    });
  }
};

// Get course by ID with full details
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Instructor',
          attributes: ['id', 'name', 'email', 'profile_image', 'bio']
        },
        {
          model: Category,
          attributes: ['id', 'name', 'description']
        },
        {
          model: CourseSection,
          include: [{
            model: Lesson,
            attributes: ['id', 'title', 'lesson_type', 'duration_minutes', 'is_preview', 'order_index']
          }],
          order: [['order_index', 'ASC']]
        },
        {
          model: Review,
          include: [{
            model: User,
            attributes: ['id', 'name', 'profile_image']
          }],
          where: { is_approved: true },
          required: false
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
        error: 'COURSE_NOT_FOUND'
      });
    }

    // Calculate average rating
    const reviews = course.Reviews || [];
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const courseData = {
      ...course.toJSON(),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    };

    res.json({
      message: 'Course retrieved successfully',
      course: courseData
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      message: 'Failed to retrieve course',
      error: 'COURSE_ERROR'
    });
  }
};

// Create new course (Instructor/Admin only)
const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      category_id, 
      difficulty_level, 
      language,
      thumbnail_url 
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required',
        error: 'VALIDATION_ERROR'
      });
    }

    // Check if category exists
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          message: 'Category not found',
          error: 'CATEGORY_NOT_FOUND'
        });
      }
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      price: price || 0,
      instructor_id: req.user.id,
      category_id,
      difficulty_level: difficulty_level || 'beginner',
      language: language || 'en',
      thumbnail_url,
      is_published: false
    });

    // Get course with instructor info
    const courseWithInstructor = await Course.findByPk(course.id, {
      include: [{
        model: User,
        as: 'Instructor',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      message: 'Course created successfully',
      course: courseWithInstructor
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      message: 'Failed to create course',
      error: 'CREATE_ERROR'
    });
  }
};

// Update course (Instructor/Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      price, 
      category_id, 
      difficulty_level, 
      language,
      thumbnail_url,
      is_published 
    } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
        error: 'COURSE_NOT_FOUND'
      });
    }

    // Check if user owns the course or is admin
    if (course.instructor_id !== req.user.id && req.user.Role.name !== 'Admin') {
      return res.status(403).json({
        message: 'You can only update your own courses',
        error: 'FORBIDDEN'
      });
    }

    // Update course
    await course.update({
      title: title || course.title,
      description: description || course.description,
      price: price !== undefined ? price : course.price,
      category_id: category_id || course.category_id,
      difficulty_level: difficulty_level || course.difficulty_level,
      language: language || course.language,
      thumbnail_url: thumbnail_url || course.thumbnail_url,
      is_published: is_published !== undefined ? is_published : course.is_published
    });

    // Get updated course with instructor info
    const updatedCourse = await Course.findByPk(id, {
      include: [{
        model: User,
        as: 'Instructor',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      message: 'Failed to update course',
      error: 'UPDATE_ERROR'
    });
  }
};

// Delete course (Instructor/Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
        error: 'COURSE_NOT_FOUND'
      });
    }

    // Check if user owns the course or is admin
    if (course.instructor_id !== req.user.id && req.user.Role.name !== 'Admin') {
      return res.status(403).json({
        message: 'You can only delete your own courses',
        error: 'FORBIDDEN'
      });
    }

    await course.destroy();

    res.json({
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      message: 'Failed to delete course',
      error: 'DELETE_ERROR'
    });
  }
};

// Get instructor's courses
const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: courses } = await Course.findAndCountAll({
      where: { instructor_id: instructorId },
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      message: 'Instructor courses retrieved successfully',
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalCourses: count,
        hasNext: offset + courses.length < count,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      message: 'Failed to retrieve instructor courses',
      error: 'INSTRUCTOR_COURSES_ERROR'
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses
};
