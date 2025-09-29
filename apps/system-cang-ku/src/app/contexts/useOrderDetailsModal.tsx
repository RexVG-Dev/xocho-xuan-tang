import {
  useContext
} from 'react';

import { OrderDetailsModalContext, OrderDetailsModalContextType } from './OrderDetailsModalContext';

export function useOrderDetailsModal(): OrderDetailsModalContextType {
  const context = useContext(OrderDetailsModalContext);
  if (context === undefined) {
    throw new Error('useOrderDetailsModal must be used within an OrderDetailsModalProvider');
  }
  return context;
}