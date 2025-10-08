import { DiscountType } from './enums';
import { ProductImageInterface } from './productImage';

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

export interface ProductOnCategoryInterface {
  product_id: string;
  category_id: string;
  product?: ProductInterface;
}
