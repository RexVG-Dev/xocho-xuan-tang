'use client';

import {
  createContext,
  useState,
  ReactNode
} from 'react';

export interface OrderDetailsModalContextType {
  isOpen: boolean;
  orderId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const OrderDetailsModalContext = createContext<OrderDetailsModalContextType | undefined>(undefined);

export function OrderDetailsModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setOrderId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOrderId(null);
  };

  const value = { isOpen, orderId, openModal, closeModal };

  return (
    <OrderDetailsModalContext.Provider value={value}>
      {children}
    </OrderDetailsModalContext.Provider>
  );
}