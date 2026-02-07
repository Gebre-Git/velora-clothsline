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
  if (!customerName || !phoneNumber || !items) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const totalQuantity = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  if (totalQuantity < 5) {
    return res.status(400).json({ message: 'Minimum order quantity is 5.' });
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


router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log('Received Status:', status); // Debug log
  if (!Object.values(OrderStatus).includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});


export default router;
