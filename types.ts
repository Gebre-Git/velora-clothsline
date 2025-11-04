
export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
}

export interface Order {
  id: string;
  quantity: number;
  phoneNumber: string;
  color: string;
  userEmail: string; // This would typically come from an auth session
  status: OrderStatus;
  createdAt: Date;
}
