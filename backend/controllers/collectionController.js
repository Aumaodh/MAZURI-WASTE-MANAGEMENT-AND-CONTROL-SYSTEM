const Collection = require('../models/Collection');
const Waste = require('../models/Waste');
const { initiateStkPush, formatPhoneNumber } = require('../services/mpesaService');

const COLLECTION_RATE_PER_UNIT = Number(process.env.COLLECTION_RATE_PER_UNIT || 50);

const ensurePaymentState = (collection) => {
  if (!collection.payment) {
    collection.payment = {
      requiredAmount: 0,
      currency: 'KES',
      status: 'unpaid'
    };
  }

  if (typeof collection.payment.requiredAmount !== 'number') {
    collection.payment.requiredAmount = 0;
  }

  if (!collection.payment.currency) {
    collection.payment.currency = 'KES';
  }

  if (!collection.payment.status) {
    collection.payment.status = 'unpaid';
  }
};

const calculateCollectionAmount = (collection) => {
  const quantity = Number(collection?.actualQuantity?.amount || 0);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 0;
  }

  return Math.ceil(quantity * COLLECTION_RATE_PER_UNIT);
};

const parseMpesaDate = (rawValue) => {
  if (!rawValue) return null;
  const value = String(rawValue);
  if (!/^\d{14}$/.test(value)) return null;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(8, 10));
  const minute = Number(value.slice(10, 12));
  const second = Number(value.slice(12, 14));

  return new Date(year, month, day, hour, minute, second);
};

// Create collection record
const createCollection = async (req, res) => {
  try {
    const { wasteId, collectorId, collectionDate, actualQuantity, location, vehicleId, notes } = req.body;
    const requiredAmount = Math.ceil((Number(actualQuantity?.amount) || 0) * COLLECTION_RATE_PER_UNIT);

    const collection = new Collection({
      wasteId,
      collectorId,
      collectionDate,
      actualQuantity,
      location,
      vehicleId,
      notes,
      status: 'scheduled',
      payment: {
        requiredAmount: requiredAmount > 0 ? requiredAmount : 0,
        currency: 'KES',
        status: 'unpaid'
      }
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

    ensurePaymentState(collection);

    if (status === 'completed' && collection?.payment?.status !== 'paid') {
      return res.status(400).json({
        message: 'Collection cannot be marked completed before payment is confirmed'
      });
    }

    if (status) collection.status = status;
    if (actualQuantity) collection.actualQuantity = actualQuantity;
    if (notes) collection.notes = notes;

    if (actualQuantity && collection?.payment?.status !== 'paid') {
      collection.payment.requiredAmount = calculateCollectionAmount(collection);
    }

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

// Initiate M-Pesa payment for a collection
const initiateCollectionPayment = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    ensurePaymentState(collection);

    if (collection?.payment?.status === 'paid') {
      return res.status(400).json({ message: 'Collection is already paid' });
    }

    const requestedAmount = Number(req.body.amount);
    const baseAmount = collection?.payment?.requiredAmount || calculateCollectionAmount(collection);
    const amount = Number.isFinite(requestedAmount) && requestedAmount > 0
      ? Math.ceil(requestedAmount)
      : Math.ceil(baseAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Payment amount must be greater than zero' });
    }

    const phoneNumber = formatPhoneNumber(req.body.phoneNumber);
    if (!phoneNumber) {
      return res.status(400).json({ message: 'A valid phone number is required' });
    }

    const mpesaResponse = await initiateStkPush({
      phoneNumber,
      amount,
      accountReference: collection.collectionId,
      transactionDesc: `Payment for ${collection.collectionId}`
    });

    collection.payment.requiredAmount = amount;
    collection.payment.currency = 'KES';
    collection.payment.phoneNumber = phoneNumber;
    collection.payment.status = 'pending';
    collection.payment.lastAttemptAt = new Date();
    collection.payment.merchantRequestId = mpesaResponse.MerchantRequestID;
    collection.payment.checkoutRequestId = mpesaResponse.CheckoutRequestID;
    collection.payment.responseCode = mpesaResponse.ResponseCode;
    collection.payment.responseDescription = mpesaResponse.ResponseDescription;
    collection.payment.customerMessage = mpesaResponse.CustomerMessage;
    collection.payment.failureReason = undefined;

    await collection.save();

    return res.status(200).json({
      message: 'M-Pesa payment request sent',
      payment: collection.payment
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Receive M-Pesa STK callback updates
const handleMpesaCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback?.CheckoutRequestID) {
      return res.status(400).json({ message: 'Invalid callback payload' });
    }

    const collection = await Collection.findOne({
      'payment.checkoutRequestId': callback.CheckoutRequestID
    });

    if (!collection) {
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'Accepted'
      });
    }

    ensurePaymentState(collection);

    collection.payment.callbackPayload = callback;
    collection.payment.responseCode = String(callback.ResultCode);
    collection.payment.responseDescription = callback.ResultDesc;

    if (String(callback.ResultCode) === '0') {
      const metadata = callback.CallbackMetadata?.Item || [];
      const metadataMap = metadata.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      collection.payment.status = 'paid';
      collection.payment.mpesaReceiptNumber = metadataMap.MpesaReceiptNumber;
      collection.payment.phoneNumber = formatPhoneNumber(metadataMap.PhoneNumber || collection.payment.phoneNumber);
      collection.payment.paidAt = parseMpesaDate(metadataMap.TransactionDate) || new Date();
      collection.payment.failureReason = undefined;
    } else {
      collection.payment.status = 'failed';
      collection.payment.failureReason = callback.ResultDesc;
    }

    await collection.save();

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Accepted'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCollectionPaymentStatus = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    ensurePaymentState(collection);

    res.status(200).json({ payment: collection.payment });
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
  getCollectionStats,
  initiateCollectionPayment,
  handleMpesaCallback,
  getCollectionPaymentStatus
};
