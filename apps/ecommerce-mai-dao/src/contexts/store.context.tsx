'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { ProductInterface, CartItem } from '@/shared/interfaces';

// 1. Definición del tipo del Contexto
export interface StoreContextType {
  // Estado
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  
  // Acciones
  addToCart: (product: ProductInterface, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// 2. Creación del Contexto
export const StoreContext = createContext<StoreContextType | undefined>(undefined);

// 3. Provider
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar carrito inicial
  useEffect(() => {
    const savedCart = localStorage.getItem('xocho_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error al leer el carrito', e);
      }
    }
  }, []);

  // Persistir carrito
  useEffect(() => {
    localStorage.setItem('xocho_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Implementación de Acciones ---

  const addToCart = (product: ProductInterface, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // --- Cálculos ---
  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // --- Objeto Value ---
  const value = {
    cart,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
