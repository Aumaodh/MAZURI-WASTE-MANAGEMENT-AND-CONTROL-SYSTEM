const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/role', changeUserRole);

module.exports = router;
