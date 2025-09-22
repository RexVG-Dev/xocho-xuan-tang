import type { Meta, StoryObj } from '@storybook/react';

import { Input, type InputProps, inputSizes, inputColor } from './Input';
import { ICONS } from '../icon/constants';

const meta: Meta<InputProps> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Etiqueta del input',
    },
    labelPosition: {
      control: 'radio',
      options: ['top', 'left'],
    },
    variantSize: {
      control: 'radio',
      options: Object.values(inputSizes),
      description: 'Tamaño del input',
    },
    color: {
      control: 'radio',
      options: Object.values(inputColor),
      description: 'Tema de color del input',
    },
    iconName: {
      control: 'select',
      options: Object.keys(ICONS),
      description: 'Nombre del icono a mostrar',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    error: {
      control: 'text',
      description: 'Mensaje de error para el input',
    },
    helperText: {
      control: 'text',
      description: 'Texto de ayuda para el input',
    },
    className: {
      control: 'text',
      description: 'Clases personalizadas de Tailwind',
    },
  },
};

export default meta;

type Story = StoryObj<InputProps>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder por defecto',
  },
};

export const WithLabelAndHelperText: Story = {
  args: {
    label: 'Nombre de usuario',
    placeholder: 'Introduce tu nombre de usuario',
    helperText: 'El nombre de usuario debe ser único.',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'email@dominio.com',
    iconName: 'add',
  },
};

export const WithError: Story = {
  args: {
    label: 'Contraseña',
    placeholder: 'Introduce tu contraseña',
    error: 'La contraseña debe tener al menos 8 caracteres.',
  },
};
