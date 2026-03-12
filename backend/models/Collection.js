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
    method: {
      type: String,
      enum: ['mpesa', 'cash'],
      required: false
    },
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
    cashReference: String,
    lastAttemptAt: Date,
    paidAt: Date,
    failureReason: String,
    callbackPayload: mongoose.Schema.Types.Mixed,
    history: [{
      method: {
        type: String,
        enum: ['mpesa', 'cash']
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed']
      },
      amount: {
        type: Number,
        min: 0
      },
      currency: {
        type: String,
        default: 'KES'
      },
      phoneNumber: String,
      reference: String,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
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

// Auto-generate collectionId before required-field validation runs
collectionSchema.pre('validate', async function(next) {
  try {
    if (!this.collectionId) {
      const count = await this.constructor.countDocuments();
      this.collectionId = `COLL-${Date.now()}-${count + 1}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Collection', collectionSchema);
