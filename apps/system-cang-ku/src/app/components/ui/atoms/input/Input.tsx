import { InputHTMLAttributes, useState } from 'react';
import { clsx } from 'clsx';

import { Icon } from '../icon/Icon';
import { ICONS } from '../icon/constants';

export const inputSizes = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full',
} as const;
export type InputSize = typeof inputSizes[keyof typeof inputSizes];

export const inputColor = {
  primary: 'primary',
  secondary: 'secondary',
} as const;
export type InputColor = typeof inputColor[keyof typeof inputColor];

export const iconInputPositions = {
  left: 'left',
  right: 'right',
} as const;
export type IconInputPosition = typeof iconInputPositions[keyof typeof iconInputPositions];

export const labelPositions = {
  left: 'left',
  top: 'top',
} as const;
export type LabelPosition = typeof labelPositions[keyof typeof labelPositions];

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variantSize?: InputSize;
  color?: InputColor;
  className?: string;
  iconName?: keyof typeof ICONS;
  iconPosition?: IconInputPosition;
  error?: string;
  label?: string;
  helperText?: string;
  labelPosition?: LabelPosition;
}

export function Input({
  label,
  variantSize = inputSizes.md,
  color = inputColor.primary,
  iconName,
  iconPosition = iconInputPositions.left,
  error,
  helperText,
  className,
  labelPosition = labelPositions.top,
  ...props
}: InputProps) {
  const [value, setValue] = useState(props.value ?? '');

  const containerSizeClasses = {
    sm: 'w-48',
    md: 'w-72',
    lg: 'w-96',
    full: 'w-full',
  };

  const inputSizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-2.5 text-base',
    lg: 'p-4 text-lg',
    full: 'p-3 text-base',
  };

  const colorClasses = {
    primary: {
      default: 'bg-gray-100 focus:ring-gray-300',
      error: 'bg-gray-100 border border-red-500 focus:ring-red-500',
    },
    secondary: {
      default: 'bg-red-50 border border-red-200 focus:ring-red-400',
      error: 'bg-red-100 border border-red-500 focus:ring-red-500',
    }
  };

  const containerClasses = clsx(
    'flex',
    {
      'flex-col': labelPosition === 'top',
      'flex-row items-baseline gap-2': labelPosition === 'left',
    },
    containerSizeClasses[variantSize],
    className
  );

  const labelClasses = clsx(
    "font-medium",
    {
      "mb-1": labelPosition === 'top',
      "flex-shrink-0": labelPosition === 'left',
    }
  )

  const inputClasses = clsx(
    'w-full rounded-xl outline-none',
    inputSizeClasses[variantSize],
    colorClasses[color][error ? 'error' : 'default'],
    {
      'pl-10': iconName && iconPosition === 'left',
      'pr-10': iconName && iconPosition === 'right',
      'border-none': color === 'primary' && !error,
    }
  );

  const iconWrapperClasses = clsx(
    'absolute inset-y-0 flex items-center pl-3 pr-3 pointer-events-none',
    {
      'left-0': iconPosition === 'left',
      'right-0': iconPosition === 'right',
      'text-gray-400': color === 'primary',
      'text-red-500': color === 'secondary' || error,
    }
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>{label}</label>
      )}
      <div className="relative w-full">
        <div className='justify-center items-center relative'>
          <input
            className={inputClasses}
            value={value}
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              setValue(input.value);
              if (props.onChange) {
                props.onChange(e);
              }
            }}
            {...props}
          />
          {iconName && (
            <div className={iconWrapperClasses}>
              <Icon name={iconName} size={20} />
            </div>
          )}
        </div>
        <div>
          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>
        
      </div>
      
    </div>
  )
}

export default Input;
