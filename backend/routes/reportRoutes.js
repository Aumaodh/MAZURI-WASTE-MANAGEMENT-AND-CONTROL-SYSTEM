const express = require('express');
const {
  generateReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
} = require('../controllers/reportController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', generateReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;
