import { ProductFormState } from '../_components/productFormReducer'; // Reutilizamos la interfaz

// El estado principal es un array de formularios de producto
export type BulkFormState = ProductFormState[];

// Creamos un estado inicial con 30 filas vacías
export const initialBulkState: BulkFormState = Array(30).fill({
  id: null,
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
});

// Definimos las acciones que podemos realizar en el formulario masivo
type Action =
  | { type: 'UPDATE_ROW_FIELD'; rowIndex: number; field: keyof ProductFormState; value: any }
  | { type: 'TOGGLE_ROW_CATEGORY'; rowIndex: number; categoryId: string }
  | { type: 'SET_ROW_IMAGES'; rowIndex: number; images: ProductFormState['images'] }
  | { type: 'SET_ROW_MAIN_IMAGE'; rowIndex: number; imageIndex: number }
  | { type: 'REMOVE_ROW_IMAGE'; rowIndex: number; imageIndex: number };
  // Aquí podríamos añadir acciones para las imágenes de cada fila en el futuro

export function bulkProductFormReducer(state: BulkFormState, action: Action): BulkFormState {
  switch (action.type) {
    case 'UPDATE_ROW_FIELD':
      return state.map((row, index) =>
        index === action.rowIndex ? { ...row, [action.field]: action.value } : row
      );

    case 'TOGGLE_ROW_CATEGORY':
      return state.map((row, index) => {
        if (index !== action.rowIndex) return row;

        const newCategoryIds = row.categoryIds.includes(action.categoryId)
          ? row.categoryIds.filter(id => id !== action.categoryId)
          : [...row.categoryIds, action.categoryId];
        return { ...row, categoryIds: newCategoryIds };
      });

    case 'SET_ROW_IMAGES':
      return state.map((row, index) =>
        index === action.rowIndex ? { ...row, images: action.images } : row
      );

    case 'SET_ROW_MAIN_IMAGE':
      return state.map((row, index) => {
        if (index !== action.rowIndex) return row;
        const newImages = row.images.map((img, i) => ({ ...img, isMain: i === action.imageIndex }));
        return { ...row, images: newImages };
      });

    case 'REMOVE_ROW_IMAGE':
      return state.map((row, index) => {
        if (index !== action.rowIndex) return row;
        const newImages = [...row.images];
        const wasMain = newImages[action.imageIndex].isMain;
        newImages[action.imageIndex] = { file: null, url: '', isMain: false };

        if (wasMain) {
          const firstAvailable = newImages.findIndex(img => img.file || img.url);
          if (firstAvailable !== -1) {
            newImages[firstAvailable].isMain = true;
          }
        }
        return { ...row, images: newImages };
      });

    default:
      return state;
  }
}
