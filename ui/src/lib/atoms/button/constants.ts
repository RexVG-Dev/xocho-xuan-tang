export const buttonVariants = {
  solid: 'solid',
  outline: 'outline',
  ghost: 'ghost',
} as const;
export type ButtonVariant = typeof buttonVariants[keyof typeof buttonVariants];

export const buttonSizes = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full',
} as const;
export type ButtonSize = typeof buttonSizes[keyof typeof buttonSizes];

export type IconButtonSize = Exclude<ButtonSize, 'full'>;
export const iconButtonSizes: Record<IconButtonSize, string> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export const buttonColors = {
  primary: 'primary',
  success: 'success',
  danger: 'danger',
  secondary: 'secondary',
  none: 'none',
} as const;
export type ButtonColor = typeof buttonColors[keyof typeof buttonColors];

export const buttonRounded = {
  none: 'none',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full',
} as const;
export type ButtonRounded = typeof buttonRounded[keyof typeof buttonRounded];

export const iconPositions = ['left', 'right'] as const;
export type IconPosition = (typeof iconPositions)[number];
