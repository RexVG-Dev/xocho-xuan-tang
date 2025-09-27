'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '../ui';

function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');

    router.push('/login');
    router.refresh(); 
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4"><Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
          <li className="mb-4"><Link href="/products" className="hover:text-gray-300">Productos</Link></li>
          <li className="mb-4"><Link href="/orders" className="hover:text-gray-300">Órdenes</Link></li>
          <li className="mb-4"><Link href="/banners" className="hover:text-gray-300">Banners</Link></li>
        </ul>
      </nav>
      <Button onClick={handleLogout} color="danger">
        Cerrar Sesión
      </Button>
    </aside>
  )
}
export default Sidebar