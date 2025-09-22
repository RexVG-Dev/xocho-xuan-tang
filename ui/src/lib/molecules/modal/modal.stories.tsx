import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent } from 'storybook/test';
import React from 'react';

import { Modal } from './modal';
import { borderTypes } from '../../atoms/card/constants';

const ModalControl = ({
  title,
  children,
  position,
  border,
}: {
  title?: string;
  children?: React.ReactNode;
  position?: 'center' | 'right';
  border?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Abrir Modal
      </button>
      <Modal
        title={title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position={position}
        border={border as keyof typeof borderTypes}
      >
        {children}
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Cerrar Modal
        </button>
      </Modal>
    </div>
  );
};

const meta = {
  component: Modal,
  title: 'Components/Modal',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    position: { control: 'radio', options: ['center', 'right'] },
    border: { control: 'select', options: Object.keys(borderTypes) },
    onClose: { action: 'onClose' },
    children: { control: 'text' },
  },
  args: {
    title: 'Modal Título',
    isOpen: true,
    children: 'Este es el contenido del modal.',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

export const Centered: Story = {
  args: {
    position: 'center',
    isOpen: true,
    border: borderTypes.none,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const modalTitle = await canvas.findByText('Modal Título');
    await expect(modalTitle).toBeInTheDocument();
  },
};

export const Right: Story = {
  args: {
    position: 'right',
    isOpen: true,
    title: 'Panel Lateral',
    border: borderTypes.none,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const modalTitle = await canvas.findByText('Panel Lateral');
    await expect(modalTitle).toBeInTheDocument();
  },
};

export const InitiallyClosed: Story = {
  args: {
    isOpen: false,
    title: 'Modal Cerrado',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // El modal no debe ser visible
    await expect(canvas.queryByText('Modal Cerrado')).not.toBeInTheDocument();
  },
};

export const Interactive: Story = {
  render: (args) => <ModalControl {...args} />,
  args: {
    title: 'Modal Interactivo',
    children: 'Este es un modal que se puede abrir y cerrar con botones.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Verificar que el modal está inicialmente cerrado
    const openModalButton = canvas.getByRole('button', { name: /Abrir Modal/i });
    await expect(canvas.queryByText('Modal Interactivo')).not.toBeInTheDocument();

    // 2. Abrir el modal haciendo clic en el botón
    await userEvent.click(openModalButton);
    const modalTitle = await canvas.findByText('Modal Interactivo');
    await expect(modalTitle).toBeInTheDocument();

    // 3. Cerrar el modal desde el botón interno
    const closeModalButton = await canvas.findByRole('button', { name: /Cerrar Modal/i });
    await userEvent.click(closeModalButton);
    await expect(modalTitle).not.toBeInTheDocument();
  },
};