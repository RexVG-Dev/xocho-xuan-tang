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

/**
 * TODO Implement and fix a solution to send all data in only one petition
 * Petiton takes more time
 */
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

    showLoader({
      type:'custom',
      customMessage: 'Procesando carga masiva...'
    });

    try {
      const validRows = state.filter(row => row.sku && row.name);
      if (validRows.length === 0) {
        showNotification({ type: 'error', message: 'No hay productos válidos para guardar.' });
        hideLoader();
        return;
      }

      const formData = new FormData();
      const productsAsJson: any[] = [];

      // Procesar cada fila válida para separar texto de archivos
      for (const row of validRows) {
        // 1. Añadir datos de texto al array JSON
        productsAsJson.push({
          name: row.name,
          description: row.description,
          price: row.price,
          sku: row.sku,
          stock: row.stock,
          category_ids: [...row.categoryIds, row.seasonCode].filter(Boolean),
        });

        if (row.discountType) {
        (productsAsJson as any).discount_type = row.discountType;
        (productsAsJson as any).discount_value = row.discountValue;
      }

        // 2. Comprimir y añadir archivos de imagen al FormData con el nombre correcto
        const mainImage = row.images.find(img => img.isMain && img.file);
        if (mainImage) {
          const compressedFile = await compressImage(mainImage.file as File);
          formData.append(`main_image_${row.sku}`, compressedFile);
        }

        const restImages = row.images.filter(img => !img.isMain && img.file);
        const compressionPromises = restImages.map(img => compressImage(img.file as File));
        const compressedFiles = await Promise.all(compressionPromises);
        compressedFiles.forEach((file, index) => {
          formData.append(`rest_images_${row.sku}_${index}`, file);
        });
      }

      // 3. Añadir el array de texto como un string JSON al FormData
      formData.append('products', JSON.stringify(productsAsJson));

      // 4. Enviar la petición a la API
      const response = await apiFetch('/products-bulk', {
        method: 'POST',
        body: formData,
        isFormData: true,
        requiresAuth: true,
      });

      // 5. Mostrar notificación de resumen
      showNotification({
        type: response.summary.failed > 0 ? 'error' : 'success',
        message: `Carga completada: ${response.summary.successful} exitosos, ${response.summary.failed} fallidos.`,
      });
      
      // Opcional: recargar la página de productos
      router.push('/products');
      router.refresh();

    } catch (err: any) {
      console.error('Error en la carga masiva:', err);
      showNotification({ type: 'error', message: err.message || 'Ocurrió un error inesperado.' });
    } finally {
      hideLoader();
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
export default BulkLoad;
