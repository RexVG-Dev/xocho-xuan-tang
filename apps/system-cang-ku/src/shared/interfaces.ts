export const kindDicsount = {
  percentage: 'percentage',
  amount: 'amount'
} as const;
export type KindDiscount = keyof typeof kindDicsount;

export const orderStatus = {
  packing: 'packing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled'
} as const;
export type OrderStatus = keyof typeof orderStatus;

export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  main_image_url: string;
  discount_value?: string;
  discount_type?: KindDiscount | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailInterface {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  product: ProductInterface;
}

export interface OrderStatusHistoryInterface {
  id: string;
  order_id: string;
  status: OrderStatus;
  change_date: string;
  user_id: string;
  observations: string;
  user: {
    name: string;
    role: string;
    register_date: string;
    active: boolean;
  };
}

export interface OrderDetailsInterface {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_date: string;
  total: string;
  status: OrderStatus;
  shipping_address: string;
  payment_method: string;
  tracking_number: string;
  orderDetails: OrderDetailInterface[];
  orderStatusHistory: OrderStatusHistoryInterface[];
  shipping_instructions?: string | null;
}

export interface OrderInterface {
  id: string;
  total: number;
  status: OrderStatus;
  tracking_number: string;
  order_date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  stock: number;
  price: number;
  discount_type: 'percentage' | 'amount' | null;
  discount_value: number | null;
  category_ids: string[];
  main_image_url: string;
  other_image_urls: string[];
}
