import Carousel from '../ui/organisms/carousel/carousel';
import Image from 'next/image';
import { Button } from '../ui/atoms/button';
import Link from 'next/link';

interface Category {
  name: string;
  description: string;
  image: string;
  categoryId: string;
}

const categories: Category[] = [
  {
    name: 'Accesorios',
    description: 'Entra a nuestra sección de Accesorios y encuentra todo que necesitas.',
    image: '/assets/categories/technology.png',
    categoryId: '52f9bf22-0316-407f-9be7-27dd2966d4cc'
  },
  {
    name: 'Cocina',
    description: 'Entra a nuestra sección de cocina y encuentra todo que necesitas.',
    image: '/assets/categories/kitchen.png',
    categoryId: '898b4b39-ac46-47bc-996f-58010577c84d'
  },
  {
    name: 'Cosméticos',
    description: 'Entra a nuestra sección de cosméticos y encuentra todo que necesitas.',
    image: '/assets/categories/makeup.png',
    categoryId: 'ec6e85e3-df75-48b6-b830-13ad453ba394'
  },
  {
    name: 'Papelería',
    description: 'Entra a nuestra sección de papelería y encuentra todo que necesitas.',
    image: '/assets/categories/stationery.png',
    categoryId: '560ea695-b157-459d-84fe-71ba7a52fd75'
  },
  {
    name: 'Herramientas',
    description: 'Entra a nuestra sección de herramientas y encuentra todo que necesitas.',
    image: '/assets/categories/tools.png',
    categoryId: '832b118f-d6c3-4dca-91a7-765a39d1a01e'
  },
];

export default function CategoryCarousel() {
  return (
    <section className="mt-12 rounded-3xl py-12">
      <div className='max-w-5xl mx-auto px-4'>
        <h2 className="text-3xl font-extrabold text-center mb-16">Categorías destacadas</h2>
        <Carousel slidesPerView={2} showArrows={true} showDots={true} loop>
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-red-600 rounded-3xl p-6 mx-6 flex items-center relative min-h-[250px] max-h-[250px] overflow-visible"
            >
              <div className="w-1/2">
                <h2 className="text-white font-bold text-2xl mb-2">{cat.name}</h2>
                <p className="text-white text-sm mb-4">{cat.description}</p>
                <Link
                  href={`/listing?category=${encodeURIComponent(cat.name)}&categoryId=${encodeURIComponent(cat.categoryId)}`}
                  passHref
                >
                  <Button
                    color="none"
                    variant="solid"
                    rounded="full"
                    className="bg-white text-red-600 font-semibold text-base px-8 py-3"
                  >
                    Ver más
                  </Button>
                </Link>
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
