const express = require('express');
const {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  getCollectionStats,
  initiateCollectionPayment,
  handleMpesaCallback,
  getCollectionPaymentStatus
} = require('../controllers/collectionController');
const auth = require('../middleware/auth');

const router = express.Router();

// M-Pesa callback is called by Safaricom and must remain public
router.post('/payment/callback', handleMpesaCallback);

// All routes require authentication
router.use(auth);

router.post('/', createCollection);
router.get('/', getAllCollections);
router.get('/stats', getCollectionStats);
router.post('/:id/payment/initiate', initiateCollectionPayment);
router.get('/:id/payment', getCollectionPaymentStatus);
router.get('/:id', getCollectionById);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

module.exports = router;
