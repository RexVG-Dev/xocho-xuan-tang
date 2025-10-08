'use client';

import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card, Icon, Input, Button } from '@/app/components/ui';
import { productFormReducer, initialState } from './productFormReducer';
import { apiFetch } from '@/app/api';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(productFormReducer, initialState);

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

  return (
    <Card className='bg-white p-6 shadow-md'>
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
       
        
        {/* Aquí iremos agregando todos los campos del formulario en la Fase 2 */}
        
        <pre className="mt-4 bg-gray-100 p-4 rounded-md text-xs">
          {JSON.stringify(state, null, 2)}
        </pre>

        <div className="flex justify-end mt-6">
          <Button type="submit" color="danger">
            {mode === 'create' ? 'Publicar producto' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Card>
  );
}