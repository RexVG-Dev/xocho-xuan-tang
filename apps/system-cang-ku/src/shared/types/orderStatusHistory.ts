import { OrderStatus } from './enums';
import { UserInterface } from './user';

export interface OrderStatusHistoryInterface {
  id: number;
  order_id: string;
  status: OrderStatus;
  change_date: string;
  user_id: string;
  observations?: string;
  user?: UserInterface;
}
