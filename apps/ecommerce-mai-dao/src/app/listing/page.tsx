"use client";

import { useCallback, useState } from 'react';
import { ProductInterface } from '@/shared/interfaces';
import { useStore } from '@/contexts/useStore';

import { ProductCard } from '../components/ui/molecules/productCard/ProductCard';
import { mockProducts } from './mockProducts';
import { useRouter, useSearchParams } from 'next/navigation';

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

  const products = Array.from({ length: 60 }).map((_, i) => {
    const base = mockProducts[i % mockProducts.length];
    return { ...base, id: `${base.id}-${i + 1}` };
  });

  const page = Number(getParam('page')) || 1;
  const perPage = 20;
  const totalPages = Math.ceil(products.length / perPage);
  const paginated = products.slice((page - 1) * perPage, page * perPage);

  const goToPage = useCallback((newPage: number) => {
    const search = new URLSearchParams(params?.toString() ?? '');
    search.set('page', String(newPage));
    router.push(`?${search.toString()}`);
  }, [params, router]);

  const handleAddToCart = (product: ProductInterface) => {
      addToCart(product, 1);
  
      setNotification(`${product.name} añadido al carrito`);
      setTimeout(() => setNotification(null), 2000);
    };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginated.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.main_image_url || (product.images?.[0]?.image_url) || '/assets/categories/sample.png'}
              title={product.name}
              price={Number(product.price)}
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
      </div>
    </div>
  );
}
