import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  console.error('❌ CRITICAL: .env file not found or MONGODB_URI is empty');
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders';
import reviewsRouter from './routes/reviews';
import authRouter from './routes/auth';
import { connectDB } from './db';

const app = express();
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Velora API is live', version: '1.0.0' });
});

app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  console.log('Attempting to connect to MongoDB...');
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
