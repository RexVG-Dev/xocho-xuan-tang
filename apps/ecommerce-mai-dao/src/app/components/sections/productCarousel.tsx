'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useStore } from '@/contexts/useStore';
import { ProductInterface } from '@/shared/interfaces';

import Carousel from '../ui/organisms/carousel/carousel';
import { Button } from '../ui/atoms/button';
import { Icon } from '../ui/atoms/icon';

interface ProductCarouselProps {
  title: string;
  background?: 'grey' | 'red' | null;
  products: ListProductsInterface;
}

interface ListProductsInterface {
  products: ProductInterface[];
  total: number;
  next: number;
  hasMore: boolean;
}

export function ProductCarousel({ title, background = null, products }: ProductCarouselProps) {
  const { addToCart } = useStore();
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddToCart = (product: ProductInterface) => {
    addToCart(product, 1);
    setNotification(`${product.name} añadido al carrito`);
    setTimeout(() => setNotification(null), 2000);
  };

  const getBackgroundClass = () => {
    switch (background) {
      case 'grey':
        return 'bg-gray-100';
      case 'red':
        return 'bg-red-700';
      default:
        return '';
    }
  };

  return (
    <>
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <section className={`mt-12 rounded-3xl py-12 ${getBackgroundClass()}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-8">{title}</h2>
          <Carousel variant="productList" slidesPerView={4} showArrows={true} showDots={true} className="py-6">
            {(products?.products ?? []).map((product) => (
              <div key={product.id} className="p-4">
                <Link href={`/product/${product.id}`}>
                  <div className="rounded-2xl p-4 h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="rounded-lg bg-white h-48 flex items-center justify-center overflow-hidden relative">
                      <Image 
                        src={product.main_image_url} 
                        alt={product.name} 
                        fill
                        className="object-contain" 
                      />
                    </div>
                    <div className="mt-4 text-xs text-gray-400">{product.categories?.[0]?.name || 'Sin categoría'}</div>
                    <div className="min-h-12 mt-2 text-base font-medium text-gray-900">{product.name}</div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="text-2xl font-semibold">${parseFloat(product.price).toFixed(2)}</div>
                    </div>
                  </div>
                </Link>
                <div className="mt-2 px-4">
                  <Button 
                    size="xs" 
                    color="dark" 
                    icon={<Icon name="card_white" size={16} />}
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                  >
                    Añadir
                  </Button>
                </div>
              </div>
            ))}
            {products.hasMore && (
              <div key="see-more" className="p-4">
                <Link href="/listing?from_carousel=novedades">
                  <div className="rounded-2xl p-4 h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="rounded-lg bg-red-700 h-48 flex items-center justify-center overflow-hidden relative border-2 border-dashed border-gray-300">
                      <span className="text-lg font-semibold text-white">Ver más...</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </Carousel>
        </div>
      </section>
    </>
  );
}
