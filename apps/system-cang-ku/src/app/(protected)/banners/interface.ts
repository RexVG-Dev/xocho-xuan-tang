export interface BannerInterface {
  id: number;
  name: string;
  title?: string;
  description?: string;
  text_button?: string;
  image_url: string;
  category_id: string;
  start_date: string;
  end_date: string;
  active: boolean;
  position: number;
  category?: CategoryInterface;
  target_filters_json?: TargetFiltersInterface;
}

interface CategoryInterface {
  id: string;
  name: string;
  code: string;
  description?: string;
  slug: string;
  type: 'season' | 'category';
}

interface TargetFiltersInterface {
  category_codes: string[];
  has_discount: boolean;
}