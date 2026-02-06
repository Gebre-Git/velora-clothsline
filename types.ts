export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Order {
  id: string; // Will be mapped from _id
  _id?: string;
  quantity: number;
  phoneNumber: string;
  color: string;
  userEmail: string;
  status: OrderStatus;
  items?: Array<{ color: string; quantity: number }>;
  total?: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  _id?: string;
  customerName: string; // Changed from name to match backend
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
}