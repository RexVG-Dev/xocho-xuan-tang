'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode
} from 'react';

import { CategoryInterface } from '@/shared/interfaces';

export interface InitialDataContextType {
  // Estado
  categories: CategoryInterface[];
  isLoadingCategories: boolean;
}

export const InitialDataContext = createContext<InitialDataContextType | undefined>(undefined);

export function InitialDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Cargar Categorías (Simulado por ahora)
  useEffect(() => {
    async function fetchCategories() {
      try {
        // TODO: Conectar con API real cuando esté disponible en el front de tienda
        const mockCategories: CategoryInterface[] = [
          { id: '1', name: 'Hogar', code: 'hogar', description: 'Artículos para el hogar', slug: 'hogar', type: 'category' },
          { id: '2', name: 'Cocina', code: 'cocina', description: 'Utensilios de cocina', slug: 'cocina', type: 'category' },
          { id: '3', name: 'Electrónica', code: 'electronica', description: 'Gadgets y tecnología', slug: 'electronica', type: 'category' },
          { id: '4', name: 'Belleza', code: 'belleza', description: 'Productos de belleza', slug: 'belleza', type: 'category' },
          { id: '5', name: 'Api Categotia', code: 'apiCstego', description: 'Categoria de api', slug: 'apicat', type: 'category' },
        ];
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error cargando categorías', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const value = {
    categories,
    isLoadingCategories,
  };

  return (
    <InitialDataContext.Provider value={value}>{children}</InitialDataContext.Provider>
  );
}
