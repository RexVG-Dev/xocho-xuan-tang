"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from './apiClient';
import type { CategoryInterface } from '@/shared/interfaces';

interface CategoryContextValue {
  categories: CategoryInterface[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/categories', { method: 'GET' });
      if (Array.isArray(res)) {
        setCategories(res);
      } else if (res && Array.isArray(res.categories)) {
        setCategories(res.categories);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
