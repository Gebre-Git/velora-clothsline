# Velora Backend

Simple TypeScript Express backend for the Velora frontend.

Quick start

1. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and secrets.
2. From `server` folder run:

```
npm install
npm run dev
```

APIs
- `GET /api/orders` - list orders
- `POST /api/orders` - create order
- `PATCH /api/orders/:id/status` - update order status
- `GET /api/reviews` - list reviews
- `POST /api/reviews` - create review
- `PATCH /api/reviews/:id/status` - update review status
- `POST /api/auth/login` - admin login (returns JWT)
