'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/app/api';
import { Button, Card } from '@/app/components/ui';
import { ConfirmationModal } from '@/app/components/ui/organisms';
import { useLoading } from '@/app/contexts/useLoading';
import { useNotification } from '@/app/contexts/useNotification';
import { BannersTable } from './_components/bannersTable';

import { BannerInterface } from './interface';

export function Banners() {
  const [banners, setBanners] = useState<BannerInterface[]>([]);
  const [deletingBanner, setDeletingBanner] = useState<BannerInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showLoader, hideLoader, isLoading } = useLoading();
  const { showNotification } = useNotification();

  const handleCreate = () => router.push('/banners/new');
  const handleEdit = (id: number) => router.push(`/banners/edit/${id}`);


  const handleToggle = async (bannerId: number, newStatus: boolean) => {
    setBanners(currentBanners => 
      currentBanners.map(b => b.id === bannerId ? { ...b, active: newStatus } : b)
    );

    try {
      const formData = new FormData();
      formData.append('active', String(newStatus));

      await apiFetch(`/banners/${bannerId}`, {
        method: 'PUT',
        body: formData,
        isFormData: true,
        requiresAuth: true,
      });
      showNotification({ type: 'success', message: 'Estado del banner actualizado.' });
    } catch (err) {
      showNotification({ type: 'error', message: 'No se pudo actualizar el estado.' });
      // Revertir el cambio en la UI si la API falla
      setBanners(currentBanners => 
        currentBanners.map(b => b.id === bannerId ? { ...b, active: !newStatus } : b)
      );
    }
  };
  const handleDeleteClick = (banner: BannerInterface) => {
    setDeletingBanner(banner);
  };
  
  const handleConfirmDelete = async () => {
    if (!deletingBanner) return;

    showLoader({ type: 'delete' });
    try {
      await apiFetch(`/banners/${deletingBanner.id}`, {
        method: 'DELETE',
        requiresAuth: true,
      });

      setBanners(prev => prev.filter(b => b.id !== deletingBanner.id));
      showNotification({ type: 'success', message: `Banner "${deletingBanner.name}" eliminado.` });

    } catch (err) {
      console.error("Fallo al eliminar el banner", err);
      showNotification({ type: 'error' });
    } finally {
      setDeletingBanner(null);
      hideLoader();
    }
  };

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
        onDelete={(bannerId) => {
          const bannerToDelete = banners.find(b => b.id === bannerId);
          if (bannerToDelete) handleDeleteClick(bannerToDelete);
        }}
      />

      {deletingBanner && (
        <ConfirmationModal
          isOpen={!!deletingBanner}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que quieres eliminar permanentemente el banner "${deletingBanner.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBanner(null)}
          isLoading={isLoading}
          confirmText="Eliminar"
        />
      )}
    </Card>
  );
}

export default Banners
