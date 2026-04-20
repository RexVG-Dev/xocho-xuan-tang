import React from 'react';

import { calculateDiscountedPrice } from '@/shared/utils';
import { ProductInterface } from '@/shared/interfaces';

interface OrderSummaryProps {
  total: number;
  orderDetails: Array<{
    id: string;
    quantity: number;
    unit_price: string;
    product: ProductInterface;
  }>;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ total, orderDetails }) => {

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full max-w-xs">
      <h2 className="text-lg font-bold mb-4">Resumen de orden</h2>
      <div className="flex flex-col gap-2 mb-2">
        {orderDetails.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-600">
            <span>{item.quantity} x {item.product.name}</span>
            <span>${(Number(calculateDiscountedPrice(item.product)) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Envío</span>
        <span className="font-semibold text-green-600">GRATIS</span>
      </div>
      <div className="border-t my-2"></div>
      <div className="flex justify-between text-lg font-bold mb-4">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};