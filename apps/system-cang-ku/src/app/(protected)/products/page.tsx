'use client';

import { useState, useEffect } from 'react';

import { useLoading } from '@/app/contexts/useLoading';
import { apiFetch } from '@/app/api';
import { useDebounce } from '@/app/hooks/useDebounce';
import { CategoryInterface } from '@/shared/types/category';

import { Card } from '@/app/components/ui';
import { ProductFilters } from './_components/productFilters';
import { ProductsTable } from './_components/productsTable';
import { PaginationControls } from './_components/paginationControls';

import { ProductInterface, DiscountStatus } from './constants';

function Products() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus>('all');

  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [seasons, setSeasons] = useState<CategoryInterface[]>([]);

  const [error, setError] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoading();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  useEffect(() => {
    async function fetchFilterData() {
      try {
        // Asumimos un endpoint /catalog que devuelve todas las categorías y temporadas
        const allCategories: CategoryInterface[] = await apiFetch('/categories', { requiresAuth: false });
        setCategories(allCategories.filter(c => c.type === 'category'));
        setSeasons(allCategories.filter(c => c.type === 'season'));
      } catch (err) {
        console.error("Fallo al cargar los datos para los filtros", err);
        // Opcional: mostrar una notificación de error
      }
    }
    fetchFilterData();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      showLoader({type:'get'});
      setError(null);
      try {
        // 1. Construir la URL con los parámetros de filtro
        const params = new URLSearchParams();
        
        if (debouncedSearchTerm) params.append('searchTerm', debouncedSearchTerm);
        if (selectedCategory) params.append('categoryId', selectedCategory);
        
        // El API espera los 'codes' de las temporadas
        if (selectedSeason) params.append('categoryCodes', selectedSeason);

        if (discountStatus === 'with') params.append('hasDiscount', 'true');
        if (discountStatus === 'without') params.append('hasDiscount', 'false');

        // Paginación (por ahora fija, se implementará en Fase 3)
        params.append('skip', '0');
        params.append('take', '10');

        // 2. Llamar a la API
        const data = await apiFetch(`/products?${params.toString()}`, { requiresAuth: true });
        setProducts(data.products || []);
        // Aquí también guardaríamos los datos de paginación: setTotal(data.total), etc.
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        hideLoader();
      }
    }
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedCategory, selectedSeason, discountStatus]);

  if (error) {
    return <Card className="bg-white"><p className="text-center text-red-500 py-10">{error}</p></Card>;
  }

  return (
    <Card className="bg-white">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        discountStatus={discountStatus}
        onDiscountChange={setDiscountStatus}
      />
      <ProductsTable products={products} />
      <PaginationControls />
    </Card>
  );
}
export default Products
