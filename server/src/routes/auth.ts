import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'secret';

  // Check if email is in allowed list from environment variable
  const allowedAdminsEnv = process.env.ALLOWED_ADMINS || '';
  const allowedEmails = allowedAdminsEnv.split(',').map(e => e.trim()).filter(e => e.length > 0);

  if (allowedEmails.length === 0) {
    return res.status(500).json({ message: 'Server configuration error: No admin emails configured' });
  }

  if (!allowedEmails.includes(email) || password !== adminPass) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });
  res.json({ token, email });
});

export default router;
