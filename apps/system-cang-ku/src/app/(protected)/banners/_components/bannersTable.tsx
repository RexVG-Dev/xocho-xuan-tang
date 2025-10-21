'use client';

import Image from 'next/image';
import { IconButton, Icon } from '@/app/components/ui';
import { Toggle } from '@/app/components/ui/atoms/toggle';
import { formatDate } from '@/utils/dates';
import { BannerInterface } from '../interface';

interface BannersTableProps {
  banners: BannerInterface[];
  onToggleActive: (bannerId: number, newStatus: boolean) => void;
  onEdit: (bannerId: number) => void;
  onDelete: (bannerId: number) => void;
}

export function BannersTable({ banners, onToggleActive, onEdit, onDelete }: BannersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">Imagen</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Temporada Asociada</th>
            <th scope="col" className="px-4 py-3">Vigencia</th>
            <th scope="col" className="px-4 py-3">Activo</th>
            <th scope="col" className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="relative w-[200px] h-[75px]">
                  <Image
                    src={banner.image_url || '/placeholder.png'}
                    alt={banner.name}
                    fill
                    className="rounded-sm object-cover bg-gray-100" // 3. Mantenemos object-cover para que no se deforme
                  />
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">{banner.name}</td>
              <td className="px-4 py-3">{banner.category?.name || 'N/A'}</td>
              <td className="px-4 py-3">
                {formatDate(new Date(banner.start_date))} - {formatDate(new Date(banner.end_date))}
              </td>
              <td className="px-4 py-3">
                <Toggle
                  checked={banner.active}
                  onChange={(newStatus: any) => onToggleActive(banner.id, newStatus)}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2 items-center">
                  <IconButton onClick={() => onEdit(banner.id)} color="dark" rounded="md" size="xs" icon={<Icon name="edit_white" size={20} />} />
                  <IconButton onClick={() => onDelete(banner.id)} color="danger" rounded="md" size="xs" icon={<Icon name="delete_white" size={20} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
