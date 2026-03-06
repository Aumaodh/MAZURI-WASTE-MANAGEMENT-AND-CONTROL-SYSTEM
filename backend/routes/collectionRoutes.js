const express = require('express');
const {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  getCollectionStats
} = require('../controllers/collectionController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', createCollection);
router.get('/', getAllCollections);
router.get('/stats', getCollectionStats);
router.get('/:id', getCollectionById);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

module.exports = router;
