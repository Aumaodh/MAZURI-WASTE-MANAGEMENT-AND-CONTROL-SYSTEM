const Collection = require('../models/Collection');
const Waste = require('../models/Waste');

// Create collection record
const createCollection = async (req, res) => {
  try {
    const { wasteId, collectorId, collectionDate, actualQuantity, location, vehicleId, notes } = req.body;

    const collection = new Collection({
      wasteId,
      collectorId,
      collectionDate,
      actualQuantity,
      location,
      vehicleId,
      notes,
      status: 'scheduled'
    });

    await collection.save();
    await collection.populate(['wasteId', 'collectorId']);

    res.status(201).json({ message: 'Collection record created', collection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all collections
const getAllCollections = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const collections = await Collection.find(filter)
      .populate('wasteId')
      .populate('collectorId', 'name email phone');

    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get collection by ID
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('wasteId')
      .populate('collectorId', 'name email phone');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update collection status
const updateCollection = async (req, res) => {
  try {
    const { status, actualQuantity, notes } = req.body;

    let collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (status) collection.status = status;
    if (actualQuantity) collection.actualQuantity = actualQuantity;
    if (notes) collection.notes = notes;

    await collection.save();
    await collection.populate(['wasteId', 'collectorId']);

    // Update waste status if collection is completed
    if (status === 'completed') {
      await Waste.findByIdAndUpdate(collection.wasteId, { status: 'collected' });
    }

    res.status(200).json({ message: 'Collection updated', collection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete collection
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get collection statistics
const getCollectionStats = async (req, res) => {
  try {
    const stats = await Collection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$actualQuantity.amount' }
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  getCollectionStats
};
