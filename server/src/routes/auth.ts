import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'secret';

  // Check if email is in allowed list
  const allowedEmails = ['gebre2024mail@gmail.com', 'gebreone777@gmail.com'];
  if (!allowedEmails.includes(email) || password !== adminPass) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });
  res.json({ token, email });
});

export default router;
