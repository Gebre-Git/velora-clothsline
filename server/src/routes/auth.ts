import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'secret';
  if (username !== adminUser || password !== adminPass) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });
  res.json({ token });
});

export default router;
