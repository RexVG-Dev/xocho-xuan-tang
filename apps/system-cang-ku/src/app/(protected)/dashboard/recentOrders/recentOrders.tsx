'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { Card, Button, Icon } from '@/app/components/ui';
import { apiFetch } from '@/app/api';
import { formatCurrency } from '@/utils/numbers';
import { formatDate } from '@/utils/dates';
import { RecentOrdersSkeleton } from './recentOrdersSkeleton';

import { useOrderDetailsModal } from '@/app/contexts/useOrderDetailsModal';

interface OrderDetailProduct {
  main_image_url: string;
  name: string;
}

interface OrderDetail {
  id: string;
  product_id: string;
  product: OrderDetailProduct;
}

interface Order {
  id: string;
  status: 'packing' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  order_date: string;
  tracking_number: string;
  orderDetails: OrderDetail[];
}

interface ApiResponse {
  orders: Order[];
  next: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const statusInfo = {
  packing: { text: 'Empacando', styles: 'bg-violet-500' },
  shipped: { text: 'Enviada', styles: 'bg-amber-400' },
  delivered: { text: 'Entregada', styles: 'bg-green-500' },
  cancelled: { text: 'Cancelada', styles: 'bg-red-600' },
};

export function RecentOrders() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const { openModal } = useOrderDetailsModal();

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const endpoint = `/recent-orders?skip=${skip}&take=${PAGE_SIZE}`;
        const responseData = await apiFetch(endpoint, { requiresAuth: true });
        setData(responseData);
      } catch (err) {
        setError('No se pudieron cargar las órdenes recientes.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [skip]);

  const handleNextPage = () => {
    if (data?.hasMore && data.next !== null) {
      setSkip(data.next);
    }
  };

  const handlePreviousPage = () => {
    setSkip(Math.max(0, skip - PAGE_SIZE));
  };

  const handleRowClick = (orderId: string) => {
    openModal(orderId);
  };

  if (isLoading) {
    return <RecentOrdersSkeleton />;
  }

  if (error || !data) {
    return (
      <Card title="Órdenes recientes">
        <p className="text-red-500">{error || 'No hay datos disponibles.'}</p>
      </Card>
    );
  }

  return (
    <Card title="Órdenes recientes" className="bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3"># Orden</th>
              <th scope="col" className="px-4 py-3">Productos</th>
              <th scope="col" className="px-4 py-3">Total</th>
              <th scope="col" className="px-4 py-3">Fecha</th>
              <th scope="col" className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => handleRowClick(order.id)}
              >
                <td className="px-4 py-3 font-medium text-gray-800">#{order.tracking_number}</td>
                <td className="px-4 py-3 max-w-xs truncate">{order.orderDetails.map(d => d.product.name).join(', ')}</td>
                <td className="px-4 py-3">{formatCurrency(parseFloat(order.total))}</td>
                <td className="px-4 py-3">{formatDate(new Date(order.order_date))}</td>
                <td className="px-4 py-3">
                  <span className={clsx(
                    'px-2 py-1 text-xs text-white rounded-md capitalize', 
                    statusInfo[order.status]?.styles || 'bg-gray-100 text-gray-800'
                  )}>
                    {statusInfo[order.status]?.text || order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={handlePreviousPage}
          disabled={skip === 0}
          size="sm"
          variant="ghost"
          icon={
            <Icon name="arrowleft"/>
          }
          color="none"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!data.hasMore}
          size="sm"
          variant="ghost"
          icon={
            <Icon name="arrowright"/>
          }
          iconButtonPosition="right"
          color="none"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  )
}
export default RecentOrders
