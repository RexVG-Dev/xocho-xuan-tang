'use client';
import { Card, Input } from '@/app/components/ui';
import { OrderColumn } from './orderColumn';

import { OrderInterface } from '@/shared/interfaces';

const mockOrders: OrderInterface[] = [
  { id: '1', status: 'packing', tracking_number: '8937479', order_date: '2025-06-21T10:00:00Z', total: 1299.00 },
  { id: '2', status: 'packing', tracking_number: '420299', order_date: '2025-06-21T11:00:00Z', total: 199.00 },
  { id: '3', status: 'shipped', tracking_number: '2937201', order_date: '2025-06-19T14:00:00Z', total: 820.00 },
  { id: '4', status: 'shipped', tracking_number: '3763892', order_date: '2025-06-20T18:00:00Z', total: 545.00 },
  { id: '5', status: 'delivered', tracking_number: '8937479', order_date: '2025-06-17T09:00:00Z', total: 1100.00 },
  { id: '6', status: 'cancelled', tracking_number: '5788292', order_date: '2025-06-22T12:00:00Z', total: 990.00 },
  { id: '7', status: 'cancelled', tracking_number: '2820381', order_date: '2025-06-21T15:00:00Z', total: 720.00 },
  { id: '8', status: 'packing', tracking_number: '8937479', order_date: '2025-06-21T10:00:00Z', total: 1299.00 },
  { id: '9', status: 'packing', tracking_number: '420299', order_date: '2025-06-21T11:00:00Z', total: 199.00 },
  { id: '10', status: 'packing', tracking_number: '8937479', order_date: '2025-06-21T10:00:00Z', total: 1299.00 },
  { id: '11', status: 'packing', tracking_number: '420299', order_date: '2025-06-21T11:00:00Z', total: 199.00 },
  { id: '12', status: 'packing', tracking_number: '8937479', order_date: '2025-06-21T10:00:00Z', total: 1299.00 },
  { id: '13', status: 'packing', tracking_number: '420299', order_date: '2025-06-21T11:00:00Z', total: 199.00 },
  { id: '14', status: 'packing', tracking_number: '8937479', order_date: '2025-06-21T10:00:00Z', total: 1299.00 },
  { id: '15', status: 'packing', tracking_number: '420299', order_date: '2025-06-21T11:00:00Z', total: 199.00 },
];

const groupOrdersByStatus = (orders: OrderInterface[]) => {
  return orders.reduce((acc, order) => {
    (acc[order.status] = acc[order.status] || []).push(order);
    return acc;
  }, {} as Record<OrderInterface['status'], OrderInterface[]>);
};

export function Orders() {
  const groupedOrders = groupOrdersByStatus(mockOrders);

  return (
    <Card title="Órdenes" className="bg-white">
      
      {/* Contenedor del Tablero Kanban */}
      <div className="grid grid-cols-4 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <OrderColumn 
          title="Empacado"
          iconName="packing_white"
          colorClass="bg-violet-500"
          orders={groupedOrders.packing || []}
        />
        <OrderColumn 
          title="En envío"
          iconName="plane_white"
          colorClass="bg-amber-400"
          orders={groupedOrders.shipped || []}
        />
        <OrderColumn 
          title="Entregado"
          iconName="done_white"
          colorClass="bg-green-500"
          orders={groupedOrders.delivered || []}
        />
        <OrderColumn 
          title="Cancelado"
          iconName="error_white"
          colorClass="bg-red-600"
          orders={groupedOrders.cancelled || []}
        />
      </div>
    </Card>
  );
}
export default Orders