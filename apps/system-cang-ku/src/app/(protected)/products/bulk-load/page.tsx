'use client';

import { useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Icon } from '@/app/components/ui';
import { apiFetch } from '@/app/api';
import { useLoading } from '@/app/contexts/useLoading';
import { useNotification } from '@/app/contexts/useNotification';
import { CategoryInterface } from '@/shared/types/category';
import { compressImage } from '@/utils/compressImage';

import { bulkProductFormReducer, initialBulkState } from './bulkProductFormReducer';
import { BulkProductRow } from './bulkProductRow'

export const BulkLoad = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(bulkProductFormReducer, initialBulkState);
  const { showLoader, hideLoader } = useLoading();
  const { showNotification } = useNotification();

  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [seasons, setSeasons] = useState<CategoryInterface[]>([]);

  useEffect(() => {
    async function fetchFilterData() {
      try {
        const allCategories: CategoryInterface[] = await apiFetch('/categories', { requiresAuth: true });
        setCategories(allCategories.filter(c => c.type === 'category'));
        setSeasons(allCategories.filter(c => c.type === 'season'));
      } catch (err) {
        console.error("Fallo al cargar los datos para los filtros", err);
      }
    }
    fetchFilterData();
  }, []);

  const handleGoBack = () => {
    router.push('/products');
  };


  const handleSaveAll = async () => {
    const validRows = state.filter(row => row.sku && row.name && row.price && row.images && row.stock && (row.categoryIds || row.seasonCode));
    if (validRows.length === 0) {
      showNotification({ type: 'error', message: 'No hay productos válidos para guardar.' });
      return;
    }

    /**
     * TODO: Add validation to showloader doesn't exit when users click out of containter
     */
    showLoader({
      type:'custom',
      customMessage:  `Guardando ${validRows.length} productos...`,
    });

    const results = { successful: 0, failed: 0, details: [] as any[] };

    for (let i = 0; i < validRows.length; i++) {
      hideLoader();
      const row = validRows[i];
      showLoader({
        type: 'custom',
        customMessage: `Guardando producto ${i + 1} de ${validRows.length}: ${row.name}`
      });
      
      try {
        const formData = new FormData();
        formData.append('name', row.name);
        formData.append('description', row.description);
        formData.append('sku', row.sku);
        formData.append('stock', String(row.stock));
        formData.append('price', String(row.price));
        
        const allCategoryIds = [...row.categoryIds, row.seasonCode].filter(Boolean);
        allCategoryIds.forEach(id => formData.append('category_ids', id));

        if (row.discountType) {
          formData.append('discount_type', row.discountType);
          formData.append('discount_value', String(row.discountValue));
        }

        const mainImage = row.images.find(img => img.isMain && img.file);
        if (mainImage) {
          const compressedMain = await compressImage(mainImage.file as File);
          formData.append('main_image', compressedMain);
        }
        
        const restImages = row.images.filter(img => !img.isMain && img.file);
        if (restImages.length > 0) {
          const compressionPromises = restImages.map(img => compressImage(img.file as File));
          const compressedRest = await Promise.all(compressionPromises);
          compressedRest.forEach(file => formData.append('rest_images', file));
        }
        
        // Enviamos una petición por cada producto
        await apiFetch('/products', {
          method: 'POST',
          body: formData,
          isFormData: true,
          requiresAuth: true,
        });

        results.successful++;
        results.details.push({ status: 'success', sku: row.sku, name: row.name });

      } catch (err: any) {
        console.error(`Fallo al guardar el producto con SKU ${row.sku}:`, err);
        results.failed++;
        results.details.push({ status: 'error', sku: row.sku, name: row.name, message: err.message });
      }
    }

    hideLoader();

    // Notificación final con el resumen
    showNotification({
      type: results.failed > 0 ? 'error' : 'success',
      message: `Carga completada: ${results.successful} exitosos, ${results.failed} fallidos.`,
    });

    // Solo redirigir si todo fue exitoso
    if (results.failed === 0) {
      router.push('/products');
      router.refresh();
    }

  };
  return (
    <Card className="bg-white">
      <div className="overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              color="dark"
              onClick={handleGoBack}
              icon={<Icon name="arrowleft" size={22} />}
            >
              Atrás
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Carga masiva de productos</h1>
          </div>
          <Button color="danger" onClick={handleSaveAll}>
            Guardar Todo
          </Button>
        </div>
          {/* Lista de filas de productos */}
        <div className="space-y-4">
          {state.map((rowData, index) => (
            <BulkProductRow
              key={index}
              rowIndex={index}
              rowData={rowData}
              dispatch={dispatch}
              categories={categories}
              seasons={seasons}
            />
          ))}
        </div>
      </div>
      

      
    </Card>
  )
}
export default BulkLoad