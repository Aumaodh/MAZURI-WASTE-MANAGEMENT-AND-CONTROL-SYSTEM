const Report = require('../models/Report');
const Waste = require('../models/Waste');
const Collection = require('../models/Collection');

// Generate report
const generateReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;

    // Get waste data
    const wasteData = await Waste.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Get collection data
    const collectionData = await Collection.find({
      collectionDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Calculate statistics
    const wasteByType = {
      organic: 0,
      recyclable: 0,
      hazardous: 0,
      electronic: 0,
      mixed: 0
    };

    const wasteBySource = {
      residential: 0,
      commercial: 0,
      industrial: 0,
      institutional: 0,
      agricultural: 0
    };

    let totalQuantity = 0;

    wasteData.forEach(waste => {
      wasteByType[waste.wasteType] += waste.quantity.amount || 0;
      wasteBySource[waste.source] += waste.quantity.amount || 0;
      totalQuantity += waste.quantity.amount || 0;
    });

    const completedCollections = collectionData.filter(c => c.status === 'completed').length;
    const completionRate = collectionData.length > 0 ? (completedCollections / collectionData.length) * 100 : 0;

    const report = new Report({
      reportType,
      period: { startDate, endDate },
      generatedBy: req.user.id,
      summary: {
        totalWasteCollected: {
          amount: totalQuantity,
          unit: 'kg'
        },
        wasteByType,
        wasteBySource,
        collectionCount: collectionData.length,
        completionRate: Math.round(completionRate)
      },
      insights: {
        peakCollection: Object.keys(wasteByType).reduce((a, b) => wasteByType[a] > wasteByType[b] ? a : b),
        leastCollected: Object.keys(wasteByType).reduce((a, b) => wasteByType[a] < wasteByType[b] ? a : b),
        recommendations: [
          'Increase collection frequency for high-volume areas',
          'Implement better waste segregation practices',
          'Consider specialized handling for hazardous waste'
        ]
      },
      status: 'published'
    });

    await report.save();
    await report.populate('generatedBy', 'name email');

    res.status(201).json({ message: 'Report generated successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const { status, reportType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (reportType) filter.reportType = reportType;

    const reports = await Report.find(filter).populate('generatedBy', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('generatedBy', 'name email');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update report
const updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('generatedBy', 'name email');

    res.status(200).json({ message: 'Report updated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
};
