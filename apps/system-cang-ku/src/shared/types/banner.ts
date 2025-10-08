export interface BannerInterface {
  id: number;
  name: string;
  image_url: string;
  category_id?: string;
  start_date: string;
  end_date: string;
  active: boolean;
  position: number;
  target_filters_json?: any; // tiparlo mejor si se conoce la estructura
}
