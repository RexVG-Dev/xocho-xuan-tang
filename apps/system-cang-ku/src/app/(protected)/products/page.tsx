'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useLoading } from '@/app/contexts/useLoading';
import { useNotification } from '@/app/contexts/useNotification';
import { apiFetch } from '@/app/api';
import { useDebounce } from '@/app/hooks/useDebounce';
import { CategoryInterface } from '@/shared/types/category';

import { Card } from '@/app/components/ui';
import { ConfirmationModal } from '@/app/components/ui/organisms';
import { ProductFilters } from './_components/productFilters';
import { ProductsTable } from './_components/productsTable';
import { PaginationControls } from './_components/paginationControls';

import { ProductInterface, DiscountStatus } from './constants';

const PAGE_SIZE = 10;

function Products() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus>('all');

  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [seasons, setSeasons] = useState<CategoryInterface[]>([]);

  const [error, setError] = useState<string | null>(null);
  const { showLoader, hideLoader, isLoading } = useLoading();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [deletingProduct, setDeletingProduct] = useState<ProductInterface | null>(null);

  useEffect(() => {
    async function fetchFilterData() {
      try {
        const allCategories: CategoryInterface[] = await apiFetch('/categories', { requiresAuth: false });
        setCategories(allCategories.filter(c => c.type === 'category'));
        setSeasons(allCategories.filter(c => c.type === 'season'));
      } catch (err) {
        console.error("Fallo al cargar los datos para los filtros", err);
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
        if (selectedSeason) params.append('categoryId', selectedSeason);

        if (discountStatus === 'with') params.append('hasDiscount', 'true');
        if (discountStatus === 'without') params.append('hasDiscount', 'false');

        const skip = (currentPage - 1) * PAGE_SIZE;
        params.append('skip', String(skip));
        params.append('take', String(PAGE_SIZE));

        // 2. Llamar a la API
        const data = await apiFetch(`/products?${params.toString()}`, { requiresAuth: true });
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        hideLoader();
      }
    }
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedCategory, selectedSeason, discountStatus, currentPage]);

  const handleCreate = () => router.push('/products/new');
  const handleBulkLoad = () => router.push('/products/bulk-load');
  const handleEdit = (product: ProductInterface) => router.push(`/products/edit/${product.id}`);

  const handleDeleteClick = (product: ProductInterface) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    showLoader({type: 'delete'});
    try {
      await apiFetch(`/products/${deletingProduct.id}`, {
        method: 'DELETE',
        requiresAuth: true,
      });

      // Actualizar la UI eliminando el producto del estado
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      setTotalProducts(prev => prev - 1);
      showNotification({ type: 'success', message: `Producto "${deletingProduct.name}" eliminado.` });

    } catch (err) {
      console.error("Fallo al eliminar el producto", err);
      showNotification({ type: 'error' });
    } finally {
      setDeletingProduct(null);
      hideLoader();
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

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
        onCreate={handleCreate}
        onBulkLoad={handleBulkLoad}
      />
      <ProductsTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {deletingProduct && (
        <ConfirmationModal
          isOpen={!!deletingProduct}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que quieres eliminar permanentemente el producto "${deletingProduct.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingProduct(null)}
          isLoading={isLoading}
          confirmText="Eliminar"
        />
      )}
    </Card>
  );
}
export default Products
