// models/Admin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// Pre-save hook to hash password before saving
adminSchema.pre('save', async function (next) {
  const admin = this;

  // Hash password only if it has been modified or is new
  if (!admin.isModified('password')) return next();

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
  next();
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;