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
        enum: ['new', 'contacted', 'qualified', 'converted', 'closed'], 
        default: 'new' 
    },
    optInVideo: {
        url: { type: String, default: null },
        watched: { type: Boolean, default: false }
    },
    bookingLink: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true, strict: false }
);

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);