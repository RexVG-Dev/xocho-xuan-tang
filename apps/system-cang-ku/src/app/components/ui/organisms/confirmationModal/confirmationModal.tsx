'use client';

import { useState } from 'react';

import { Modal, Button } from '@/app/components/ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}: ConfirmationModalProps) {
  const [isOpenState, setIsOpenState] = useState(isOpen);
  const handleOnConfirm = () => {
    onConfirm();
    setIsOpenState(false);
  };

  return (
    <Modal isOpen={isOpenState} onClose={onCancel}>
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={onCancel} color="secondary" disabled={isLoading}>
            {cancelText}
          </Button>
          <Button onClick={handleOnConfirm} color="danger" isLoading={isLoading} disabled={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
