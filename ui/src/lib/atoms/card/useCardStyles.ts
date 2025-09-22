import { useMemo } from 'react';
import clsx from 'clsx';

import { BorderType, borderTypes } from './constants.js';

interface CardStylesProps {
  border?: BorderType;
  padding?: boolean;
  rounded?: boolean;
  className?: string;
}

export const useCardStyles = ({
  border = 'none',
  padding = true,
  rounded = true,
  className = '',
}: CardStylesProps) => {

  const cardStyles = useMemo(() => {

    const borderClasses =clsx({
      'border-0': border === borderTypes.none,
      'border-2 border-red-500': border === borderTypes.error,
      'border-2 border-green-500': border === borderTypes.success,
      'border-2 border-orange-500': border === borderTypes.warning,
    })

    const roundedClass = clsx({
      'rounded-xl': rounded,
    });

    const paddingClass = clsx({
      'p-6': padding,
      'p-0': !padding,
    });

    return clsx('bg-white shadow-lg', borderClasses, paddingClass, roundedClass, className);

  }, [border, padding, rounded, className]);

  const titleClasses = 'text-gray-800 text-lg font-semibold mb-4';

  return { cardStyles, titleClasses };
}