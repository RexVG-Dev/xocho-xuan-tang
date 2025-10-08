import { CategoryType } from './enums';
import { BannerInterface } from './banner';
import { ProductOnCategoryInterface } from './product';

export interface CategoryInterface {
  id: string;
  name: string;
  code: string;
  description?: string;
  slug: string;
  type: CategoryType;
  products?: ProductOnCategoryInterface[];
  banners?: BannerInterface[];
}

export interface CategorySimple {
  id: string;
  name: string;
  code: string;
  slug: string;
  type: CategoryType;
}