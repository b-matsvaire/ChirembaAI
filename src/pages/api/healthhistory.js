import connectDB from '../../utils/db';
import HealthHistory from '../../models/HealthHistory';
import { parse } from 'cookie';

export default async (req, res) => {
  await connectDB();

  const { personalHistory, familyHistory, medicalHistory, allergies } = req.body;
  const { username } = parse(req.headers.cookie || '');

  try {
    const existingHistory = await HealthHistory.findOne({ username });

    if (existingHistory) {
      existingHistory.personalHistory = personalHistory;
      existingHistory.familyHistory = familyHistory;
      existingHistory.medicalHistory = medicalHistory;
      existingHistory.allergies = allergies;
      await existingHistory.save();
    } else {
      const newHistory = new HealthHistory({
        username,
        personalHistory,
        familyHistory,
        medicalHistory,
        allergies
      });
      await newHistory.save();
    }

    res.status(201).json({ success: true, message: 'Health history saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
