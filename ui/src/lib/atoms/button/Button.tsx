import { ButtonHTMLAttributes, ReactNode, isValidElement } from 'react';
import clsx from 'clsx';

import {
  ButtonVariant,
  ButtonSize,
  ButtonColor,
  ButtonRounded,
  IconPosition,
  buttonVariants,
  buttonSizes,
  buttonColors,
  buttonRounded,
} from './constants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  rounded?: ButtonRounded;
  className?: string;
  iconPosition?: IconPosition;
  icon?: ReactNode;
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = buttonVariants.solid,
  size = buttonSizes.md,
  color = buttonColors.primary,
  rounded = buttonRounded.md,
  className = '',
  iconPosition = 'left',
  icon,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps ) {

  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    full: 'w-full py-2',
  };

  const colorClasses = {
    primary: {
      solid: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500',
      outline: 'bg-transparent text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50',
      ghost: 'bg-transparent text-indigo-500 hover:bg-indigo-50',
    },
    success: {
      solid: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
      outline: 'bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-50',
      ghost: 'bg-transparent text-green-500 hover:bg-green-50',
    },
    danger: {
      solid: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      outline: 'bg-transparent text-red-500 border-2 border-red-500 hover:bg-red-50',
      ghost: 'bg-transparent text-red-500 hover:bg-red-50',
    },
    secondary: {
      solid: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
      outline: 'bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-50',
      ghost: 'bg-transparent text-gray-500 hover:bg-gray-50',
    },
    none: {
      solid: '',
      outline: '',
      ghost: '',
    },
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const iconClasses = {
    left: 'mr-2',
    right: 'ml-2',
  };

  const styles = clsx(
    baseStyles,
    sizeClasses[size],
    colorClasses[color][variant],
    roundedClasses[rounded],
    {
      'flex-row-reverse': iconPosition === 'right',
      'opacity-50 cursor-not-allowed': disabled || isLoading,
    },
    className,
  );

  const spinnerColor = variant === 'solid' ? 'border-t-white' : 'border-t-current';
  const spinner = (
    <div className={clsx('h-5 w-5 border-2 rounded-full animate-spin', spinnerColor)}></div>
  );

  return (
    <button 
      {...props}
      className={styles}
      disabled={disabled || isLoading}
    >
      { isLoading ? (
        spinner
      ): (
        <>
          {icon && isValidElement(icon) && (
            <div className={clsx(iconClasses[iconPosition])}>
              {icon}
            </div>
          )}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
