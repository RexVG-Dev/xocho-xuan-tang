'use client';

import { useNotification } from '@/app/contexts/useNotification';
import { Modal, Button, Icon } from '@/app/components/ui';

const notificationConfig = {
  success: {
    message: 'Operación exitosa.',
    icon: 'done_green' as const,
    iconClass: 'text-green-500',
    border: 'success' as const,
    buttonColor: 'success' as const,
  },
  error: {
    message: 'Error de operación, intente más tarde.',
    icon: 'error_red' as const,
    iconClass: 'text-red-500',
    border: 'error' as const,
    buttonColor: 'danger' as const,
  },
};

export function NotificationModal() {
  const { notification, hideNotification } = useNotification();

  if (!notification) {
    return null;
  }

  const config = notificationConfig[notification.type];

  return (
    <Modal isOpen={!!notification} onClose={hideNotification} border={config.border}>
      <div className="p-6 text-center flex flex-col items-center gap-4">
        <Icon name={config.icon} size={68} className={config.iconClass} />
        <p className="text-xl font-bold text-gray-700">
          {notification.message || config.message}
        </p>
        <div className="mt-4 flex justify-center gap-4">
          {notification.secondaryAction && (
            <Button onClick={notification.secondaryAction.onClick} color="secondary">
              {notification.secondaryAction.label}
            </Button>
          )}
          <Button onClick={hideNotification} color={config.buttonColor}>
            Aceptar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
