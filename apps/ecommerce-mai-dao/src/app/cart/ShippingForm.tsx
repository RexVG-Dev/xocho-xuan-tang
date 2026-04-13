import { ChangeEvent, useReducer } from 'react';
import { apiRequest } from '../contexts/apiClient';

export function isShippingFormValid(values: ShippingFormValues, errors: ShippingFormErrors): boolean {
  if (
    !values.customer_name.trim() ||
    !values.customer_last_name.trim() ||
    !values.customer_email.trim() ||
    !values.customer_phone.trim() ||
      !values.shipping_address.street.trim() ||
      !values.shipping_address.neighborhood.trim() ||
      !values.shipping_address.municipality.trim() ||
      !values.shipping_address.state.trim() ||
      !values.shipping_address.postalCode.trim()
  ) {
    return false;
  }
  return Object.values(errors).every((err) => !err);
}


export interface ShippingFormValues {
  customer_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    neighborhood: string;
    municipality: string;
    state: string;
    postalCode: string;
    instructions?: string;
  };
}

export const initialShippingValues: ShippingFormValues = {
  customer_name: '',
  customer_last_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: {
    street: '',
    neighborhood: '',
    municipality: '',
    state: '',
    postalCode: '',
    instructions: '',
  },
};


type ShippingFormAction =
  | { type: 'FIELD', name: string, value: string }
  | { type: 'ADDRESS_FIELD', name: string, value: string }
  | { type: 'SET_ERRORS', errors: Partial<ShippingFormErrors> };

interface ShippingFormErrors {
  customer_name?: string;
  customer_last_name?: string;
  customer_email?: string;
  customer_phone?: string;
  street?: string;
  neighborhood?: string;
  municipality?: string;
  state?: string;
  postalCode?: string;
}

const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;
const streetPattern = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñüÜ#\s,./-]+$/;
const postalCodePattern = /^\d{5}$/;

function validateField(name: string, value: string): string | undefined {
  switch (name) {
    case 'customer_name':
      if (!value.trim()) return 'El nombre es obligatorio.';
      if (!namePattern.test(value)) return 'Solo letras, espacios y acentos.';
      return undefined;
    case 'customer_last_name':
      if (!value.trim()) return 'El apellido es obligatorio.';
      if (!namePattern.test(value)) return 'Solo letras, espacios y acentos.';
      return undefined;
    case 'customer_email':
      if (!value.trim()) return 'El correo es obligatorio.';
      if (!emailPattern.test(value)) return 'Correo inválido.';
      return undefined;
    case 'customer_phone':
      if (!value.trim()) return 'El teléfono es obligatorio.';
      if (!phonePattern.test(value)) return 'Teléfono inválido.';
      return undefined;
    case 'street':
      if (!value.trim()) return 'La calle es obligatoria.';
      if (!streetPattern.test(value)) return 'Calle inválida.';
      return undefined;
    case 'neighborhood':
      if (!value.trim()) return 'La colonia es obligatoria.';
      return undefined;
    case 'municipality':
      if (!value.trim()) return 'El municipio es obligatorio.';
      return undefined;
    case 'state':
      if (!value.trim()) return 'El estado es obligatorio.';
      return undefined;
    case 'postalCode':
      if (!value.trim()) return 'El código postal es obligatorio.';
      if (!postalCodePattern.test(value)) return 'Código postal inválido.';
      return undefined;
    default:
      return undefined;
  }
}




function reducer(state: { values: ShippingFormValues; errors: ShippingFormErrors }, action: ShippingFormAction) {
  switch (action.type) {
    case 'FIELD':
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
      };
    case 'ADDRESS_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          shipping_address: {
            ...state.values.shipping_address,
            [action.name]: action.value,
          },
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: { ...state.errors, ...action.errors },
      };
    default:
      return state;
  }
}

const initialState = {
  values: initialShippingValues,
  errors: {},
};


export function ShippingForm({ values, onChange }: {
  values: ShippingFormValues;
  onChange: (values: ShippingFormValues) => void;
}) {
  const [state, dispatch] = useReducer(reducer, { values, errors: {} });

  async function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name.startsWith('shipping_address.')) {
      const key = name.replace('shipping_address.', '');
      dispatch({ type: 'ADDRESS_FIELD', name: key, value });
      onChange({
        ...state.values,
        shipping_address: {
          ...state.values.shipping_address,
          [key]: value,
        },
      });

    } else {
      dispatch({ type: 'FIELD', name, value });
      onChange({ ...state.values, [name]: value });
    }
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    let errorField = name;
    if (name.startsWith('shipping_address.')) {
      errorField = name.replace('shipping_address.', '');
    }
    const error = validateField(errorField, value);
    dispatch({ type: 'SET_ERRORS', errors: { [errorField]: error } });
  }

  return (
    <form className="space-y-6" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <div>
        <h3 className="font-bold text-lg mb-2">Información del comprador</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre <span className="text-red-500">*</span></label>
            <input name="customer_name" value={state.values.customer_name} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe tu nombre" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.customer_name && <span className="text-xs text-red-500">{state.errors.customer_name}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Apellidos <span className="text-red-500">*</span></label>
            <input name="customer_last_name" value={state.values.customer_last_name} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe tus apellidos" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.customer_last_name && <span className="text-xs text-red-500">{state.errors.customer_last_name}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email <span className="text-red-500">*</span></label>
            <input name="customer_email" value={state.values.customer_email} onChange={handleChange} onBlur={handleBlur} required type="email" placeholder="Escribe tu correo electrónico" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.customer_email && <span className="text-xs text-red-500">{state.errors.customer_email}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono <span className="text-red-500">*</span></label>
            <input name="customer_phone" type="tel" value={state.values.customer_phone} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe tu teléfono" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.customer_phone && <span className="text-xs text-red-500">{state.errors.customer_phone}</span>}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Dirección de entrega</h3>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Calle <span className="text-red-500">*</span></label>
          <input name="shipping_address.street" value={state.values.shipping_address.street} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe la calle" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
          {state.errors.street && <span className="text-xs text-red-500">{state.errors.street}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Colonia <span className="text-red-500">*</span></label>
            <input name="shipping_address.neighborhood" value={state.values.shipping_address.neighborhood} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe la colonia" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.neighborhood && <span className="text-xs text-red-500">{state.errors.neighborhood}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Municipio <span className="text-red-500">*</span></label>
            <input name="shipping_address.municipality" value={state.values.shipping_address.municipality} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe el municipio" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.municipality && <span className="text-xs text-red-500">{state.errors.municipality}</span>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Estado <span className="text-red-500">*</span></label>
            <input name="shipping_address.state" value={state.values.shipping_address.state} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe el estado" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.state && <span className="text-xs text-red-500">{state.errors.state}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Código Postal <span className="text-red-500">*</span></label>
            <input name="shipping_address.postalCode" value={state.values.shipping_address.postalCode} onChange={handleChange} onBlur={handleBlur} required placeholder="Escribe el código postal" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
            {state.errors.postalCode && <span className="text-xs text-red-500">{state.errors.postalCode}</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Instrucciones de entrega</label>
          <input name="shipping_address.instructions" value={state.values.shipping_address.instructions} onChange={handleChange} placeholder="Agregar instrucciones de entrega" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
        </div>
      </div>
    </form>
  );
}
