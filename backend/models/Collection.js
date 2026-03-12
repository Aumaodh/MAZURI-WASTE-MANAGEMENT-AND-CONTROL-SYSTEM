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
  payment: {
    requiredAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'KES'
    },
    status: {
      type: String,
      enum: ['unpaid', 'pending', 'paid', 'failed'],
      default: 'unpaid'
    },
    phoneNumber: String,
    mpesaReceiptNumber: String,
    merchantRequestId: String,
    checkoutRequestId: String,
    responseCode: String,
    responseDescription: String,
    customerMessage: String,
    lastAttemptAt: Date,
    paidAt: Date,
    failureReason: String,
    callbackPayload: mongoose.Schema.Types.Mixed
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
