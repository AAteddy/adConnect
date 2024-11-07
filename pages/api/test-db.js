import dbConnect from  '../../utils/database/mongodb';

export default async function handler(req, res) {
  try {
    await dbConnect();
    res.status(200).json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error); // Log full error to the console
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message || 'Unknown error',
    });
  }
}