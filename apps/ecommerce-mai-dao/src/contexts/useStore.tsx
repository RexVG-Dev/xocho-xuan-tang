import { useContext } from 'react';

import { StoreContext, StoreContextType } from './store.context';

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore debe usarse dentro de un StoreProvider');
  }
  return context;
};
