import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon, IconProps } from './Icon';

import * as AllIcons from '../../../assets/icons';

const meta: Meta<IconProps> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: Object.keys(AllIcons).map(key => key.replace(/Icon$/, '').toLowerCase()),
      description: 'The name of the icon to display. It should match the file name.',
    },
    size: {
      control: { type: 'number', min: 16, max: 128, step: 2 },
      description: 'The size of the icon in pixels.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for custom styling, like text color, hover effects, etc.',
    },
  },
};

export default meta;

type Story = StoryObj<IconProps>;

export const Default: Story = {
  args: {
    name: 'add',
    size: 24,
  },
};

export const Colored: Story = {
  args: {
    name: "add",
    size: 20,
    className: 'text-green-500',
  },
};


export const Hoverable: Story = {
  args: {
    name: 'down',
    size: 22,
    className: 'text-red-500 hover:text-red-700',
  },
};