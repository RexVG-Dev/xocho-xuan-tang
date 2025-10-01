import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Icon, IconProps } from '@/app/components/ui';
import { OrderCard } from './orderCard';
import { OrderInterface, OrderStatus } from '@/shared/interfaces';

interface OrderColumnProps {
  status: OrderStatus;
  title: string;
  iconName: IconProps['name'];
  colorClass: string;
  orders: OrderInterface[];
  onDeleteClick: (orderId: string) => void;
}

export function OrderColumn({
  status,
  title,
  iconName,
  colorClass,
  orders,
  onDeleteClick
}: OrderColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'COLUMN',
      status: status,
    }
  });

  const userRole = useMemo(() => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo).role : null;
    }
    return null;
  }, []);

  return (
    <div className="flex flex-col">
      <div className={`flex items-center gap-4 py-6 px-4 rounded-t-lg text-white ${colorClass}`}>
        <Icon name={iconName} size={32} />
        <h2 className="text-lg font-bold">{title} ({orders.length})</h2>
      </div>

      <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-b-lg space-y-4 flex-grow min-h-[300px]">
        <SortableContext
          items={orders.map(order => order.id)}
          strategy={verticalListSortingStrategy}
        >
          {
            orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                showDeleteButton={(order.status === 'delivered' || order.status === 'cancelled') && userRole === 'admin'}
                onDeleteClick={onDeleteClick}
              />
            ))
          }
        </SortableContext>
        {orders.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No hay órdenes en este estado.</p>
        )}
      </div>
    </div>
  );
}
