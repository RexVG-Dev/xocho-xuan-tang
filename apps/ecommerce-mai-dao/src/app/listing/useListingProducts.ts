import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { apiRequest } from '../contexts/apiClient';
import type { ProductInterface } from '@/shared/interfaces';

export interface ListProductsInterface {
  products: ProductInterface[];
  total: number;
  next: number;
  hasMore: boolean;
}

export function useListingProducts() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [data, setData] = useState<ListProductsInterface>({ products: [], total: 0, next: 0, hasMore: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        const skip = params.skip || '0';
        const take = params.take || '20';
        params.skip = skip;
        params.take = take;
        let endpoint = '/products';
        if (params['best-sellers'] === 'true') {
          endpoint = '/products/best-sellers';
          delete params['best-sellers'];
        }
        const res = await apiRequest(endpoint, { params });
        if (res && Array.isArray(res.products)) {
          setData({
            products: res.products,
            total: res.total ?? res.products.length,
            next: res.next ?? 0,
            hasMore: res.hasMore ?? false,
          });
        } else {
          setData({ products: [], total: 0, next: 0, hasMore: false });
        }
      } catch (err: any) {
        setError(err?.message || 'Error fetching products');
        setData({ products: [], total: 0, next: 0, hasMore: false });
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams, pathname]);

  return { ...data, loading, error };
}
