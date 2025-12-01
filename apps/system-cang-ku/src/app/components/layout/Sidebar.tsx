'use client';

import { useRouter } from 'next/navigation';

import { Button, NavItem } from '../ui';

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');

    router.push('/login');
    router.refresh(); 
  };

  return (
    <aside className="w-64 min-w-64 bg-white text-gray-800 pt-10 pb-20 px-4 mt-16 flex flex-col border-r border-gray-200">

      <div className="px-3 mb-6">
        <h3 className="text-2xl text-black font-bold text-gray-600 uppercase tracking-wider">
          Menú
        </h3>
      </div>
      
      <nav className="flex-grow">
        <ul>
          <NavItem 
            href="/dashboard" 
            label="Inicio" 
            iconName="home" 
            iconNameWhite="home_white" 
          />
          <NavItem 
            href="/products" 
            label="Productos" 
            iconName="packing" 
            iconNameWhite="packing_white" 
          />
          <NavItem 
            href="/banners" 
            label="Banners" 
            iconName="upload" 
            iconNameWhite="upload_white" 
          />
          <NavItem 
            href="/orders" 
            label="Órdenes" 
            iconName="orders" 
            iconNameWhite="orders_white" 
          />
        </ul>
      </nav>

      <Button onClick={handleLogout} color="dark">
        Salir
      </Button>
    </aside>
  )
}
export default Sidebar