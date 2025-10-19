'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { useOrderDetailsModal } from '@/app/contexts/useOrderDetailsModal';
import { apiFetch } from '@/app/api';
import { Modal, Button, Icon, IconButton } from '@/app/components/ui';
import { formatCurrency } from '@/utils/numbers';
import { formatDate } from '@/utils/dates';
import { OrderDetailsInterface } from '@/shared/interfaces';

import { Accordion } from '../../molecules';

const statusInfo = {
  packing: { text: 'Empacando', styles: 'bg-violet-500' },
  shipped: { text: 'Enviada', styles: 'bg-amber-400' },
  delivered: { text: 'Entregada', styles: 'bg-green-500' },
  cancelled: { text: 'Cancelada', styles: 'bg-red-600' },
};

export function OrderDetailsModal() {
  const { isOpen, orderId, closeModal } = useOrderDetailsModal();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchOrderDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiFetch(`/orders/${orderId}`, { requiresAuth: true });
          setOrderDetails(data);
        } catch (err) {
          setError('No se pudieron cargar los detalles de la orden.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const handleClose = () => {
    setOrderDetails(null);
    closeModal();
  };

  const renderSkeleton = () => (
    <div className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} position="right">
      {isLoading ? (
        renderSkeleton()
      ) : error ? (
        <div className="p-6 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={handleClose} color="secondary" className="mt-4">Cerrar</Button>
        </div>
      ) : orderDetails ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Orden <span className="ml-4">#{orderDetails.tracking_number}</span></h2>
            <IconButton
              onClick={handleClose}
              icon={<Icon name="arrowright_red" size={30}/>}
              variant="ghost"
            />
          </div>

          <div className="flex-grow p-6 overflow-y-auto">
            <div className="mb-6 grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-xs text-gray-500 uppercase">Status</span>
              <div>
                <span className={clsx('px-2 py-1 mt-1 inline-block text-xs text-white rounded-md capitalize', statusInfo[orderDetails.status]?.styles)}>
                  {statusInfo[orderDetails.status]?.text}
                </span>
              </div>
              

              <span className="text-xs text-gray-500 uppercase">Fecha</span>
              <span className="font-semibold text-gray-800 mt-1">{formatDate(new Date(orderDetails.order_date))}</span>

              <span className="text-xs text-gray-500 uppercase">No. Tracking</span>
              <span className="font-semibold text-gray-800 mt-1">{orderDetails.tracking_number}</span>
            </div>

            <Accordion title="Contacto">
              <div className="px-4 text-sm space-y-2">
                <p className='text-gray-400'>Información</p>
                <p><span className="font-semibold">Nombre:</span> {orderDetails.customer_name}</p>
                <p><span className="font-semibold">Email:</span> {orderDetails.customer_email}</p>
                <p><span className="font-semibold">Teléfono:</span> {orderDetails.customer_phone}</p>
                <br/>
                <p className="text-gray-400">Dirección de envío:</p>
                <p> {orderDetails.shipping_address}</p>
              </div>
            </Accordion>
            <Accordion title="Resumen de Productos">
                <ul className="px-4 text-sm space-y-2">
                    {orderDetails.orderDetails.map(item => (
                        <li key={item.product.sku} className="flex gap-3 items-center">
                            <span>{item.quantity} x</span>
                            <div className="flex flex-col">
                              <span className="text-base">{item.product.name}</span>
                              <span className="text-xs text-gray-400">#{item.product.sku}</span>

                            </div>
                        </li>
                    ))}
                </ul>
            </Accordion>
          </div>

          <div className="p-6 border-t border-gray-200">
             <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-green-600">{formatCurrency(parseFloat(orderDetails.total))}</span>
             </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}