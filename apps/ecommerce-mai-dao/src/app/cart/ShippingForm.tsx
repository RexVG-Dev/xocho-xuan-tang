import { ChangeEvent } from 'react';

export interface ShippingFormValues {
  customer_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address: string;
    postal_code: string;
    city: string;
    country: string;
    instructions?: string;
  };
}

export const initialShippingValues: ShippingFormValues = {
  customer_name: '',
  customer_last_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: {
    address: '',
    postal_code: '',
    city: '',
    country: '',
    instructions: '',
  },
};

export function ShippingForm({ values, onChange }: {
  values: ShippingFormValues;
  onChange: (values: ShippingFormValues) => void;
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name.startsWith('shipping_address.')) {
      const key = name.replace('shipping_address.', '');
      onChange({
        ...values,
        shipping_address: {
          ...values.shipping_address,
          [key]: value,
        },
      });
    } else {
      onChange({ ...values, [name]: value });
    }
  }

  return (
    <form className="space-y-6" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <div>
        <h3 className="font-bold text-lg mb-2">Información del comprador</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre <span className="text-red-500">*</span></label>
            <input name="customer_name" value={values.customer_name} onChange={handleChange} required placeholder="Escribe tu nombre" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Apellidos <span className="text-red-500">*</span></label>
            <input name="customer_last_name" value={values.customer_last_name} onChange={handleChange} required placeholder="Escribe tus apellidos" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email <span className="text-red-500">*</span></label>
            <input name="customer_email" value={values.customer_email} onChange={handleChange} required type="email" placeholder="Escribe tu correo electrónico" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono <span className="text-red-500">*</span></label>
            <input name="customer_phone" value={values.customer_phone} onChange={handleChange} required placeholder="Escribe tu teléfono" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Dirección de entrega</h3>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Dirección de entrega <span className="text-red-500">*</span></label>
          <input name="shipping_address.address" value={values.shipping_address.address} onChange={handleChange} required placeholder="Escribe la dirección de entrega" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Código Postal <span className="text-red-500">*</span></label>
            <input name="shipping_address.postal_code" value={values.shipping_address.postal_code} onChange={handleChange} required placeholder="Escribe el código postal" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Ciudad <span className="text-red-500">*</span></label>
            <select name="shipping_address.city" value={values.shipping_address.city} onChange={handleChange} required className="w-full rounded-lg border px-3 py-2 bg-gray-50">
              <option value="">Selecciona tu ciudad</option>
              <option value="CDMX">CDMX</option>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Monterrey">Monterrey</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">País <span className="text-red-500">*</span></label>
            <select name="shipping_address.country" value={values.shipping_address.country} onChange={handleChange} required className="w-full rounded-lg border px-3 py-2 bg-gray-50">
              <option value="">Selecciona tu país</option>
              <option value="México">México</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Instrucciones de entrega</label>
          <input name="shipping_address.instructions" value={values.shipping_address.instructions} onChange={handleChange} placeholder="Agregar instrucciones de entrega" className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
        </div>
      </div>
    </form>
  );
}
