'use client';

import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from 'react';

import { ProductInterface, CartItem } from '@/shared/interfaces';

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: ProductInterface; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };
export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export interface StoreContextType {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  loading: boolean;
  error: string | null;

  addToCart: (product: ProductInterface, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  dispatch: Dispatch<CartAction>;
}

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      
      return {
        ...state,
        items: existing
          ? state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...state.items, { ...product, quantity }],
        error: null,
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        error: null,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== productId),
          error: null,
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
        error: null,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        error: null,
      };
    }

    case 'LOAD_CART': {
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    }

    default:
      return state;
  }
};

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('xocho_cart');
    try {
      const cart = savedCart ? JSON.parse(savedCart) : [];
      dispatch({ type: 'LOAD_CART', payload: cart });
    } catch (e) {
      console.error('Error al leer el carrito', e);
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('xocho_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: ProductInterface, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartTotal = state.items.reduce((total, item) => {
    const price = parseFloat(item.price);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const cartCount = state.items.reduce((count, item) => count + item.quantity, 0);

  const value: StoreContextType = {
    cart: state.items,
    cartTotal,
    cartCount,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    dispatch,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
