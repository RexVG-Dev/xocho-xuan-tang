export interface ProductFormState {
  id: string | null;
  name: string;
  description: string;
  sku: string;
  stock: number | string;
  price: number | string;
  seasonCode: string;
  categoryIds: string[];
  discountType: 'percentage' | 'amount' | null;
  discountValue: number | string;
  images: { file: File | null; url: string; isMain: boolean }[];
}

export const initialState: ProductFormState = {
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
};

type Action =
  | { type: 'SET_FIELD'; field: keyof ProductFormState; value: any }
  | { type: 'TOGGLE_CATEGORY'; id: string }
  | { type: 'SET_IMAGES'; images: ProductFormState['images'] }
  | { type: 'SET_MAIN_IMAGE'; index: number }
  | { type: 'REMOVE_IMAGE'; index: number }
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

    case 'SET_IMAGES':
      return { ...state, images: action.images };
    case 'SET_MAIN_IMAGE':
      { const newImages = state.images.map((img, i) => ({ ...img, isMain: i === action.index }));
      return { ...state, images: newImages }; }

    case 'REMOVE_IMAGE': {
      const newImages = [...state.images];
      const wasMain = newImages[action.index].isMain;
      newImages[action.index] = { file: null, url: '', isMain: false };

      if (wasMain) {
        const firstAvailableImageIndex = newImages.findIndex(img => img.file || img.url);
        if (firstAvailableImageIndex !== -1) {
          newImages[firstAvailableImageIndex].isMain = true;
        }
      }
      return { ...state, images: newImages };
    }

    // Acción para cargar datos en modo edición
    case 'LOAD_PRODUCT': {
      const { product } = action;
      const loadedImages = product.images.map((img: any) => ({
        file: null,
        url: img.image_url,
        isMain: img.image_url === product.main_image_url,
      }));

      while (loadedImages.length < 5) {
        loadedImages.push({ file: null, url: '', isMain: false });
      }

      return {
        ...state,
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        stock: product.stock || '',
        price: product.price || '',
        seasonCode: product.categories.find((c: any) => c.type === 'season')?.id || '',
        categoryIds: product.categories.filter((c: any) => c.type === 'category').map((c: any) => c.id),
        discountType: product.discount_type || null,
        discountValue: product.discount_value || '',
        images: loadedImages,
      };
    }

    default:
      return state;
  }
}