'use client';
import { useStore } from '@/contexts/useStore';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Button } from '../components/ui/atoms/button';

type CartSummaryProps = {
  onNext?: () => void;
  children?: ReactNode;
  nextButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

function CartSummary({ onNext, children, nextButtonProps }: CartSummaryProps) {
  const { cart, cartTotal } = useStore();
  const isCartEmpty = !cart || cart.length === 0;
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
          disabled={isCartEmpty || nextButtonProps?.disabled}
          {...nextButtonProps}
        >
          Siguiente
        </Button>
      )}
    </div>
  );
}

export default CartSummary;
