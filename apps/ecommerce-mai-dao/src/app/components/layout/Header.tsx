'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Icon } from "../ui";
import { useStore } from '@/contexts/useStore';
import { useInitialData } from '@/contexts/useInitialData';

function Header() {
  const router = useRouter();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  // Consumimos los datos de los contextos
  const { cartCount } = useStore();
  const { categories, isLoadingCategories } = useInitialData();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 p-1 bg-red-600 rounded-md hover:bg-red-700 transition-colors">
          <Icon name='logo_white' size={42} />
        </Link>
        <span className="text-lg text-red-600 font-semibold text-gray-700">Xocho</span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <Link href="/listing?filter=novedades" className="hover:text-red-600 transition-colors">Novedades</Link>
        <Link href="/listing?filter=ofertas" className="hover:text-red-600 transition-colors">Ofertas</Link>
        <Link href="/listing?filter=masvendido" className="hover:text-red-600 transition-colors">Lo + vendido</Link>
      </nav>

      <div className="hidden lg:flex flex-1 max-w-xl relative mx-4">
        <form onSubmit={(e) => { e.preventDefault(); router.push(`/listing?query=${encodeURIComponent(query)}`); }} className="flex w-full bg-gray-100 rounded-md overflow-hidden border border-transparent focus-within:border-gray-300 transition-colors">

          {/* Dropdown Toggle */}
          <button 
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="bg-red-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            Categorías
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {/* Input Search */}
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="flex-1 bg-transparent px-4 text-sm focus:outline-none placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="px-4 text-gray-400 hover:text-red-600 transition-colors" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </form>

        {/* Menú Desplegable de Categorías Dinámico */}
        {isCategoryOpen && (
          <div className="absolute top-14 left-4 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
            {isLoadingCategories ? (
               <p className="px-4 py-2 text-sm text-gray-500">Cargando...</p>
            ) : categories.length > 0 ? (
                categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/listing?category=${encodeURIComponent(cat.slug)}`} 
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 group-hover:text-red-600 transition-colors">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          
          {/* Badge Dinámico del Carrito */}
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-200">
              {cartCount}
            </span>
          )}
        </Link>
        
        <button className="md:hidden p-2 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </header>
  )
};

export default Header