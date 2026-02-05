import { Router } from 'express';
import { Order, OrderStatus } from '../models/order';

const router = Router();

router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.post('/', async (req, res) => {
  console.log('New Order Received:', req.body);
  const { customerName, email, address, phoneNumber, items } = req.body;
  if (!customerName || !email || !address || !phoneNumber || !items) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const o = new Order(req.body);
    await o.save();
    res.status(201).json(o);
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!Object.values(OrderStatus).includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

export default router;
