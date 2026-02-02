export type DiscountType = 'percentage' | 'amount';

export type OrderStatus = 'processing' | 'packing' | 'shipped' | 'delivered' | 'cancelled';

export type CategoryType = 'category' | 'season';

export interface CategoryInterface {
  id: string;
  name: string;
  code: string;
  description?: string;
  slug: string;
  type: CategoryType;
}

export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  main_image_url: string;
  discount_value?: string;
  discount_type: DiscountType;
  active: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImageInterface[];
}

export interface ProductImageInterface {
  id: string;
  product_id: string;
  image_url: string;
  order: number;
}

export interface CartItem extends ProductInterface {
  quantity: number;
}
