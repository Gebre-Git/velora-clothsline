import { Router } from 'express';
import { Review, ReviewStatus } from '../models/review';

const router = Router();

router.get('/', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

router.post('/', async (req, res) => {
  const { author, content, rating } = req.body;
  const r = new Review({ author, content, rating });
  await r.save();
  res.status(201).json(r);
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
