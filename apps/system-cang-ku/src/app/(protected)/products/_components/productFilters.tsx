// Este componente contendrá todos los controles de filtro
import { CategoryInterface } from '@/shared/types/category';
import { 
  // Select, TODO Crear componente Select
  Button,
  Input
} from '@/app/components/ui';

import { DiscountStatus } from '../constants';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: CategoryInterface[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  seasons: CategoryInterface[];
  selectedSeason: string;
  onSeasonChange: (value: string) => void;
  discountStatus: DiscountStatus;
  onDiscountChange: (value: DiscountStatus) => void;
}

export function ProductFilters(
  {
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  seasons,
  selectedSeason,
  onSeasonChange,
  discountStatus,
  onDiscountChange,
}: ProductFiltersProps
) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Título y Botón de Crear */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de productos</h1>
          <div className="flex md:hidden gap-2">
            <Button color="dark" size='sm' variant="outline">
              Carga masiva
            </Button>
            <Button color="danger">
              + Crear nuevo
            </Button>
          </div>
        </div>
        
        {/* Acciones Superiores */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Button color="dark" variant="outline" className="hidden md:flex">
            Carga masiva de productos
          </Button>
          <Button color="danger" className="hidden md:flex">
            + Crear nuevo producto
          </Button>
          <div>
            <Input 
              placeholder="Buscar..."
              iconName="search"
              iconPosition="right"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              // El icono se podría añadir como prop en tu componente Input
            />
          </div>
        </div>
      </div>

      {/* Controles de Filtro */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Filtrar por</span>
        <div className="w-full md:w-48">
          {/* Este será un componente Select de tu librería de UI */}
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Categoría</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
          >
            <option value="">Temporada</option>
            {seasons.map(sea => <option key={sea.id} value={sea.code}>{sea.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size='sm'
            color="danger"
            variant={discountStatus === 'with' ? 'solid' : 'outline'}
            onClick={() => onDiscountChange('with')}
          >
            Con descuento
          </Button>

          <Button
            size='sm'
            color="danger"
            variant={discountStatus === 'without' ? 'solid' : 'outline'}
            onClick={() => onDiscountChange('without')}
          >
            Sin descuento
          </Button>

          <Button
            size='sm'
            color="danger"
            variant={discountStatus === 'all' ? 'solid' : 'outline'}
            onClick={() => onDiscountChange('all')}
          >
            Todos
          </Button>
        </div>
      </div>
    </div>
  );
}
