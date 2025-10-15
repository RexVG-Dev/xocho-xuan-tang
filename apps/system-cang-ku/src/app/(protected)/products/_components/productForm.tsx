'use client';

import { useReducer, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/contexts/useLoading';
import { useNotification } from '@/app/contexts/useNotification';

import { apiFetch } from '@/app/api';
import { Button, Card, Icon, Input } from '@/app/components/ui';
import { CategoryInterface } from '@/shared/types/category';
import { productFormReducer, initialState } from './productFormReducer';
import { ImageUploader } from './imageUploader';
import { compressImage } from '@/utils/compressImage';


interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { showNotification } = useNotification();
  const [state, dispatch] = useReducer(productFormReducer, initialState);
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

  useEffect(() => {
    async function fetchProductData() {
      if (mode === 'edit' && productId) {
        showLoader({type: 'get'});
        try {
          const productData = await apiFetch(`/products/${productId}`, { requiresAuth: true });
          dispatch({ type: 'LOAD_PRODUCT', product: productData });
        } catch (err) {
          console.error("Fallo al cargar el producto", err);
          showNotification({ type: 'error', message: 'No se pudo cargar la información del producto.' });
          router.push('/products');
        } finally {
          hideLoader();
        }
      }
    }
    if (mode === 'edit' && productId) {
      fetchProductData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader({type: 'changes'});

    try {
      if ( mode === 'create' ) {
        const formData = new FormData();

        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('sku', state.sku);
        formData.append('stock', String(state.stock));
        formData.append('price', String(state.price));

        const allCategoryIds = [...state.categoryIds, state.seasonCode].filter(Boolean);
        allCategoryIds.forEach(id => formData.append('category_ids', id));

        if (state.discountType) {
          formData.append('discount_type', state.discountType);
          formData.append('discount_value', String(state.discountValue));
        }

         const mainImage = state.images.find(img => img.isMain && img.file);
        if (mainImage) {
          const compressedMain = await compressImage(mainImage.file as File);
          formData.append('main_image', compressedMain);
        }
        const restImages = state.images.filter(img => !img.isMain && img.file);
        if (restImages.length > 0) {
          const compressionPromises = restImages.map(img => compressImage(img.file as File));
          const compressedRest = await Promise.all(compressionPromises);
          compressedRest.forEach(file => {
            formData.append('rest_images', file);
          });
        }

        await apiFetch('/products', {
          method: 'POST',
          body: formData,
          isFormData: true,
          requiresAuth: true,
        });
      } else {

        // 1. Separar archivos nuevos de URLs existentes que se conservan
        const newImageFilesData = state.images
          .map((img, index) => ({ file: img.file, index }))
          .filter(item => item.file instanceof File);
        
        let uploadedUrls: string[] = [];

        // 2. Subir solo los archivos nuevos si existen
        if (newImageFilesData.length > 0) {
          const imageFormData = new FormData();
          newImageFilesData.forEach(item => {
            imageFormData.append('images', item.file as File);
          });

          const compressionPromises = newImageFilesData.map(item => compressImage(item.file as File));
          const compressedFiles = await Promise.all(compressionPromises);

          compressedFiles.forEach(file => {
            imageFormData.append('images', file);
          });

          imageFormData.append('sku', state.sku);

          const uploadResponse = await apiFetch('/upload/product-images', {
            method: 'POST',
            body: imageFormData,
            isFormData: true,
            requiresAuth: true,
          });
          uploadedUrls = uploadResponse.urls;
        }

        // 3. Reconstruir el estado final de las imágenes con las nuevas URLs
        const finalImagesState = [...state.images];
        let newUrlIndex = 0;
        newImageFilesData.forEach(item => {
          if (finalImagesState[item.index]) {
            finalImagesState[item.index].url = uploadedUrls[newUrlIndex++];
          }
        });

        // 4. Determinar la URL principal y las secundarias a partir del estado final
        const mainImage = finalImagesState.find(img => img.isMain && img.url);
        const mainImageUrl = mainImage?.url || '';
        const otherImageUrls = finalImagesState
          .filter(img => img.url && !img.isMain)
          .map(img => img.url);

        // 5. Construir el cuerpo JSON final para la petición de producto
        const productPayload = {
          name: state.name,
          description: state.description,
          sku: state.sku,
          stock: String(state.stock),
          price: String(state.price),
          category_ids: [...state.categoryIds, state.seasonCode].filter(Boolean),
          discount_type: state.discountType,
          discount_value: String(state.discountValue),
          main_image_url: mainImageUrl,
          other_image_urls: otherImageUrls,
        };

        // 6. Enviar la petición PUT con el cuerpo JSON
        await apiFetch(`/products/${productId}`, {
          method: 'PUT',
          body: productPayload,
          isFormData: false, // Ahora es JSON
          requiresAuth: true,
        });
      }
      showNotification({ 
          type: 'success', 
          message: `Producto ${mode === 'edit' ? 'actualizado' : 'creado'} exitosamente.` 
        });

        router.push('/products');
        router.refresh();
    } catch (err: any) {
      console.error(`Fallo al ${mode === 'create' ? 'crear' : 'actualizar'} el producto:`, err);
      showNotification({ type: 'error', message: err.message || 'Ocurrió un error.' });
    } finally {
      hideLoader();
    }
  };

  const handleGoBack = () => {
    router.push('/products');
  };

  const handleDiscountChange = (value: 'percentage' | 'amount') => {
    if (state.discountType === value) {
      dispatch({ type: 'SET_FIELD', field: 'discountType', value: null });
    } else {
      // Si no, seleccionamos el nuevo valor.
      dispatch({ type: 'SET_FIELD', field: 'discountType', value });
    }
  };

  return (
    <Card className="bg-white p-6 shadow-md max-w-fit mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          color="dark"
          onClick={handleGoBack}
          className="mb-4"
          icon={<Icon name="arrowleft"  size={22}/>}
        >
          Atrás
        </Button>
         <h3 className="text-2xl font-bold mb-6">
          {mode === 'create' ? 'Crear nuevo producto' : 'Editar producto'}
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            <Input
              label="Nombre"
              placeholder="Inserta nombre de producto"
              value={state.name}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
            />
            <Input
              label="Descripción"
              placeholder="Inserta una descripción del producto"
              variantSize="full"
              value={state.description}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={state.categoryIds.includes(cat.id)}
                      onChange={() => dispatch({ type: 'TOGGLE_CATEGORY', id: cat.id })}
                    />
                    <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
               <Input
                label="Stock"
                variantSize="sm"
                type="number"
                placeholder="0"
                value={state.stock}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'stock', value: e.target.value })}
              />
               <Input
                label="SKU"
                placeholder="Insertar SKU"
                variantSize="sm"
                value={state.sku}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'sku', value: e.target.value })}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporada</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={state.seasonCode}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'seasonCode', value: e.target.value })}
              >
                <option value="">Seleccionar</option>
                {seasons.map(sea => <option key={sea.id} value={sea.id}>{sea.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descuento</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="discountType"
                    value="percentage"
                    checked={state.discountType === 'percentage'}
                    onClick={() => handleDiscountChange('percentage')}
                    readOnly
                  />
                  <span className="ml-2">Por porcentaje</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="discountType"
                    value="amount"
                    checked={state.discountType === 'amount'}
                    onClick={() => handleDiscountChange('amount')}
                    readOnly
                  />
                  <span className="ml-2">Por monto</span>
                </label>
              </div>
            </div>

            <Input
              label={state.discountType === 'percentage' ? 'Insertar Porcentaje' : 'Insertar Monto'}
              type="number"
              placeholder="0.00"
              disabled={!state.discountType}
              value={state.discountValue}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'discountValue', value: e.target.value })}
            />

            <Input
              label="Precio Unitario"
              type="number"
              placeholder="0.00"
              value={state.price}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'price', value: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
            <div className="h-auto p-4 bg-gray-100 rounded-md flex items-center justify-center">
              <ImageUploader images={state.images} dispatch={dispatch} />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" color="danger">
            {mode === 'create' ? 'Publicar producto' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
