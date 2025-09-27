'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Icon, IconProps } from '../icon';

interface NavItemProps {
  href: string;
  label: string;
  iconName: IconProps['name'];
  iconNameWhite: IconProps['name'];
}

export function NavItem({ href, label, iconName, iconNameWhite }: NavItemProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Un enlace se considera activo si la ruta actual es exactamente la misma
  const isActive = pathname === href;

  return (
    <li className="mb-2">
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          'flex items-center gap-4 p-3 rounded-none transition-colors duration-200',
          {
            'bg-red-600 text-white': isActive,
            'hover:bg-red-600 hover:text-white text-gray-600': !isActive,
          }
        )}
      >
        <Icon 
          name={isActive || isHovered ? iconNameWhite : iconName} 
          size={24} 
        />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
}
