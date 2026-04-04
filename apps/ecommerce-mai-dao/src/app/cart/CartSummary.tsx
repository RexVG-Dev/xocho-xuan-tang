import { useStore } from '@/contexts/useStore';
import { ReactNode } from 'react';
import { Button } from '../components/ui/atoms/button/Button';

export function CartSummary({ onNext, children }: { onNext?: () => void; children?: ReactNode }) {
  const { cart, cartTotal } = useStore();

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full max-w-xs">
      <h2 className="text-lg font-bold mb-4">Resumen de orden</h2>
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Sub Total</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Envío</span>
        <span className="font-semibold text-green-600">GRATIS</span>
      </div>
      <div className="border-t my-2"></div>
      <div className="flex justify-between text-lg font-bold mb-4">
        <span>Total</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      {children}
      {onNext && (
        <Button
          className="w-full mt-2"
          color="dark"
          rounded="full"
          size="md"
          onClick={onNext}
        >
          Siguiente
        </Button>
      )}
    </div>
  );
}
