const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateProfile, 
  changePassword, 
  deactivateUser, 
  activateUser, 
  deleteUser 
} = require('../controllers/userController');
const { 
  authenticateToken, 
  requireAdmin, 
  requireOwnershipOrAdmin 
} = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// Get user by ID (Admin or own profile)
router.get('/:id', authenticateToken, requireOwnershipOrAdmin('id'), getUserById);

// Update user profile (Admin or own profile)
router.put('/:id', authenticateToken, requireOwnershipOrAdmin('id'), updateProfile);

// Change password (own profile only)
router.put('/:id/password', authenticateToken, requireOwnershipOrAdmin('id'), changePassword);

// Deactivate user account (Admin only)
router.put('/:id/deactivate', authenticateToken, requireAdmin, deactivateUser);

// Activate user account (Admin only)
router.put('/:id/activate', authenticateToken, requireAdmin, activateUser);

// Delete user account (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;
