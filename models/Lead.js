// models/Lead.js

import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: { 
        type: String, 
        enum: ['New', 'Contacted', 'Converted'], 
        default: 'New', 
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true, strict: false }
);

// Remove the existing model from cache if it exists
delete mongoose.connection.models['Lead'];

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);