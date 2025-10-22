'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Accordion, Button, Card, Icon, Input, Toggle } from '@/app/components/ui';

import { apiFetch } from '@/app/api';
import { useLoading } from '@/app/contexts/useLoading';
import { useNotification } from '@/app/contexts/useNotification';
import { CategoryInterface } from '@/shared/types/category';
import { BannerInterface } from '../interface';

interface BannerFormProps {
  mode: 'create' | 'edit';
  bannerId?: number | string;
}

export function BannerForm({ mode, bannerId }: BannerFormProps) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();
  const { showNotification } = useNotification();

  // Estados del formulario
  const [name, setName] = useState('');
  const [seasonId, setSeasonId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(true);
  const [position, setPosition] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  
  // Estado para las opciones del selector
  const [seasons, setSeasons] = useState<CategoryInterface[]>([]);
  const [productCategories, setProductCategories] = useState<CategoryInterface[]>([]);

  const [targetCategoryCodes, setTargetCategoryCodes] = useState<string[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto para cargar las temporadas
  useEffect(() => {
    async function fetchCategories() {
      try {
        const allCategories: CategoryInterface[] = await apiFetch('/categories', { requiresAuth: true });
        setSeasons(allCategories.filter(c => c.type === 'season'));
        setProductCategories(allCategories.filter(c => c.type === 'category'));
      } catch (err) {
        console.error("Fallo al cargar las temporadas", err);
      }
    }
    fetchCategories();
  }, []);

  // Efecto para cargar los datos del banner en modo edición
  useEffect(() => {
    async function fetchBannerData() {
      if (mode === 'edit' && bannerId) {
        showLoader({ type: 'get' });
        try {
          const bannerData: BannerInterface = await apiFetch(`/banners/${bannerId}`, { requiresAuth: true });
          setName(bannerData.name);
          setSeasonId(bannerData.category_id || '');
          // Formatear fechas para los inputs type="date"
          setStartDate(new Date(bannerData.start_date).toISOString().split('T')[0]);
          setEndDate(new Date(bannerData.end_date).toISOString().split('T')[0]);
          setActive(bannerData.active);
          setPosition(bannerData.position);
          setImagePreview(bannerData.image_url);

          if (bannerData.target_filters_json) {
            setTargetCategoryCodes(bannerData.target_filters_json.category_codes || []);
            setHasDiscount(bannerData.target_filters_json.has_discount || false);
          }
        } catch (err) {
          showNotification({ type: 'error', message: 'No se pudo cargar el banner.' });
          router.push('/banners');
        } finally {
          hideLoader();
        }
      }
    }
    fetchBannerData();
  }, [mode, bannerId, router, showLoader, hideLoader, showNotification]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTargetCategoryToggle = (categoryId: string) => {
    setTargetCategoryCodes(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create' && !imageFile) {
      showNotification({ type: 'error', message: 'Debes seleccionar una imagen para el banner.' });
      return;
    }

    if (!seasonId && targetCategoryCodes.length === 0 && !hasDiscount) {
      showNotification({ type: 'error', message: 'El banner debe estar asociado al menos a una Temporada, Categoría de Producto o Filtro de Descuento.' });
      return;
    }

    showLoader({ type: 'changes' });
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category_id', seasonId);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('active', String(active));
      formData.append('position', String(position));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (targetCategoryCodes.length > 0 || hasDiscount) {
        const targetFilters = {
          category_codes: targetCategoryCodes,
          has_discount: hasDiscount,
        };
        formData.append('target_filters_json', JSON.stringify(targetFilters));
      } else {
        formData.append('target_filters_json', '');
      }

      const url = mode === 'create' ? '/banners' : `/banners/${bannerId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      await apiFetch(url, { method, body: formData, isFormData: true, requiresAuth: true });

      showNotification({ type: 'success', message: `Banner ${mode === 'create' ? 'creado' : 'actualizado'} con éxito.` });
      router.push('/banners');
      router.refresh();

    } catch (err: any) {
      showNotification({ type: 'error', message: err.message || 'Ocurrió un error.' });
    } finally {
      hideLoader();
    }
  };

  return (
    <Card className="bg-white max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" color="dark" onClick={() => router.push('/banners')} icon={<Icon name="arrowleft" size={22} />}>
          Atrás
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === 'create' ? 'Crear Nuevo Banner' : 'Editar Banner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nombre del Banner" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporada Asociada</label>
            <select value={seasonId} onChange={(e) => setSeasonId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Seleccionar temporada</option>
              {seasons.map(sea => <option key={sea.id} value={sea.id}>{sea.name}</option>)}
            </select>
          </div>
          <Input label="Fecha de Inicio" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="Fecha de Fin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          <Input label="Posición (orden)" type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))} required />
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Activo</label>
            <Toggle checked={active} onChange={setActive} />
          </div>
          <div className="flex items-center gap-4 pb-4">
            <label className="text-sm font-medium text-gray-700">Aplicar a productos con descuento:</label>
            <Toggle checked={hasDiscount} onChange={setHasDiscount} />
          </div>
        </div>
         <div className="p-4 pt-2 space-y-4">
            <label className="text-sm font-medium text-gray-700">Limitar a categorías de productos:</label>
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 overflow-y-auto p-2 border rounded-md bg-gray-50">
                {productCategories.length > 0 ? productCategories.map(cat => (
                  <label key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={targetCategoryCodes.includes(cat.id)}
                      onChange={() => handleTargetCategoryToggle(cat.id)}
                    />
                    <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
                  </label>
                )) : (
                  <p className="text-sm text-gray-500 col-span-full text-center">No hay categorías de productos disponibles.</p>
                )}
              </div>
            </div>
          </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Banner</label>
          <div 
            className="relative w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Vista previa del banner"
                fill
                className="rounded-lg" />
            ) : (
              <div className="text-center text-gray-500">
                <Icon name="upload" size={40} className="mx-auto" />
                <p>Haz clic para subir una imagen</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t pt-6 mt-8">
          <Button type="submit" color="danger">
            {mode === 'create' ? 'Crear Banner' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
