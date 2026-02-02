'use client';

import Link from 'next/link';

import { useInitialData } from '@/contexts/useInitialData';

import { Icon } from "../ui";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { categories } = useInitialData();

  // Mostramos solo las primeras 6 categorías para no saturar el footer
  const footerCategories = categories.slice(0, 6);

  return (
    <footer className="bg-red-600 text-white pt-16 pb-8 mt-auto">
      <div className="w-full px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Columna 1 */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/dashboard" className="flex items-center gap-3 p-1 bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                <Icon name='logo_white' size={42} />
              </Link>
              <span className="text-lg text-neutral-100 font-semibold text-gray-700">Xocho</span>
            </div>
            {footerCategories.length > 0 ? (
                <div>
                  <h4 className="font-bold text-lg mb-4 text-yellow-300">Nuestras categorías</h4>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-red-100">
                    {
                      footerCategories.map((cat) => (
                        <li key={cat.id}>
                          <Link href={`/categoria/${cat.slug}`} className="hover:text-white transition-colors">
                            {cat.name}
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ) : null
            }
          </div>

          {/* Columna 2 */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-4 text-yellow-300">Visita nuestras sucursales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-red-100">
              <div className="flex gap-3">
                <svg className="flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="font-bold text-white">Sucursal Palmas</p>
                  <p>Av. Las Palmas 1245, Col. Calesa</p>
                  <p>Santiago de Querétaro, Qro. 76190</p>
                </div>
              </div>
              <div className="flex gap-3">
                <svg className="flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="font-bold text-white">Sucursal Zaragoza</p>
                  <p>Prolongación Zaragoza Sur 1500</p>
                  <p>Col. Centro Sur, Querétaro. 76190</p>
                </div>
              </div>
              <div className="flex gap-3">
                <svg className="flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="font-bold text-white">Sucursal Campanario</p>
                  <p>Calle Fuente de los Arcos 78</p>
                  <p>Col. El Campanario, Querétaro, Qro. 76146</p>
                </div>
              </div>
              <div className="flex gap-3">
                <svg className="flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="font-bold text-white">Sucursal Juriquilla</p>
                  <p>Calle Flor de Lis 45,</p>
                  <p>Col. Juriquilla, Querétaro, Qro. 76230</p>
                </div>
              </div>
              <div className="flex gap-3">
                <svg className="flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className="font-bold text-white">Sucursal Real de Minas</p>
                  <p>Circuito Real de Minas 230</p>
                  <p>Col. Milenio III, Querétaro, Qro. 76060</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 3 */}
          <div className="lg:col-span-1">
             <h4 className="font-bold text-lg mb-4 text-yellow-300">Contacto</h4>
             <div className="space-y-3 text-sm text-red-100 mb-8">
                <p className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 22 16.92z"/></svg>
                  442 234 5678
                </p>
                <p className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  contacto@xocho.com
                </p>
             </div>
          </div>
        </div>

        <div className="border-t border-red-500 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-red-200">
          <p>© Todos los derechos reservados.</p>
          <p>Xocho Cosmetics Querétaro {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;