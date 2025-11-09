export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Order {
  id: string;
  quantity: number;
  phoneNumber: string;
  color: string;
  userEmail: string;
  status: OrderStatus;
  createdAt: Date;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
}