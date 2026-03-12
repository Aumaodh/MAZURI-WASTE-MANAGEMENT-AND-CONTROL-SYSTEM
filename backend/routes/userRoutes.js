const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  resetUserPassword,
  deleteUser,
  changeUserRole
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);
router.patch('/:id/role', changeUserRole);

module.exports = router;
