import { ProductInterface } from './product';

export interface OrderDetailsInterface {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  product?: ProductInterface;
}
