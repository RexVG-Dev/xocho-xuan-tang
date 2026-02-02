import { useContext } from 'react';

import { InitialDataContext, InitialDataContextType } from './initialData.context';

export const useInitialData = (): InitialDataContextType => {
  const context = useContext(InitialDataContext);
  if (context === undefined) {
    throw new Error('useInitialData debe usarse dentro de un StoreProvider');
  }
  return context;
};
