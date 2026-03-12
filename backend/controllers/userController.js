const User = require('../models/User');

const isAdmin = (req) => req.user && req.user.role === 'admin';
const validRoles = ['admin', 'waste-manager', 'collector', 'supervisor', 'viewer'];

// Create user (admin only)
const createUser = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, email, password, phone, location, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      location,
      role: role || 'viewer'
    });

    await user.save();

    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { role, isActive } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, phone, location, role, isActive } = req.body;

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    const userResponse = await User.findById(user._id).select('-password');

    res.status(200).json({ message: 'User updated', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset user password
const resetUserPassword = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change user role
const changeUserRole = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { role } = req.body;

    if (!['admin', 'waste-manager', 'collector', 'supervisor', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  resetUserPassword,
  deleteUser,
  changeUserRole
};
