import { ButtonHTMLAttributes, ReactNode, isValidElement } from 'react';
import clsx from 'clsx';

import {
  ButtonVariant,
  IconButtonSize,
  ButtonColor,
  ButtonRounded,
  buttonVariants,
  iconButtonSizes,
  buttonColors,
  buttonRounded,
} from './constants';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: IconButtonSize;
  color?: ButtonColor;
  rounded?: ButtonRounded;
  className?: string;
  icon?: ReactNode;
  isLoading?: boolean;
};

export function IconButton({
  variant = buttonVariants.solid,
  size = iconButtonSizes.md as IconButtonSize,
  color = buttonColors.primary,
  rounded = buttonRounded.full,
  className = '',
  icon,
  isLoading = false,
  disabled,
  children,
  ...props
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 active:border-none';

  const sizeClasses = {
    xs: 'p-1 text-xs',
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  }

  const colorClasses = {
    primary: {
      solid: 'bg-indigo-500 text-white hover:bg-indigo-600',
      outline: 'bg-transparent text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50',
      ghost: 'bg-transparent text-indigo-500 hover:bg-indigo-50',
    },
    success: {
      solid: 'bg-green-500 text-white hover:bg-green-600',
      outline: 'bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-50',
      ghost: 'bg-transparent text-green-500 hover:bg-green-50',
    },
    danger: {
      solid: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'bg-transparent text-red-500 border-2 border-red-500 hover:bg-red-50',
      ghost: 'bg-transparent text-red-500 hover:bg-red-50',
    },
    secondary: {
      solid: 'bg-gray-500 text-white hover:bg-gray-600',
      outline: 'bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-50',
      ghost: 'bg-transparent text-gray-500 hover:bg-gray-50',
    },
    dark: {
      solid: 'bg-black text-white hover:bg-gray-900',
      outline: 'bg-transparent text-black border-2 border-black hover:bg-gray-100',
      ghost: 'bg-transparent text-black hover:bg-gray-100',
    },
    light: {
      solid: 'bg-[#F4F4F2] text-black hover:bg-gray-200',
      outline: 'bg-transparent text-black border-2 border-[#F4F4F2] hover:bg-[#F4F4F2]',
      ghost: 'bg-transparent text-black hover:bg-[#F4F4F2]',
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

  const styles = clsx(
    baseStyles,
    sizeClasses[size],
    colorClasses[color][variant],
    roundedClasses[rounded],
    {
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
      {isLoading 
        ? spinner : 
        (isValidElement(icon) 
          ? icon 
          : null
        )
      }
      { children && <span>{children}</span>}
    </button>
  )
}