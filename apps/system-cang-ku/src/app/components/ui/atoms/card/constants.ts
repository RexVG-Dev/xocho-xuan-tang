export const borderCardTypes = {
  none: 'none',
  error: 'error',
  success: 'success',
  warning: 'warning',
} as const;

export type BorderCardType = typeof borderCardTypes[keyof typeof borderCardTypes];
