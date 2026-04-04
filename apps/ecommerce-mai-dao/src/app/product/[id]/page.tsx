"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/app/components/ui';
import type { DiscountType } from '@/shared/interfaces';
import { useStore } from '@/contexts/useStore';

import type { ProductInterface, CategoryType } from '@/shared/interfaces';

const mockProduct: ProductInterface = {
  id: "84a44962-c5b7-4fb6-916e-0361d2c4828f",
  name: "Test bulk name",
  description: "Test bulk descrip",
  price: "60",
  sku: "Test_prod_bulk_30",
  stock: 50,
  main_image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1760735295/product_images/Test_prod_bulk_30/Test_prod_bulk_30_00.jpg",
  discount_value: "0",
  discount_type: "amount" as DiscountType,
  active: true,
  created_at: "2025-10-17T21:08:22.849Z",
  updated_at: "2025-10-17T21:08:22.849Z",
  categories: [
    { id: "832b118f-d6c3-4dca-91a7-765a39d1a01e", name: "Herramientas", description: undefined, slug: "herramientas", code: "tools", type: 'category' as CategoryType },
    { id: "97d3a82d-bffa-4eb8-9df2-ef8a3852d7bc", name: "15 de Septiembre", description: undefined, slug: "15-de-septiembre", code: "mexican-independence-day", type: 'season' as CategoryType }
  ],
  images: [
    { id: "50b10bec-d4e1-4f43-b3da-13b422bbb3dd", product_id: "84a44962-c5b7-4fb6-916e-0361d2c4828f", image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1760735295/product_images/Test_prod_bulk_30/Test_prod_bulk_30_00.jpg", order: 1 },
    { id: "ac3cc033-54a0-496e-8869-0d1ecd2f2ea2", product_id: "84a44962-c5b7-4fb6-916e-0361d2c4828f", image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1760735297/product_images/Test_prod_bulk_30/Test_prod_bulk_30_01.jpg", order: 2 },
    { id: "2ae39768-b1cb-4844-9c05-c5e40be78c24", product_id: "84a44962-c5b7-4fb6-916e-0361d2c4828f", image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1760735298/product_images/Test_prod_bulk_30/Test_prod_bulk_30_02.jpg", order: 3 },
    { id: "8aff1ee8-5878-4c71-8e4e-302881ec1a11", product_id: "84a44962-c5b7-4fb6-916e-0361d2c4828f", image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1760735299/product_images/Test_prod_bulk_30/Test_prod_bulk_30_03.jpg", order: 4 },
    { id: "28d3f5ac-ac50-48e7-84a6-cf5706a6caeb", product_id: "84a44962-c5b7-4fb6-916e-0361d2c4828f", image_url: "https://res.cloudinary.com/dphrt50s2/image/upload/v1760735300/product_images/Test_prod_bulk_30/Test_prod_bulk_30_04.jpg", order: 5 }
  ]
};

export default function ProductPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);
  const images = mockProduct.images ?? [];
  const router = useRouter();
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(mockProduct, quantity);
    setNotification(`${mockProduct.name} añadido al carrito`);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleBuyNow = () => {
    addToCart(mockProduct, quantity);
    router.push('/cart');
  };

  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleIncrease = () => setQuantity((q) => (q < mockProduct.stock ? q + 1 : q));

  return (
    <>
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      <div className="min-h-screen py-8 px-4 mt-12 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow flex flex-col md:flex-row gap-8 p-6 md:p-10">
        <div className="flex-1 flex flex-col gap-4 items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {images[activeIdx] && (
              <img
                src={images[activeIdx].image_url}
                alt={mockProduct.name}
                className="object-contain w-full h-full transition-all duration-300"
              />
            )}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white"
              onClick={() => setActiveIdx((prev) => (images.length > 0 ? (prev === 0 ? images.length - 1 : prev - 1) : 0))}
              aria-label="Anterior"
              disabled={images.length === 0}
            >
              &#8592;
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white"
              onClick={() => setActiveIdx((prev) => (images.length > 0 ? (prev === images.length - 1 ? 0 : prev + 1) : 0))}
              aria-label="Siguiente"
              disabled={images.length === 0}
            >
              &#8594;
            </button>
          </div>
          <div className="w-full flex gap-2 justify-center">
            {images.length > 0 && images.map((img, idx) => (
              <button
                key={img.id}
                className={`rounded-xl border-2 ${activeIdx === idx ? 'border-red-500' : 'border-transparent'} overflow-hidden w-20 h-20 bg-white`}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Miniatura ${idx + 1}`}
              >
                <img src={img.image_url} alt={`Miniatura ${idx + 1}`} className="object-contain w-full h-full" />
              </button>
            ))}
          </div>
        </div>

          <div className="flex-1 flex flex-col justify-start">
            <div className="flex gap-2 mb-2">
              {(mockProduct.categories ?? []).map((cat) => (
                <span key={cat.id} className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
                  {cat.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-2">{mockProduct.name}</h1>
            <div className="text-gray-400 text-xs mb-2">SKU #{mockProduct.sku}</div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold text-gray-900">${Number(mockProduct.price).toFixed(2)}</span>
              {mockProduct.discount_value && mockProduct.discount_value !== '0' && (
                <span className="text-xl font-semibold text-gray-400 line-through">
                  ${Number(Number(mockProduct.price) + Number(mockProduct.discount_value)).toFixed(2)}
                </span>
              )}
              {mockProduct.discount_value && mockProduct.discount_value !== '0' && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">% Oferta</span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{mockProduct.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <Button
              size="md"
              color="light"
              rounded="full"
              onClick={handleDecrease}
              aria-label="Disminuir cantidad"
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="text-lg font-bold min-w-[2ch] text-center">{quantity}</span>
            <Button
              size="md"
              color="light"
              rounded="full"
              onClick={handleIncrease}
              aria-label="Aumentar cantidad"
              disabled={quantity >= mockProduct.stock}
            >
              +
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              className="flex-1"
              color="danger"
              rounded="full"
              size="md"
              onClick={handleBuyNow}
            >
              Comprar ahora
            </Button>
            <Button
              className="flex-1 flex items-center justify-center gap-2"
              color="dark"
              rounded="full"
              size="md"
              onClick={handleAddToCart}
              icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 20.66 5H6.21l-.94-2A1 1 0 0 0 4.38 2H2a1 1 0 1 0 0 2h1.38l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7.16 17H19a1 1 0 1 0 0-2H7.16Z"/></svg>}
            >
              Añadir al carrito
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>);
  }

