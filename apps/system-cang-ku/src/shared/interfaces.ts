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