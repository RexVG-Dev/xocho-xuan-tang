import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from './IconButton';

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.707-5.707a1 1 0 011.414 0L10 14.586l1.879-1.879a1 1 0 111.414 1.414l-2.5 2.5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const meta = {
  component: IconButton,
  tags: ['autodocs'],
  title: 'IconButton',
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['xs','sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'danger', 'secondary', 'none'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <DownloadIcon />,
  },
};


export const Loading: Story = {
  args: {
    icon: <CheckIcon />,
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: <DownloadIcon />,
    disabled: true,
  },
};
