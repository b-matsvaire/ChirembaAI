import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  res.setHeader(
    'Set-Cookie',
    serialize('username', '', {
      path: '/',
      expires: new Date(0), // Expire the cookie immediately
    })
  );

  res.status(200).json({ success: true, message: 'Logout successful' });
}
