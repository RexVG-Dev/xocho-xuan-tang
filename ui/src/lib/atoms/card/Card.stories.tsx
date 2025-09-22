import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { borderTypes } from './constants'
import { expect } from 'storybook/test';

const meta = {
  component: Card,
  title: 'Card',
} satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof Card>;

const DEFAULT_ARGS = {
  title: 'Texting Card title',
  border: borderTypes.none,
  padding: false,
  rounded: false,
  className: '',
  children: '',
};

export const Primary = {
  args: { ...DEFAULT_ARGS },
} satisfies Story;

export const Heading = {
  args: {
    ...DEFAULT_ARGS,
    title: "Title",
    border: "warning",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Card/gi)).toBeTruthy();
  },
} satisfies Story;

export const WithClassName = {
  args: {
    ...DEFAULT_ARGS,
    title: 'Card with a custom class name',
    rounded: false,
    className: "bg-indigo-200 text-indigo-800 p-4 rounded-none",
  },
  play: async ({ canvasElement }) => {
    const cardElement = canvasElement.querySelector('.bg-indigo-200');
    await expect(cardElement).not.toBeNull();
  },
} satisfies Story;

export const WithChildren = {
  args: {
    ...DEFAULT_ARGS,
    title: 'Card with children',
    children: <div>This is some content inside the card.</div>,
    rounded: true,
    padding: true
  },
  play: async ({ canvasElement }) => {
    const childrenElement = canvasElement.querySelector('div');
    await expect(childrenElement).not.toBeNull();
    await expect(childrenElement?.textContent).toBe('This is some content inside the card.');
  },
} satisfies Story;
