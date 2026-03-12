const User = require('../models/User');

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  if (!adminEmail || !adminPassword) {
    console.warn('Skipping admin bootstrap: ADMIN_EMAIL or ADMIN_PASSWORD is missing');
    return;
  }

  const normalizedEmail = String(adminEmail).trim().toLowerCase();
  const existingAdmin = await User.findOne({ email: normalizedEmail });

  if (existingAdmin) {
    return;
  }

  const adminUser = new User({
    name: adminName,
    email: normalizedEmail,
    password: adminPassword,
    role: 'admin',
    isActive: true
  });

  await adminUser.save();
  console.log(`Default admin user created: ${normalizedEmail}`);
};

const bootstrapAppData = async () => {
  await ensureAdminUser();
};

module.exports = {
  bootstrapAppData
};
