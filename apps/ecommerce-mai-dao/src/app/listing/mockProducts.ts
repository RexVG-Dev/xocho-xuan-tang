import type { DiscountType } from '@/shared/interfaces';

export const mockProducts: Array<{
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  main_image_url: string;
  discount_value: string;
  discount_type: DiscountType;
  active: boolean;
  created_at: string;
  updated_at: string;
  categories?: any[];
  images?: any[];
}> = [
  {
    id: "46db343f-bc12-4e67-a94e-a4c7daefb8b6",
    name: "bdg",
    description: "dadsa",
    price: "300",
    sku: "ssdea",
    stock: 23,
    main_image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1764525919/product_images/ssdea/ssdea_00.jpg",
    discount_value: "0",
    discount_type: "amount",
    active: true,
    created_at: "2025-11-30T18:05:20.775Z",
    updated_at: "2025-11-30T18:05:20.775Z",
    categories: [
      {
        id: "004bd2a4-bc6e-4b3c-96ce-85a6f027c813",
        name: "Accesorios de Telefonía",
        description: null,
        slug: "accesorios-de-telefonia",
        code: "phone-accessories",
        type: "category"
      },
      {
        id: "5883c3e9-7063-4882-9946-2b83cb5cf4b2",
        name: "Día de la Madre",
        description: null,
        slug: "dia-de-la-madre",
        code: "mothers-day",
        type: "season"
      }
    ],
    images: [
      {
        id: "79d46d4c-7389-4b45-ab07-1755c03f014f",
        product_id: "46db343f-bc12-4e67-a94e-a4c7daefb8b6",
        image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1764525919/product_images/ssdea/ssdea_00.jpg",
        order: 1
      }
    ]
  },
];
