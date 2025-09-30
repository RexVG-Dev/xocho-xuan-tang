'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import { apiFetch } from '@/app/api';
import { useLoading } from '@/app/contexts/useLoading';
import { Card } from '@/app/components/ui';
import { OrderInterface, OrderStatus } from '@/shared/interfaces';
import { ConfirmationModal } from './confirmationModal';
import { OrderColumn } from './orderColumn';
import { OrderCard } from './orderCard'; 

const COLUMN_ORDER: OrderStatus[] = ['packing', 'shipped', 'delivered', 'cancelled'];

export function Orders() {
  const [orders, setOrders] = useState<Record<OrderStatus, OrderInterface[]>>({
    packing: [],
    shipped: [],
    delivered: [],
    cancelled: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoading();

  const [confirmation, setConfirmation] = useState<{ order: OrderInterface, newStatus: OrderStatus } | null>(null);
  const [originalOrders, setOriginalOrders] = useState<Record<OrderStatus, OrderInterface[]> | null>(null);

  const [activeOrder, setActiveOrder] = useState<OrderInterface | null>(null);

  const fetchOrders = async () => {
    showLoader({
      type: 'get',
    });
    try {
      const allOrders: OrderInterface[] = await apiFetch('/orders', { requiresAuth: true });
      const grouped = allOrders.reduce((acc, order) => {
        if (acc[order.status]) {
          acc[order.status].push(order);
        }
        return acc;
      }, { packing: [], shipped: [], delivered: [], cancelled: [] } as Record<OrderStatus, OrderInterface[]>);
      setOrders(grouped);
    } catch (error) {
      setError('No se pudieron cargar las órdenes.');
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('Confirmation state changed: ', confirmation);
  }, [confirmation])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const orderId = active.id as string;
    // Buscamos la orden en todas las columnas para encontrar la que se está arrastrando
    const order = COLUMN_ORDER.flatMap(status => orders[status]).find(order => order.id === orderId);
    if (order) {
      setActiveOrder(order);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveOrder(null);
    const { active, over } = event;

    // Si no se soltó sobre una columna válida, no hacer nada
    if (!over) return;

    const activeContainer = active.data.current?.status as OrderStatus;
    let overContainer: OrderStatus;
    if (over.data.current?.type === 'COLUMN') {
      // Caso 1: Se soltó en un área vacía de la columna
      overContainer = over.id as OrderStatus;
    } else {
      // Caso 2: Se soltó sobre otra tarjeta, obtenemos la columna de esa tarjeta
      overContainer = over.data.current?.status as OrderStatus;
    }
    
    // Solo actuar si se movió a una columna DIFERENTE
    if (activeContainer && overContainer && activeContainer !== overContainer) {
      const orderId = active.id as string;
      const orderToMove = orders[activeContainer].find(o => o.id === orderId);

      if (orderToMove) {
        // 1. Guardar el estado original en caso de que el usuario cancele
        setOriginalOrders(JSON.parse(JSON.stringify(orders)));

        // 2. Actualización optimista: Mover la tarjeta en la UI inmediatamente
        setOrders(prev => {
          const newOrders = { ...prev };
          newOrders[activeContainer] = newOrders[activeContainer].filter(order => order.id !== orderId);
          newOrders[overContainer] = [...(newOrders[overContainer] || []), { ...orderToMove, status: overContainer }];
          return newOrders;
        });
        
        // 3. Mostrar el modal de confirmación
        setConfirmation({ order: orderToMove, newStatus: overContainer });
      }
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmation) return;
    
    showLoader({
      type: 'changes'
    });
    try {
      await apiFetch(`/orders/${confirmation.order.id}/status`, {
        method: 'PUT',
        requiresAuth: true,
        body: {
          newStatus: confirmation.newStatus,
          observations: `Estado cambiado a ${confirmation.newStatus}.`
        }
      });
      // La UI ya está actualizada, así que solo limpiamos los estados de respaldo
      setOriginalOrders(null);
    } catch (error) {
      console.error("Fallo al actualizar el estado de la orden", error);
      // Si la API falla, revertimos la UI al estado original
      if (originalOrders) setOrders(originalOrders);
    } finally {
      setConfirmation(null); // Cerrar el modal
      hideLoader();
    }
  };

  const handleCancelStatusChange = () => {
    // Si el usuario cancela, revertimos la UI al estado original
    if (originalOrders) setOrders(originalOrders);
    setConfirmation(null);
    setOriginalOrders(null);
  };

  const handleDelete = (orderId: string) => {
    // Lógica futura para el modal de eliminación
    console.log(`Eliminar orden: ${orderId}`);
  };

  useEffect(() => {
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
      
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {COLUMN_ORDER.map(status => (
            <OrderColumn
              key={status}
              status={status}
              title={
                status === 'packing' ? 'Empacado' :
                status === 'shipped' ? 'En envío' :
                status === 'delivered' ? 'Entregado' :
                'Cancelado'
              }
              iconName={
                status === 'packing' ? 'packing_white' :
                status === 'shipped' ? 'plane_white' :
                status === 'delivered' ? 'done_white' :
                'error_white'
              }
              colorClass={
                status === 'packing' ? 'bg-violet-500' :
                status === 'shipped' ? 'bg-amber-400' :
                status === 'delivered' ? 'bg-green-500' :
                'bg-red-600'
              }
              orders={orders[status] || []}
              onDeleteClick={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeOrder ? (
            <OrderCard 
              order={activeOrder} 
              showDeleteButton={false} 
              onDeleteClick={() => { /* empty */ }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      {confirmation && (
        <ConfirmationModal
          isOpen={!!confirmation}
          title="Confirmar Cambio de Estado"
          message={`¿Estás seguro de que quieres mover la orden #${confirmation.order.tracking_number}?`}
          onConfirm={handleConfirmStatusChange}
          onCancel={handleCancelStatusChange}
        />
      )}
    </Card>
  );
}
export default Orders
