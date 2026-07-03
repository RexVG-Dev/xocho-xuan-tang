'use client';

import { useContext, createContext } from 'react';

interface OrderDetailsModalContextType {
  isOpen: boolean;
  orderId: string | null;
  closeModal: () => void;
}

const OrderDetailsModalContext = createContext<OrderDetailsModalContextType>({
  isOpen: false,
  orderId: null,
  closeModal: () => {},
});

export function useOrderDetailsModal() {
  const context = useContext(OrderDetailsModalContext);
  if (!context) {
    return {
      isOpen: false,
      orderId: null,
      closeModal: () => {},
    };
  }
  return context;
}

export { OrderDetailsModalContext };
