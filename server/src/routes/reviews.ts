import { Router } from 'express';
import { Review, ReviewStatus } from '../models/review';

const router = Router();

router.get('/', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

router.post('/', async (req, res) => {
  const { customerName, comment, rating } = req.body;
  if (!customerName || !comment || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const r = new Review({ customerName, comment, rating });
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ message: 'Failed to save review' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!Object.values(ReviewStatus).includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json(review);
});

export default router;
