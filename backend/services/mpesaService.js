const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';

const BASE_URL = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;

  const normalized = String(phoneNumber).replace(/\s+/g, '').replace('+', '');

  if (/^0\d{9}$/.test(normalized)) {
    return `254${normalized.slice(1)}`;
  }

  if (/^254\d{9}$/.test(normalized)) {
    return normalized;
  }

  return null;
};

const generateTimestamp = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
};

const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('Missing M-Pesa consumer credentials');
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get M-Pesa access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
};

const initiateStkPush = async ({ phoneNumber, amount, accountReference, transactionDesc }) => {
  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!shortCode || !passkey || !callbackUrl) {
    throw new Error('Missing M-Pesa configuration: shortcode, passkey, or callback URL');
  }

  const validPhoneNumber = formatPhoneNumber(phoneNumber);
  if (!validPhoneNumber) {
    throw new Error('Invalid phone number format. Use 07XXXXXXXX or 2547XXXXXXXX');
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Invalid amount. Amount must be greater than 0');
  }

  const timestamp = generateTimestamp();
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
  const token = await getAccessToken();

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(numericAmount),
    PartyA: validPhoneNumber,
    PartyB: shortCode,
    PhoneNumber: validPhoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc
  };

  const response = await fetch(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.errorMessage || data?.errorCode || response.statusText;
    throw new Error(`M-Pesa STK push failed: ${errorMessage}`);
  }

  return data;
};

module.exports = {
  initiateStkPush,
  formatPhoneNumber
};
