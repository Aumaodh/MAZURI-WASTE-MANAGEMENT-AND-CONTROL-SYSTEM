const express = require('express');
const {
  createWaste,
  getAllWaste,
  getWasteById,
  updateWaste,
  deleteWaste,
  getWasteStats
} = require('../controllers/wasteController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', createWaste);
router.get('/', getAllWaste);
router.get('/stats', getWasteStats);
router.get('/:id', getWasteById);
router.put('/:id', updateWaste);
router.delete('/:id', deleteWaste);

module.exports = router;
