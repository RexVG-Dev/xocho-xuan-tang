'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { Card, Button, Icon } from "@/app/components/ui";
import { apiFetch } from '@/app/api';
import { LowProductsStockSkeleton } from './lowProductsStockSkeleton';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  main_image_url: string;
}

interface ApiResponse {
  products: Product[];
  next: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 5;

export function LowProductsStock() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const endpoint = `/low-stock-products?skip=${skip}&take=${PAGE_SIZE}`;
        const responseData = await apiFetch(endpoint, { requiresAuth: true });
        setData(responseData);
      } catch (err) {
        setError('No se pudo cargar la lista de productos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [skip]);

  const handleNextPage = () => {
    if (data?.hasMore && data.next !== null) {
      setSkip(data.next);
    }
  };

  const handlePreviousPage = () => {
    const newSkip = Math.max(0, skip - PAGE_SIZE);
    setSkip(newSkip);
  };

  if (isLoading) {
    return <LowProductsStockSkeleton />;
  }

  if (error || !data) {
    return (
      <Card title="Productos con bajo stock">
        <p className="text-red-500">{error || 'No hay datos disponibles.'}</p>
      </Card>
    );
  }

  return (
    <Card title="Productos con bajo stock" className="bg-white">
      {data.products.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay productos con bajo stock.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {data.products.map((product) => (
            <li key={product.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                { product.main_image_url ? (
                  <Image
                    src={product.main_image_url}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-sm object-cover bg-gray-100"
                  />
                ): <div className="rounded-sm w-10 h-10 bg-gray-100"/>}
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">#{product.sku}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-red-600">{product.stock}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={handlePreviousPage}
          disabled={skip === 0}
          size="sm"
          variant="ghost"
          icon={
            <Icon name="arrowleft"/>
          }
          color="none"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!data.hasMore}
          size="sm"
          variant="ghost"
          icon={
            <Icon name="arrowright"/>
          }
          iconButtonPosition="right"
          color="none"
        >
          Siguiente
        </Button>
      </div>
    </Card>
    
  )
}

export default LowProductsStock
