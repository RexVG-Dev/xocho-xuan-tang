'use client';

import { useState, useEffect } from 'react';

import { apiFetch } from '@/app/api';
import { Card } from "@/app/components/ui";
import { formatCurrency } from '@/utils/numbers';
import { SummarySkeleton } from './summarySkeleton';

interface SummaryData {
  totalOrdersToday: number;
  totalSalesToday: number;
  pendingOrdersCount: number;
}

export function Summary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setIsLoading(true);
        const summaryData = await apiFetch('/summary', { requiresAuth: true });
        setData(summaryData);
      } catch (err) {
        setError('No se pudo cargar el resumen.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (isLoading) {
    return <SummarySkeleton />;
  }

  if (error || !data) {
    return (
      <Card title='Resumen'>
        <p className="text-red-500">{error || 'No hay datos disponibles.'}</p>
      </Card>
    );
  }

  return (
    <Card title="Resumen" className="bg-white">
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total de órdenes hoy:</span>
          <span className="font-semibold text-gray-800">{data.totalOrdersToday}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Órdenes pendientes:</span>
          <span className="font-semibold text-gray-800">{data.pendingOrdersCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total de ventas hoy:</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(data.totalSalesToday)}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default Summary
