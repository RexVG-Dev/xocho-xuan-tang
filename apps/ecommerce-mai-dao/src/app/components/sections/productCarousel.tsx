'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useStore } from '@/contexts/useStore';
import { ProductInterface } from '@/shared/interfaces';

import Carousel from '../ui/organisms/carousel/carousel';
import { Button } from '../ui/atoms/button';
import { Icon } from '../ui/atoms/icon';

const PRODUCTS: ProductInterface[] = [
  { 
    id: '1', 
    name: 'Crema Hidratante Premium', 
    description: 'Crema hidratante con ingredientes naturales',
    price: '199.00', 
    sku: 'CREAM-001',
    stock: 10,
    main_image_url: 'https://picsum.photos/seed/prod1/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '2', 
    name: 'Sérum Vitamina C', 
    description: 'Sérum iluminador con vitamina C pura',
    price: '249.00',
    sku: 'SERUM-001',
    stock: 8,
    main_image_url: 'https://picsum.photos/seed/prod2/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '3', 
    name: 'Mascarilla Purificante', 
    description: 'Mascarilla detoxificante profunda',
    price: '159.00',
    sku: 'MASK-001',
    stock: 15,
    main_image_url: 'https://picsum.photos/seed/prod3/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '4', 
    name: 'Cleanser Suave', 
    description: 'Limpiador facial suave y efectivo',
    price: '129.00',
    sku: 'CLEAN-001',
    stock: 20,
    main_image_url: 'https://picsum.photos/seed/prod4/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '5', 
    name: 'Tónico Equilibrante', 
    description: 'Tónico balanceador de pH',
    price: '179.00',
    sku: 'TONIC-001',
    stock: 12,
    main_image_url: 'https://picsum.photos/seed/prod5/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '6', 
    name: 'Exfoliante Delicado', 
    description: 'Exfoliante suave para uso diario',
    price: '189.00',
    sku: 'EXFO-001',
    stock: 9,
    main_image_url: 'https://picsum.photos/seed/prod6/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '7', 
    name: 'Protector Solar SPF50', 
    description: 'Protección UV de amplio espectro',
    price: '219.00',
    sku: 'SUN-001',
    stock: 18,
    main_image_url: 'https://picsum.photos/seed/prod7/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '8', 
    name: 'Contorno de Ojos', 
    description: 'Crema especializada para el contorno de ojos',
    price: '239.00',
    sku: 'EYE-001',
    stock: 7,
    main_image_url: 'https://picsum.photos/seed/prod8/400/300',
    discount_type: 'percentage',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface ProductCarouselProps {
  title: string;
  background?: 'grey' | 'red' | null;
}

export function ProductCarousel({ title, background = null }: ProductCarouselProps) {
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
            {PRODUCTS.map((product) => (
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
                    <div className="mt-4 text-xs text-gray-400">Cuidado Personal</div>
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
            <div key="see-more" className="p-4">
              <Link href="/listing?from_carousel=novedades">
                <div className="rounded-2xl p-4 h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="rounded-lg bg-red-700 h-48 flex items-center justify-center overflow-hidden relative border-2 border-dashed border-gray-300">
                    <span className="text-lg font-semibold text-white">Ver más...</span>
                  </div>
                  <div className="mt-4 text-xs text-transparent">Cuidado Personal</div>
                  <div className="min-h-12 mt-2 text-base font-medium text-transparent">Placeholder</div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="text-2xl font-semibold text-transparent">$0.00</div>
                  </div>
                </div>
              </Link>
              <div className="mt-2 px-4 invisible">
                  <Button 
                    size="xs" 
                    color="dark" 
                    className="w-full"
                  >
                    Añadir
                  </Button>
                </div>
            </div>
          </Carousel>
        </div>
      </section>
    </>
  );
}
