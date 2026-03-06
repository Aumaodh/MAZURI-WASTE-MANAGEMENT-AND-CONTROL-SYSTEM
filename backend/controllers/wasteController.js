const Waste = require('../models/Waste');

// Create waste entry
const createWaste = async (req, res) => {
  try {
    const { source, location, wasteType, quantity, description, pickupScheduled, contactPerson } = req.body;

    const waste = new Waste({
      source,
      location,
      wasteType,
      quantity,
      description,
      pickupScheduled,
      contactPerson,
      status: 'pending'
    });

    await waste.save();
    res.status(201).json({ message: 'Waste entry created successfully', waste });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all waste entries
const getAllWaste = async (req, res) => {
  try {
    const { status, source, wasteType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (wasteType) filter.wasteType = wasteType;

    const waste = await Waste.find(filter).populate('assignedTo', 'name email phone');
    res.status(200).json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single waste entry
const getWasteById = async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id).populate('assignedTo', 'name email phone');
    if (!waste) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }
    res.status(200).json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update waste entry
const updateWaste = async (req, res) => {
  try {
    let waste = await Waste.findById(req.params.id);
    if (!waste) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }

    waste = await Waste.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ message: 'Waste entry updated successfully', waste });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete waste entry
const deleteWaste = async (req, res) => {
  try {
    const waste = await Waste.findByIdAndDelete(req.params.id);
    if (!waste) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }
    res.status(200).json({ message: 'Waste entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get waste statistics
const getWasteStats = async (req, res) => {
  try {
    const stats = await Waste.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity.amount' }
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWaste,
  getAllWaste,
  getWasteById,
  updateWaste,
  deleteWaste,
  getWasteStats
};
