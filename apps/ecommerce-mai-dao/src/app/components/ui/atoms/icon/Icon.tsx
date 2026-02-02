import clsx from 'clsx';

import { ICONS } from './constants';

export interface IconProps {
  name: keyof typeof ICONS;
  size?: number;
  className?: string;
}

export function Icon({
  name,
  size = 12,
  className = '',
  ...props
}: IconProps) {
  const iconUrl = ICONS[name];

  if (!iconUrl) {
    console.error(`Icono no encontrado: "${name}". Por favor, verifica si el nombre es correcto y si ha sido exportado en el archivo 'constants.ts'.`);
    return null;
  }

  return (
    <img
      src={`${iconUrl}`}
      alt={`${name} icon`}
      width={`${size}px`}
      height={`${size}px`}
      className={clsx(`w-[${size}px] h-[${size}px]`, className)}
      {...props}
    />
  );
}