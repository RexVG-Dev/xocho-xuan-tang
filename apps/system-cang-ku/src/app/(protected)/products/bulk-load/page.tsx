'use client';

import { useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Icon } from '@/app/components/ui';
import { apiFetch } from '@/app/api';
import { CategoryInterface } from '@/shared/types/category';

import { bulkProductFormReducer, initialBulkState } from './bulkProductFormReducer';
import { BulkProductRow } from './bulkProductRow'

export const BulkLoad = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(bulkProductFormReducer, initialBulkState);

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


  const handleSaveAll = () => {
    // Aquí irá la lógica para enviar todas las filas a la API en el futuro
    console.log('Guardando todos los productos:', state.filter(row => row.name));
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