const { Role } = require('../models');

const seedRoles = async () => {
  try {
    // Check if roles already exist
    const existingRoles = await Role.count();
    if (existingRoles > 0) {
      console.log('✅ Roles already exist, skipping seed');
      return;
    }

    // Create roles
    const roles = [
      {
        name: 'Admin',
        description: 'System administrator with full access',
        permissions: JSON.stringify({
          users: ['create', 'read', 'update', 'delete'],
          courses: ['create', 'read', 'update', 'delete'],
          instructors: ['approve', 'reject', 'manage'],
          payments: ['read', 'manage'],
          reports: ['read', 'generate']
        })
      },
      {
        name: 'Instructor',
        description: 'Course instructor with teaching permissions',
        permissions: JSON.stringify({
          courses: ['create', 'read', 'update', 'delete'],
          students: ['read'],
          lessons: ['create', 'read', 'update', 'delete'],
          resources: ['create', 'read', 'update', 'delete']
        })
      },
      {
        name: 'Student',
        description: 'Regular student with learning permissions',
        permissions: JSON.stringify({
          courses: ['read'],
          enrollments: ['create', 'read'],
          lessons: ['read'],
          payments: ['create', 'read']
        })
      }
    ];

    await Role.bulkCreate(roles);
    console.log('✅ Roles seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding roles:', error);
  }
};

module.exports = seedRoles;
