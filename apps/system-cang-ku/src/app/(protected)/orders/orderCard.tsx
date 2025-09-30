'use client';
import clsx from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useOrderDetailsModal } from '@/app/contexts/useOrderDetailsModal';
import { Card, IconButton, Icon } from '@/app/components/ui';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/numbers';
import { OrderInterface } from '@/shared/interfaces';

interface OrderCardProps {
  order: OrderInterface;
  showDeleteButton: boolean;
  onDeleteClick: (orderId: string) => void;
}

export function OrderCard({
  order,
  showDeleteButton,
  onDeleteClick
}: OrderCardProps) {
  const { openModal } = useOrderDetailsModal();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id, data: { ...order, status: order.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const trakingTextStyle = clsx(' text-base font-bold', {
    'text-violet-600': order.status === 'packing',
    'text-amber-500': order.status === 'shipped',
    'text-green-600': order.status === 'delivered',
    'text-red-600': order.status === 'cancelled',
  });
  return (
    <Card 
        ref={setNodeRef}
        style={style}
        className="bg-white border border-gray-200 shadow-sm !p-4"
        {...attributes}
        {...listeners}
      >
      <div className="flex justify-between w-full items-start">
        <div className="text-sm w-full">
          <div
            className="flex justify-between items-center border-b border-gray-300 pb-1"
          >
            <p className={trakingTextStyle}>#{order.tracking_number}</p>
            <div className="flex items-end gap-2">
              <IconButton
                variant="ghost"
                size="sm"
                icon={<Icon name="arrowright" size={20} />}
                onClick={() => openModal(order.id)}
                className="hover:bg-gray-200"
              />
              {showDeleteButton && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<Icon name="delete" size={20} className="text-gray-400 hover:text-red-600" />}
                  onClick={() => onDeleteClick(order.id)}
                  className="hover:bg-gray-200"
                />
              )}
            </div>
          </div>
          
          <p className="text-gray-500 mt-2">Fecha:</p>
          <p className="font-semibold text-gray-700">{formatDate(new Date(order.order_date))}</p>
          <p className="text-gray-500 mt-2">Total:</p>
          <p className="font-semibold text-gray-700">{formatCurrency(Number(order.total))}</p>
        </div>
      </div>
    </Card>
  );
}
