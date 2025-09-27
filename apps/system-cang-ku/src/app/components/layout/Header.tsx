'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Icon, Button } from "../ui";

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

function Header() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const date = new Date();
  const optionMonth: Intl.DateTimeFormatOptions = { month: 'long' };
  const month = date.toLocaleDateString('es-ES', optionMonth);

  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('user_info');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
    router.refresh();
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3 z-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 p-1 bg-red-600 rounded-md hover:bg-red-700 transition-colors">
          <Icon name='logo_white' size={42} />
        </Link>
        <span className="text-lg font-semibold text-gray-700">Welcome</span>
      </div>

      {userInfo && (
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium hidden sm:block">{formattedDate}</span>
          <div className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full font-bold text-gray-600">
            {getInitials(userInfo.name)}
          </div>
          <span className="text-gray-800 font-medium hidden sm:block">{userInfo.name}</span>
          <Button onClick={handleLogout} color="secondary" size="sm">
            Logout
          </Button>
        </div>
      )}
    </header>
  )
};

export default Header
