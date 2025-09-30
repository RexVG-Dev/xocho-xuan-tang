'use client';

import { useState, useEffect } from 'react';

import { apiFetch } from '@/app/api';
import { useLoading } from '@/app/contexts/useLoading';
import { Card } from '@/app/components/ui';
import { OrderInterface } from '@/shared/interfaces';

import { OrderColumn } from './orderColumn';


const groupOrdersByStatus = (orders: OrderInterface[]) => {
  const statusGroups: Record<OrderInterface['status'], OrderInterface[]> = {
    packing: [],
    shipped: [],
    delivered: [],
    cancelled: [],
  };
  return orders.reduce((acc, order) => {
    // Asegurarse de que el status existe en los grupos antes de hacer push
    if (acc[order.status]) {
      acc[order.status].push(order);
    }
    return acc;
  }, statusGroups);
};

export function Orders() {
  const [orders, setOrders] = useState<Record<OrderInterface['status'], OrderInterface[]>>({
    packing: [],
    shipped: [],
    delivered: [],
    cancelled: [],
  });
   const [error, setError] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    async function fetchOrders() {
      showLoader({
        type: 'get',
      });
      try {
        const allOrders: OrderInterface[] = await apiFetch('/orders', { requiresAuth: true });
        const grouped = groupOrdersByStatus(allOrders);
        setOrders(grouped);
      } catch (err) {
        setError('No se pudieron cargar las órdenes.');
        console.error(err);
      } finally {
        hideLoader();
      }
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Card title="Órdenes" className="bg-white">
        <p className="text-center text-red-500 py-10">{error}</p>
      </Card>
    );
  }

  return (
    <Card title="Órdenes" className="bg-white">
      
      {/* Contenedor del Tablero Kanban */}
      <div className="grid grid-cols-4 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <OrderColumn 
          title="Empacado"
          iconName="packing_white"
          colorClass="bg-violet-500"
          orders={orders.packing}
        />
        <OrderColumn 
          title="En envío"
          iconName="plane_white"
          colorClass="bg-amber-400"
          orders={orders.shipped}
        />
        <OrderColumn 
          title="Entregado"
          iconName="done_white"
          colorClass="bg-green-500"
          orders={orders.delivered}
        />
        <OrderColumn 
          title="Cancelado"
          iconName="error_white"
          colorClass="bg-red-600"
          orders={orders.cancelled}
        />
      </div>
    </Card>
  );
}
export default Orders
