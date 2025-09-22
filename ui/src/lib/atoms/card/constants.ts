export const borderTypes = {
  none: 'none',
  error: 'error',
  success: 'success',
  warning: 'warning',
} as const;

export type BorderType = typeof borderTypes[keyof typeof borderTypes];

