"use client";

import { useState } from 'react';

import { apiRequest } from '../contexts/apiClient';
import { Button } from '../components/ui/atoms/button';

interface TrackingInfo {
  id: string;
  order_date: string;
  total: string;
  status: 'processing' | 'packing' | 'shipped' | 'delivered' | 'cancelled';
  customer_name: string;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const statusTranslations: Record<TrackingInfo['status'], string> = {
    processing: "Se encuentra en proceso",
    packing: "Está siendo empacado en nuestras bodegas",
    shipped: "Ha salido de la bodega, la paquetería llevará tu pedido a tu domicilio",
    delivered: "Ya se ha entregado en el domicilio proporcionado",
    cancelled: "Ha sido cancelada",
  };

  const handleTrackOrder = async () => {
    if (!process.env.NEXT_PUBLIC_API_KEY_PAYMENT) {
      setErrorMessage('La clave API no está configurada.');
      return;
    }

    try {
      const response = await apiRequest(`track/${trackingNumber}`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY_PAYMENT,
        },
      });

      if (response.message) {
        setErrorMessage(response.message);
        setTrackingInfo(null);
      } else {
        setTrackingInfo(response);
        setErrorMessage('');
      }
    } catch {
      setErrorMessage('Hubo un error al rastrear tu pedido. Por favor, intenta nuevamente.');
      setTrackingInfo(null);
    }
  };

  return (
    <div className="min-h-[500px] py-10 px-4 mt-14 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Dale seguimiento a tu pedido</h1>
      <input
        type="text"
        placeholder="Ingresa el No de pedido"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        className="border rounded-lg p-2 mb-4 w-full max-w-md"
      />
      <Button
        color="dark"
        onClick={handleTrackOrder}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Rastrear pedido
      </Button>

      {errorMessage && (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      )}

      {trackingInfo && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold mb-2">Hola {trackingInfo.customer_name}!</h2>
          <p className="mb-2">Tu pedido <strong>{trackingNumber}</strong>.</p>
          <p className="mb-4">{statusTranslations[trackingInfo.status]}</p>
          <p>Si necesitas mayor información contáctanos.</p>
        </div>
      )}
    </div>
  );
}
