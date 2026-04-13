import { ShippingFormValues } from './ShippingForm';
import { Button } from '../components/ui/atoms/button/Button';

export function ShippingSummary({ values, onEdit }: { values: ShippingFormValues; onEdit?: () => void }) {
  if (!values) return null;
  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">
          Enviar a <span className="font-semibold">{values.customer_name} {values.customer_last_name}</span>
        </span>
        {onEdit && (
          <Button
            size="sm"
            color="secondary"
            variant="ghost"
            className="text-sm font-semibold"
            onClick={onEdit}
          >
            Editar
          </Button>
        )}
      </div>
      <div className="text-gray-700 text-sm">
        <div>{values.shipping_address.street}</div>
        <div>Col. {values.shipping_address.neighborhood}</div>
        <div>Municipio: {values.shipping_address.municipality}</div>
        <div>Estado: {values.shipping_address.state}</div>
        <div>C.P. {values.shipping_address.postalCode}</div>
        <div>{values.customer_email}</div>
        <div>{values.customer_phone}</div>
      </div>
    </div>
  );
}
