const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        error: 'UNAUTHORIZED' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user with role information
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: Role,
        as: 'Role'
      }]
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token - user not found',
        error: 'UNAUTHORIZED' 
      });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED' 
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Authentication error',
      error: 'AUTH_ERROR' 
    });
  }
};

// Role-based Access Control Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'UNAUTHORIZED' 
      });
    }

    const userRole = req.user.Role?.name;
    
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied - insufficient permissions',
        error: 'FORBIDDEN',
        requiredRoles: roles,
        userRole: userRole
      });
    }

    next();
  };
};

// Admin only access
const requireAdmin = authorizeRoles('Admin');

// Instructor or Admin access
const requireInstructor = authorizeRoles('Instructor', 'Admin');

// Student, Instructor, or Admin access
const requireUser = authorizeRoles('Student', 'Instructor', 'Admin');

// Check if user owns resource or is admin
const requireOwnershipOrAdmin = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'UNAUTHORIZED' 
      });
    }

    const userRole = req.user.Role?.name;
    const userId = req.user.id;
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    // Admin can access everything
    if (userRole === 'Admin') {
      return next();
    }

    // User can only access their own resources
    if (userId.toString() === resourceUserId?.toString()) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied - you can only access your own resources',
      error: 'FORBIDDEN' 
    });
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireInstructor,
  requireUser,
  requireOwnershipOrAdmin
};
