import connectDB from '../../utils/db';
import ActiveComplaint from '../../models/ActiveComplaint';

export default async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    const { username, answers } = req.body;

    try {
      await ActiveComplaint.findOneAndUpdate(
        { username },
        { answers },
        { upsert: true, new: true }
      );
      res.status(200).json({ success: true, message: 'Active complaint added successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};
