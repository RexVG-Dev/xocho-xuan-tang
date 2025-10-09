'use client';

import { useRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { Button, Icon,IconButton } from '@/app/components/ui';
import { ProductFormState } from './productFormReducer';

interface ImageUploaderProps {
  images: ProductFormState['images'];
  dispatch: React.Dispatch<any>;
}

export function ImageUploader({ images, dispatch }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = [...images];
    let currentImageIndex = 0;

    // Llenar los slots vacíos con las nuevas imágenes
    for (let i = 0; i < files.length && currentImageIndex < newImages.length; i++) {
        // Encontrar el próximo slot vacío
        while(newImages[currentImageIndex] && newImages[currentImageIndex].file) {
            currentImageIndex++;
            if (currentImageIndex >= newImages.length) break;
        }

        if (currentImageIndex < newImages.length) {
            const file = files[i];
            newImages[currentImageIndex] = {
                file: file,
                url: URL.createObjectURL(file),
                isMain: false,
            };
        }
    }
    
    // Asegurarse de que siempre haya una imagen principal si hay al menos una imagen
    const hasMainImage = newImages.some(img => img.isMain);
    const firstImageIndex = newImages.findIndex(img => img.file);
    if (!hasMainImage && firstImageIndex !== -1) {
      newImages[firstImageIndex].isMain = true;
    }

    dispatch({ type: 'SET_IMAGES', images: newImages });
  };

  const handleSetMain = (indexToSet: number) => {
    dispatch({ type: 'SET_MAIN_IMAGE', index: indexToSet });
  };

  const handleRemoveImage = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_IMAGE', index: indexToRemove });
  };

  return (
    <div className='w-full text-center'>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        color="dark"
        onClick={() => fileInputRef.current?.click()}
      >
        Subir imágenes desde ordenador
      </Button>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => image.file && handleSetMain(index)}
            className={clsx(
              'relative aspect-square rounded-lg flex items-center justify-center bg-gray-100 border-2 overflow-hidden group',
              {
                'border-red-500 shadow-md': image.isMain,
                'border-dashed border-gray-300': !image.isMain,
                'cursor-pointer hover:border-red-300': image.file,
              }
            )}
          >
            {image.url ? (
              <>
                <Image
                  src={image.url}
                  alt={`Vista previa ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {/*
                  * Todo: Verificar si boton se coloca abajo para mobile
                */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    type="button"
                    size="sm"
                    color="danger"
                    rounded="full"
                    onClick={(e) => handleRemoveImage(e, index)}
                    icon={<Icon name="remove_white" size={16} />}
                  />
                </div>
              </>
            ) : (
              <Icon name="image" size={50} className="text-gray-400" />
            )}
            
            {/* Indicador de imagen principal */}
            {image.isMain && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-75 text-white text-xs text-center py-1 font-semibold">
                Principal
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
