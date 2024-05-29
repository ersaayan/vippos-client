import { OrderDetailResponse } from './order-detail-response';

export interface OrderResponse {
  id: string;
  orderCost: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderDetails: OrderDetailResponse[];
}
