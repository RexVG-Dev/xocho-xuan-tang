import { ReactNode } from 'react';
import clsx from 'clsx';

import { BorderCardType, borderCardTypes } from './constants.js';

export interface CardInterface {
  title?: string;
  border?: BorderCardType;
  padding?: boolean;
  rounded?: boolean;
  className?: string;
  children: ReactNode;
};

export function Card(
  {
    title,
    border = borderCardTypes.none,
    padding = true,
    rounded = true,
    className = '',
    children
  }: CardInterface
) {
  const cardStylesProps = clsx( 'shadow-lg', {
      'border-4': border !== 'none',
      'border-red-500': border === 'error',
      'border-green-500': border === 'success',
      'border-yellow-400': border === 'warning',
    },
    { 'p-6': padding },
    { 'rounded-xl': rounded },
    className
  );

  const titleClasses = clsx(
    'text-gray-800 text-lg font-semibold mb-4',
  );

  return (
    <div className={cardStylesProps}>
      {title && (
        <div className={titleClasses}>
          {title}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export default Card;
