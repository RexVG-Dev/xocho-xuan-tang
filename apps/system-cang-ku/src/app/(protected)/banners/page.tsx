'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/app/api';
import { Button, Card } from '@/app/components/ui';
import { useLoading } from '@/app/contexts/useLoading';
import { BannersTable } from './_components/bannersTable';

import { BannerInterface } from './interface';

export function Banners() {
  const [banners, setBanners] = useState<BannerInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();

  const handleToggle = (id: number, status: boolean) => console.log(`Toggle banner ${id} to ${status}`);
  const handleEdit = (id: number) => console.log(`Edit banner ${id}`);
  const handleDelete = (id: number) => console.log(`Delete banner ${id}`);
  const handleCreate = () => router.push('/banners/new');

  useEffect(() => {
    async function fetchBanners() {
      showLoader({type:'get'});
      try {
        const data: BannerInterface[] = await apiFetch('/banners', { requiresAuth: true });
        setBanners(data);
      } catch (err) {
        setError('No se pudieron cargar los banners.');
        console.error(err);
      } finally {
        hideLoader();
      }
    }
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Card title="Gestión de Banners" className="bg-white">
        <p className="text-center text-red-500 py-10">{error}</p>
      </Card>
    );
  }

  return (
    <Card title="Gestión de Banners" className="bg-white">
      <div className="flex justify-end mb-6">
        <Button color="danger" onClick={handleCreate}>
          + Crear nuevo banner
        </Button>
      </div>
      
      <BannersTable
        banners={banners}
        onToggleActive={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Card>
  );
}
export default Banners