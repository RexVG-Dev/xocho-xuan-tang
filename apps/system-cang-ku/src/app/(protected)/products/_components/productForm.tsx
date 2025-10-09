'use client';

import { useReducer, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { apiFetch } from '@/app/api';
import { Card, Icon, Input, Button } from '@/app/components/ui';
import { CategoryInterface } from '@/shared/types/category';
import { productFormReducer, initialState } from './productFormReducer';
import { ImageUploader } from './imageUploader';


interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
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
    if (mode === 'edit' && productId) {
      // Lógica para cargar los datos del producto en modo edición
      console.log('Fetching product with ID:', productId);
      // const productData = await apiFetch(`/products/${productId}`);
      // dispatch({ type: 'LOAD_PRODUCT', product: productData });
    }
  }, [mode, productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form state submitted:', state);
    // Aquí irá la lógica de subida de imágenes y envío a la API
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
    <Card className="bg-white p-6 shadow-md max-w-[1600px] mx-auto space-y-6">
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
                {seasons.map(sea => <option key={sea.id} value={sea.code}>{sea.name}</option>)}
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