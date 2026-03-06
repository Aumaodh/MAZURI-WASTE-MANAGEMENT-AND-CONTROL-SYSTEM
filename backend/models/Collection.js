const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  collectionId: {
    type: String,
    unique: true,
    required: true
  },
  wasteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waste',
    required: true
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectionDate: {
    type: Date,
    required: true
  },
  actualQuantity: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'tons', 'liters', 'bags', 'boxes'],
      default: 'kg'
    }
  },
  location: {
    type: String,
    required: true
  },
  vehicleId: String,
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'failed'],
    default: 'scheduled'
  },
  notes: String,
  photos: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate collectionId
collectionSchema.pre('save', async function(next) {
  if (!this.collectionId) {
    const count = await mongoose.model('Collection').countDocuments();
    this.collectionId = `COLL-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Collection', collectionSchema);
