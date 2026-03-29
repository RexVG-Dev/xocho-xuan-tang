
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '../../atoms';

export interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  onAdd: () => void;
}


export const ProductCard: React.FC<ProductCardProps> = ({ id, image, title, price, onAdd }) => {
  const router = useRouter();
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    router.push(`/product/${id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md flex flex-col p-4 h-full transition hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full aspect-square flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-white border border-gray-100">
        <img src={image} alt={title} className="object-contain w-full h-full" />
      </div>
      <h2 className="text-sm font-medium text-gray-900 mb-2 text-center truncate w-full" title={title}>{title}</h2>
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-xl font-bold text-gray-900">${price.toFixed(2)}</span>
        <Button
          size="xs"
          color="dark"
          icon={<Icon name="card_white" size={16} />}
          onClick={onAdd}
          className="w-full"
        >
          Añadir
        </Button>
      </div>
    </div>
  );
};
