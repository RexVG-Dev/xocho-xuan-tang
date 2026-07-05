"use client";
import { useMemo } from 'react';
import Carousel from '../ui/organisms/carousel/carousel';
import Image from 'next/image';
import { Button } from '../ui/atoms/button';
import { useCategories } from '../../contexts/category.context';

interface Category {
  name: string;
  description: string;
  image: string;
  categoryId: string;
  code: string;
}

const categories: Category[] = [
  {
    name: 'Electrónica',
    description: 'Entra a nuestra sección de electrónica y encuentra todo que necesitas.',
    image: '/assets/categories/technology.png',
    categoryId: '',
    code: 'electronics',
  },
  {
    name: 'Cocina',
    description: 'Entra a nuestra sección de cocina y encuentra todo que necesitas.',
    image: '/assets/categories/kitchen.png',
    categoryId: '',
    code: 'kitchen',
  },
  {
    name: 'Cosméticos',
    description: 'Entra a nuestra sección de cosméticos y encuentra todo que necesitas.',
    image: '/assets/categories/makeup.png',
    categoryId: '',
    code: 'makeup',
  },
  {
    name: 'Papelería',
    description: 'Entra a nuestra sección de papelería y encuentra todo que necesitas.',
    image: '/assets/categories/stationery.png',
    categoryId: '',
    code: 'stationery',
  },
  {
    name: 'Herramientas',
    description: 'Entra a nuestra sección de herramientas y encuentra todo que necesitas.',
    image: '/assets/categories/tools.png',
    categoryId: '',
    code: 'tools',
  },
];

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function CategoryCarousel() {
  const { categories: fetchedCategories } = useCategories();

  const categoriesWithResolvedId = useMemo(() => {
    return categories.map((staticCategory) => {
      const match = fetchedCategories.find(
        (apiCategory) =>
          normalizeText(apiCategory.code) === normalizeText(staticCategory.code)
      );

      return {
        ...staticCategory,
        categoryId: match?.id || '',
      };
    });
  }, [fetchedCategories]);

  return (
    <section className="mt-12 rounded-3xl py-12">
      <div className='max-w-5xl mx-auto px-4'>
        <h2 className="text-3xl font-extrabold text-center mb-16">Categorías destacadas</h2>
        <Carousel slidesPerView={2} showArrows={true} showDots={true} loop>
          {categoriesWithResolvedId.map((cat, idx) => (
            <div
              key={idx}
              className="bg-red-600 rounded-3xl p-6 mx-6 flex items-center relative min-h-[250px] max-h-[250px] overflow-visible"
            >
              <div className="w-1/2">
                <h2 className="text-white font-bold text-2xl mb-2">{cat.name}</h2>
                <p className="text-white text-sm mb-4">{cat.description}</p>
                <Button
                  color="none"
                  variant="solid"
                  rounded="full"
                  className="bg-white text-red-600 font-semibold text-base px-8 py-3"
                  disabled={!cat.categoryId}
                  onClick={e => {
                    e.stopPropagation();
                    window.location.href = `/listing?category=${encodeURIComponent(cat.name)}&categoryId=${encodeURIComponent(cat.categoryId)}`;
                  }}
                >
                  Ver más
                </Button>
              </div>
              <div className="w-1/2 flex justify-end items-end relative">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={220}
                  height={180}
                  className="object-contain drop-shadow-xl"
                  style={{transform: 'translateY(40px)'}}
                  priority
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
    
  );
}
