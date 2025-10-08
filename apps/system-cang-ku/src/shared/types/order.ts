import { OrderStatus } from './enums';
import { OrderDetailsInterface } from './orderDetails';
import { OrderStatusHistoryInterface } from './orderStatusHistory';

export interface OrderInterface {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_date: string;
  total: string;
  status: OrderStatus;
  shipping_address: string;
  payment_method: string;
  tracking_number?: string;
  orderDetails?: OrderDetailsInterface[];
  orderStatusHistory?: OrderStatusHistoryInterface[];
}