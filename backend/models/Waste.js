const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  wasteId: {
    type: String,
    unique: true,
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'industrial', 'institutional', 'agricultural']
  },
  location: {
    type: String,
    required: true
  },
  wasteType: {
    type: String,
    required: true,
    enum: ['organic', 'recyclable', 'hazardous', 'electronic', 'mixed']
  },
  quantity: {
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
  description: {
    type: String,
    required: false
  },
  pickupScheduled: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'collected', 'processed', 'disposed'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate wasteId
wasteSchema.pre('save', async function(next) {
  if (!this.wasteId) {
    const count = await mongoose.model('Waste').countDocuments();
    this.wasteId = `WASTE-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Waste', wasteSchema);
