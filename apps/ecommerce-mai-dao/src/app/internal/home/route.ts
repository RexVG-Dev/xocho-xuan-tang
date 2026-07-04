import { ProductInterface } from '@/shared/interfaces';

interface Banner {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  text_button?: string;
  category_id?: string;
  target_filters_json?: Record<string, unknown>;
}

interface ListProductsInterface {
  products: ProductInterface[];
  total: number;
  next: number;
  hasMore: boolean;
}

interface HomeDataResponse {
  banners: Banner[];
  newProducts: ListProductsInterface;
  offers: ListProductsInterface;
  bestSellers: ListProductsInterface;
}

const EMPTY_PRODUCTS: ListProductsInterface = {
  products: [],
  total: 0,
  next: 0,
  hasMore: false,
};

function getApiBaseUrl(): string {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

async function fetchExternal<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const baseUrl = getApiBaseUrl();
  let fullUrl = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  if (params) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    fullUrl += `?${query}`;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status} for ${path}`);
  }

  return response.json() as Promise<T>;
}

function normalizeProducts(data: unknown): ListProductsInterface {
  if (!data || typeof data !== 'object') return EMPTY_PRODUCTS;
  const res = data as Partial<ListProductsInterface> & { products?: ProductInterface[] };

  if (!Array.isArray(res.products)) return EMPTY_PRODUCTS;

  return {
    products: res.products,
    total: res.total ?? res.products.length,
    next: res.next ?? 0,
    hasMore: res.hasMore ?? false,
  };
}

export async function GET() {
  const [bannersResult, newProductsResult, offersResult, bestSellersResult] = await Promise.allSettled([
    fetchExternal<Banner[]>('/banners-active'),
    fetchExternal('/products', { skip: 0, take: 10 }),
    fetchExternal('/products', { hasDiscount: 'true', skip: 0, take: 10 }),
    fetchExternal('/products/best-sellers', { skip: 0, take: 10 }),
  ]);

  const payload: HomeDataResponse = {
    banners: bannersResult.status === 'fulfilled' && Array.isArray(bannersResult.value) ? bannersResult.value : [],
    newProducts: newProductsResult.status === 'fulfilled' ? normalizeProducts(newProductsResult.value) : EMPTY_PRODUCTS,
    offers: offersResult.status === 'fulfilled' ? normalizeProducts(offersResult.value) : EMPTY_PRODUCTS,
    bestSellers: bestSellersResult.status === 'fulfilled' ? normalizeProducts(bestSellersResult.value) : EMPTY_PRODUCTS,
  };

  return Response.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
