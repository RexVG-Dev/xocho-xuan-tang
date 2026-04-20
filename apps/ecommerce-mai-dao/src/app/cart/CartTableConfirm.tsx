import Image from 'next/image';

import { useStore } from '@/contexts/useStore';
import { calculateDiscountedPrice } from '@/shared/utils';

import { Button } from '../components/ui/atoms/button/Button';

export function CartTableConfirm() {
  const { cart, updateQuantity } = useStore();

  if (!cart.length) {
    return <div className="text-center text-gray-500 py-12">Tu carrito está vacío.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-2xl shadow">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left font-semibold text-gray-600">Producto</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-600">Cantidad</th>
            <th className="py-3 px-4 text-right font-semibold text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="py-4 px-4 flex items-center gap-4 min-w-[220px]">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image src={item.main_image_url} alt={item.name} width={64} height={64} className="object-contain w-full h-full" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 leading-tight">{item.name}</div>
                  <div className="text-xs text-gray-400">SKU #{item.sku}</div>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="inline-flex items-center border rounded-full overflow-hidden bg-gray-50">
                  <Button
                    size="sm"
                    color="light"
                    rounded="full"
                    className="w-8 h-8 text-lg font-bold"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    aria-label="Disminuir"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    size="sm"
                    color="light"
                    rounded="full"
                    className="w-8 h-8 text-lg font-bold"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Aumentar"
                  >
                    +
                  </Button>
                </div>
              </td>
              <td className="py-4 px-4 text-right font-semibold text-gray-900">
                {calculateDiscountedPrice(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
