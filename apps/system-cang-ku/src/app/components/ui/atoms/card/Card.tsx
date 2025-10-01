import { ReactNode, forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

import { BorderCardType, borderCardTypes } from './constants.js';
export interface CardInterface extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  border?: BorderCardType;
  padding?: boolean;
  rounded?: boolean;
  className?: string;
  children: ReactNode;
};

export const Card = forwardRef<HTMLDivElement, CardInterface>( function Card(
  {
    title,
    border = borderCardTypes.none,
    padding = true,
    rounded = true,
    className = '',
    children,
    ...props
  },
  ref
){
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
    <div ref={ref} className={cardStylesProps} {...props}>
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
});

Card.displayName = 'Card';
