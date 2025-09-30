import { Icon, IconProps } from '@/app/components/ui';
import { OrderCard } from './orderCard';
import { OrderInterface } from '@/shared/interfaces';

interface OrderColumnProps {
  title: string;
  iconName: IconProps['name'];
  colorClass: string;
  orders: OrderInterface[];
}

export function OrderColumn({ title, iconName, colorClass, orders }: OrderColumnProps) {
  // En fases futuras, aquí irán los handlers para el Drag and Drop
  const handleDetailsClick = (orderId: string) => console.log(`Details for ${orderId}`);
  const handleDeleteClick = (orderId: string) => console.log(`Delete for ${orderId}`);

  return (
    <div className="flex flex-col">
      {/* Encabezado de la Columna */}
      <div className={`flex items-center gap-4 py-6 px-4 rounded-t-lg text-white ${colorClass}`}>
        <Icon name={iconName} size={32} />
        <h2 className="text-lg font-bold">{title} ({orders.length})</h2>
      </div>

      {/* Contenedor de las Tarjetas */}
      <div className="bg-gray-100 p-4 rounded-b-lg space-y-4 flex-grow">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              // Lógica de ejemplo para el botón de borrar
              showDeleteButton={order.status === 'delivered' || order.status === 'cancelled'}
              onDetailsClick={handleDetailsClick}
              onDeleteClick={handleDeleteClick}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 py-8">No hay órdenes en este estado.</p>
        )}
      </div>
    </div>
  );
}
