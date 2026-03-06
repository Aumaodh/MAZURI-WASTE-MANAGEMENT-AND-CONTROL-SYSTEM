const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  reportType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'],
    required: true
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    totalWasteCollected: {
      amount: Number,
      unit: String
    },
    wasteByType: {
      organic: Number,
      recyclable: Number,
      hazardous: Number,
      electronic: Number,
      mixed: Number
    },
    wasteBySource: {
      residential: Number,
      commercial: Number,
      industrial: Number,
      institutional: Number,
      agricultural: Number
    },
    collectionCount: Number,
    completionRate: Number
  },
  insights: {
    peakCollection: String,
    leastCollected: String,
    recommendations: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate reportId
reportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const count = await mongoose.model('Report').countDocuments();
    this.reportId = `RPT-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);
