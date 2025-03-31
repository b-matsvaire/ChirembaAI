// Filepath: /c:/Users/Yash_MSI/Desktop/c-/Personal Projects/healthai/src/pages/api/login.js
import connectDB from '../../utils/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async (req, res) => {
  await connectDB();

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Set cookies for username and role
    res.setHeader('Set-Cookie', [
      serialize('username', username, { path: '/' }),
      serialize('role', user.roleType, { path: '/' }), // Set the role cookie
    ]);

    // Return success response with user details
    res.status(200).json({
      success: true,
      message: 'Login successful',
      username: user.username,
      role: user.roleType,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};