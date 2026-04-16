import React from 'react';
import { Icon } from '../components/ui/atoms/icon';

interface OrderSuccessProps {
  trackingNumber: string;
  shippingData: {
    customer_name: string;
    customer_last_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
  };
  summary: React.ReactNode;
}

import { useRouter } from 'next/navigation';

interface OrderSuccessProps {
  trackingNumber: string;
  shippingData: {
    customer_name: string;
    customer_last_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
  };
  summary: React.ReactNode;
  showExploreMoreButton?: boolean;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ trackingNumber, shippingData, summary, showExploreMoreButton }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row gap-8 items-stretch">
      <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col justify-center min-h-[300px]">
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
            <Icon name="done_green" className="w-8 h-8" />
          </span>
          <div>
            <div className="text-sm text-gray-600 font-semibold">No. de Orden</div>
            <div className="text-3xl font-extrabold text-black leading-tight">{trackingNumber}</div>
          </div>
        </div>
        <div className="text-lg font-bold mb-1">Enviado a {shippingData.customer_name} {shippingData.customer_last_name}</div>
        <div className="text-gray-700 text-base mb-2 border-b pb-2">
          {shippingData.shipping_address}
        </div>
        <div className="text-gray-700 text-base mb-1">{shippingData.customer_email}</div>
        <div className="text-gray-700 text-base">{shippingData.customer_phone}</div>
        {showExploreMoreButton && (
          <button
            className="mt-8 w-full bg-black text-white rounded-full py-3 font-semibold text-base transition hover:bg-gray-900"
            onClick={() => router.push('/')}
          >
            Descubre más productos
          </button>
        )}
      </div>
      <div className="w-full md:w-96 flex-shrink-0">
        {summary}
      </div>
    </div>
  );
};
