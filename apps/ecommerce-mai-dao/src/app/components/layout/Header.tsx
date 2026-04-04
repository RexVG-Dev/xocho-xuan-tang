'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useStore } from '@/contexts/useStore';
import { useCategories } from '../../contexts/category.context';

import { Icon } from "../ui";
import { Button } from '../ui/atoms/button/Button';
import { IconButton } from '../ui/atoms/button/IconButton';

function Header() {
  const router = useRouter();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  const { cartCount } = useStore();
  const { categories, loading: isLoadingCategories } = useCategories();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 p-1 bg-red-600 rounded-md hover:bg-red-700 transition-colors">
          <Icon name='logo_white' size={42} />
        </Link>
        <span className="text-lg text-red-600 font-semibold">Xocho</span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <Link href="/listing?skip=0&take=20" className="hover:text-red-600 transition-colors">Novedades</Link>
        <Link href="/listing?has_discount=true&skip=0&take=20" className="hover:text-red-600 transition-colors">Ofertas</Link>
        <Link href="/listing?best-sellers=true&skip=0&take=20" className="hover:text-red-600 transition-colors">Lo + vendido</Link>
      </nav>

      <div className="hidden lg:flex flex-1 max-w-xl relative mx-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/listing?searchTerm=${encodeURIComponent(query)}`);
        }} className="flex w-full bg-gray-100 rounded-md overflow-hidden border border-transparent focus-within:border-gray-300 transition-colors">

          <Button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            color="primary"
            className="bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
            icon={<Icon name="down" size={16} />}
            iconButtonPosition="right"
          >
            Categorías
          </Button>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="flex-1 bg-transparent px-4 text-sm focus:outline-none placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton
            className="px-4 text-gray-400 hover:text-red-600 transition-colors"
            type="submit"
            icon={<Icon name="search" size={20} />}
            color="primary"
            variant="ghost"
          />
        </form>

        {isCategoryOpen && (
          <div className="absolute top-14 left-4 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
            {isLoadingCategories ? (
               <p className="px-4 py-2 text-sm text-gray-500">Cargando...</p>
            ) : categories.length > 0 ? (
                categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/listing?category=${encodeURIComponent(cat.slug)}&categoryId=${encodeURIComponent(cat.id)}`} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">No hay categorías</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/cart" className="relative group p-2">
          <Icon name="card" size={24} className="text-gray-700 group-hover:text-red-600 transition-colors" />

          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-200">
              {cartCount}
            </span>
          )}
        </Link>
        
        <IconButton
          className="md:hidden p-2 text-gray-700"
          icon={<Icon name="down" size={24} />}
          color="primary"
          variant="ghost"
          aria-label="Abrir menú"
        />
      </div>
    </header>
  )
};

export default Header