import { parse } from 'cookie';
import User from '../../models/User';
import connectDB from '../../utils/db';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(401).json({ success: false, message: 'No session found' });
  }

  const parsedCookies = parse(cookies);
  const username = parsedCookies.username;

  if (!username) {
    return res.status(401).json({ success: false, message: 'No session found' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        sex: user.sex,
        age: user.age,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
