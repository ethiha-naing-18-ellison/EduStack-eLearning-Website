const sequelize = require('../config/database');

const User = require('./user');
const Role = require('./role');
const Course = require('./course');
const CourseSection = require('./courseSection');
const Lesson = require('./lesson');
const Resource = require('./resource');
const Enrollment = require('./enrollment');
const LessonProgress = require('./lessonProgress');
const Payment = require('./payment');
const Review = require('./review');
const InstructorApplication = require('./instructorApplication');
const Category = require('./category');

// Relations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(Course, { foreignKey: 'instructor_id' });
Course.belongsTo(User, { foreignKey: 'instructor_id' });

Course.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Course, { foreignKey: 'category_id' });

Course.hasMany(CourseSection, { foreignKey: 'course_id' });
CourseSection.belongsTo(Course, { foreignKey: 'course_id' });

CourseSection.hasMany(Lesson, { foreignKey: 'section_id' });
Lesson.belongsTo(CourseSection, { foreignKey: 'section_id' });

Lesson.hasMany(Resource, { foreignKey: 'lesson_id' });
Resource.belongsTo(Lesson, { foreignKey: 'lesson_id' });

User.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(User, { foreignKey: 'student_id' });

Course.hasMany(Enrollment, { foreignKey: 'course_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

Course.hasMany(Payment, { foreignKey: 'course_id' });
Payment.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Review, { foreignKey: 'student_id' });
Review.belongsTo(User, { foreignKey: 'student_id' });

Course.hasMany(Review, { foreignKey: 'course_id' });
Review.belongsTo(Course, { foreignKey: 'course_id' });

Lesson.hasMany(LessonProgress, { foreignKey: 'lesson_id' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id' });

User.hasMany(LessonProgress, { foreignKey: 'student_id' });
LessonProgress.belongsTo(User, { foreignKey: 'student_id' });

User.hasMany(InstructorApplication, { foreignKey: 'user_id' });
InstructorApplication.belongsTo(User, { foreignKey: 'user_id' });

// Self-referencing for categories
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'Subcategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'Parent' });

module.exports = {
  sequelize,
  User,
  Role,
  Course,
  CourseSection,
  Lesson,
  Resource,
  Enrollment,
  LessonProgress,
  Payment,
  Review,
  InstructorApplication,
  Category,
};
