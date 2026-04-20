"use client";

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProductInterface } from '@/shared/interfaces';
import { calculateDiscountedPrice} from '@/shared/utils';
import { useStore } from '@/contexts/useStore';

import { ProductCard } from '../components/ui/molecules/productCard/ProductCard';
import { useListingProducts } from './useListingProducts';

export default function ListingPage() {
  const { addToCart } = useStore();
  const router = useRouter();
  const params = useSearchParams();

  const getParam = (key: string) => {
    const value = params?.get(key);
    return value ?? undefined;
  };
  const [notification, setNotification] = useState<string | null>(null);
  const query = getParam('searchTerm');
  const category = getParam('category');


  const skip = Number(getParam('skip')) || 0;
  const take = Number(getParam('take')) || 20;

  const { products, total, loading, error } = useListingProducts();
  const page = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(total / take);


  const goToPage = useCallback((newPage: number) => {
    const search = new URLSearchParams(params?.toString() ?? '');
    search.set('skip', String((newPage - 1) * take));
    search.set('take', String(take));
    router.push(`?${search.toString()}`);
  }, [params, router, take]);

  const handleAddToCart = (product: ProductInterface) => {
      addToCart(product, 1);
  
      setNotification(`${product.name} añadido al carrito`);
      setTimeout(() => setNotification(null), 2000);
    };

  return (
    <div className="min-h-screen py-8 px-4 mt-12 bg-gray-50">
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Listado de productos</h1>
        <p className="text-gray-600 mb-6">
          • Categoría: <strong>{category ?? '—'}</strong> • Búsqueda: <strong>{query ?? '—'}</strong>
        </p>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando productos...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.main_image_url || (product.images?.[0]?.image_url) || '/assets/categories/sample.png'}
                  title={product.name}
                  price={Number(calculateDiscountedPrice(product))}
                  discount={product.discount_type}
                  onAdd={() => {
                    handleAddToCart(product);
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-10">
              <button
                className="text-red-400 hover:text-black px-2 py-1 rounded disabled:opacity-50"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              >
                &larr; Anterior
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-8 h-8 rounded ${page === idx + 1 ? 'bg-black text-white' : 'bg-white text-black'} font-bold`}
                    onClick={() => goToPage(idx + 1)}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
              <button
                className="text-red-400 hover:text-black px-2 py-1 rounded disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Siguiente &rarr;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
