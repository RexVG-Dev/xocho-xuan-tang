import { useContext, useCallback } from 'react';

import { StoreContext, StoreContextType } from './store.context';

export interface UseStoreReturn extends StoreContextType {
  isItemInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  isCartEmpty: boolean;
}

export const useStore = (): UseStoreReturn => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore debe usarse dentro de un StoreProvider');
  }

  const isItemInCart = useCallback(
    (productId: string) => {
      return context.cart.some((item) => item.id === productId);
    },
    [context.cart]
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = context.cart.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [context.cart]
  );

  const isCartEmpty = context.cart.length === 0;

  return {
    ...context,
    isItemInCart,
    getItemQuantity,
    isCartEmpty,
  };
};
