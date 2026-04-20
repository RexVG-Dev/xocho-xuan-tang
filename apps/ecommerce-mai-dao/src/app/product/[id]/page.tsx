"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/app/components/ui';
import { useStore } from '@/contexts/useStore';
import { calculateDiscountedPrice } from '@/shared/utils';

import type { ProductInterface } from '@/shared/interfaces';
import { apiRequest } from '../../contexts/apiClient';


export default function ProductPage() {
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useStore();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const id = params?.id as string;
        if (!id) throw new Error('No product id');
        const res = await apiRequest(`/products/${id}`);
        setProduct(res);
      } catch (err: any) {
        setError(err?.message || 'Error fetching product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params]);

  const images = product?.images ?? [];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setNotification(`${product.name} añadido al carrito`);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleIncrease = () => setQuantity((q) => (product && q < product.stock ? q + 1 : q));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando producto...</div>;
  }
  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Producto no encontrado'}</div>;
  }

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
                  alt={product.name}
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
              {(product.categories ?? []).map((cat) => (
                <span key={cat.id} className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
                  {cat.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-gray-400 text-xs mb-2">SKU #{product.sku}</div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold text-gray-900">${calculateDiscountedPrice(product)}</span>
              {product.discount_value && product.discount_value !== '0' && (
                <span className="text-xl font-semibold text-gray-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
              {product.discount_value && product.discount_value !== '0' && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">% Oferta</span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
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
                disabled={product && quantity >= product.stock}
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
    </>
  );
}

