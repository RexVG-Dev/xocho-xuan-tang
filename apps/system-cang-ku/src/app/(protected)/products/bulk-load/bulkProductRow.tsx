'use client';

import { Input, Accordion } from '@/app/components/ui';
import { CategoryInterface } from '@/shared/types/category';
import { ProductFormState } from '../_components/productFormReducer';
import { ImageUploader } from '../_components/imageUploader';

interface BulkProductRowProps {
  rowData: ProductFormState;
  rowIndex: number;
  dispatch: React.Dispatch<any>;
  categories: CategoryInterface[];
  seasons: CategoryInterface[];
}

export function BulkProductRow({ rowData, rowIndex, dispatch, categories, seasons }: BulkProductRowProps) {
  // Función para despachar cambios de un campo específico
  const handleFieldChange = (field: keyof ProductFormState, value: any) => {
    dispatch({ type: 'UPDATE_ROW_FIELD', rowIndex, field, value });
  };
  
  // Función para despachar cambios en las categorías
  const handleCategoryToggle = (categoryId: string) => {
    dispatch({ type: 'TOGGLE_ROW_CATEGORY', rowIndex, categoryId });
  };

  const imageUploaderDispatch = (action: any) => {
    switch(action.type) {
      case 'SET_IMAGES':
        dispatch({ type: 'SET_ROW_IMAGES', rowIndex, images: action.images });
        break;
      case 'SET_MAIN_IMAGE':
        dispatch({ type: 'SET_ROW_MAIN_IMAGE', rowIndex, imageIndex: action.index });
        break;
      case 'REMOVE_IMAGE':
        dispatch({ type: 'REMOVE_ROW_IMAGE', rowIndex, imageIndex: action.index });
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="SKU"
          variantSize="sm"
          value={rowData.sku}
          onChange={(e) => handleFieldChange('sku', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Nombre"
          variantSize="sm"
          value={rowData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Descripción"
          variantSize="sm"
          value={rowData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Precio"
          variantSize="sm"
          type="number"
          value={rowData.price}
          onChange={(e) => handleFieldChange('price', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Stock"
          variantSize="sm"
          type="number"
          value={rowData.stock}
          onChange={(e) => handleFieldChange('stock', e.target.value)}
          className="flex-1"
        />
        <select
          className="w-48 p-2 border border-gray-300 rounded-md flex-1"
          value={rowData.seasonCode}
          onChange={(e) => handleFieldChange('seasonCode', e.target.value)}
        >
          <option value="">Temporada</option>
          {seasons.map(sea => <option key={sea.id} value={sea.id}>{sea.name}</option>)}
        </select>

        <div
          className="w-48 border border-gray-300 rounded-md flex-1"
        >
          <Accordion title="Categorías" className="relative" padding={false}>
            <div className="absolute top-full left-[-100px] z-10 p-4 border border-gray-100 bg-gray-50 w-[500px] rounded grid grid-cols-1 gap-1 md:grid-cols-2 gap-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border border-gray-300 text-red-600 focus:ring-red-500"
                      checked={rowData.categoryIds.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                    />
                    <span className="ml-2">{cat.name}</span>
                  </label>
                ))}
              </div>
          </Accordion>
        </div>

        <div
          className="w-48 border border-gray-300 rounded-md flex-1"
        >
          <Accordion title="Imágenes" className="relative" padding={false}>
            <div className="absolute top-full right-0 z-10 p-4 bg-gray-50 rounded-md z-10 w-[600px] text-left">
              {/* --- 3. INTEGRAR EL IMAGEUPLOADER REAL --- */}
              <ImageUploader 
                images={rowData.images}
                dispatch={imageUploaderDispatch}
              />
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}