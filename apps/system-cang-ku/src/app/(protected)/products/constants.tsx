export interface ProductInterface {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: string;
  main_image_url: string;
  categories: { name: string }[];
}

export type DiscountStatus = 'all' | 'with' | 'without';
