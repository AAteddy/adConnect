// pages/api/seedAdmin.js

// import dbConnect from '../../utils/mongodb';
// import Admin from '../../models/Admin';

// export default async function handler(req, res) {
//   await dbConnect();

//   // Check if an admin already exists
//   const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
//   if (existingAdmin) {
//     return res.status(400).json({ message: 'Admin already exists' });
//   }

//   // Create a new admin
//   const admin = new Admin({
//     name: 'Admin User',
//     email: 'admin@example.com',
//     password: 'your_secure_password', // password will be hashed in the pre-save hook
//   });

//   await admin.save();

//   res.status(201).json({ message: 'Admin created successfully' });
// }