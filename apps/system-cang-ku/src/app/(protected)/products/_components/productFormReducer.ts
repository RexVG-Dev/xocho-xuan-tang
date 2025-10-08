import { CategoryInterface } from "@/shared/types/category";

export interface ProductFormState {
  name: string;
  description: string;
  sku: string;
  stock: number | string;
  price: number | string;
  seasonCode: string;
  categoryIds: string[];
  discountType: 'percentage' | 'amount' | null;
  discountValue: number | string;
  // Para las imágenes, manejaremos los archivos y las URLs
  images: { file: File | null; url: string; isMain: boolean }[];
}

export const initialState: ProductFormState = {
  name: '',
  description: '',
  sku: '',
  stock: '',
  price: '',
  seasonCode: '',
  categoryIds: [],
  discountType: null,
  discountValue: '',
  images: Array(5).fill({ file: null, url: '', isMain: false }),
};

type Action =
  | { type: 'SET_FIELD'; field: keyof ProductFormState; value: any }
  | { type: 'TOGGLE_CATEGORY'; id: string }
  | { type: 'SET_IMAGES'; images: ProductFormState['images'] }
  | { type: 'SET_MAIN_IMAGE'; index: number }
  | { type: 'LOAD_PRODUCT'; product: any };

export function productFormReducer(state: ProductFormState, action: Action): ProductFormState {
  switch (action.type) {
    case 'SET_FIELD':
      // Habilitar/deshabilitar el campo de descuento
      if (action.field === 'discountType' && !action.value) {
        return { ...state, discountType: null, discountValue: '' };
      }
      return { ...state, [action.field]: action.value };
    
    case 'TOGGLE_CATEGORY':
      { const newCategoryIds = state.categoryIds.includes(action.id)
        ? state.categoryIds.filter(id => id !== action.id)
        : [...state.categoryIds, action.id];
      return { ...state, categoryIds: newCategoryIds }; }
    
    // Acciones para imágenes (las implementaremos en detalle en la Fase 3)
    case 'SET_IMAGES':
      return { ...state, images: action.images };
    case 'SET_MAIN_IMAGE':
      { const newImages = state.images.map((img, i) => ({ ...img, isMain: i === action.index }));
      return { ...state, images: newImages }; }

    // Acción para cargar datos en modo edición
    case 'LOAD_PRODUCT':
      // Aquí irá la lógica para transformar los datos del producto al estado del formulario
      return { ...state, ...action.product };

    default:
      return state;
  }
}