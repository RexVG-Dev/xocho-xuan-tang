import { ReactNode } from 'react';
import clsx from 'clsx';

import { Card } from '../../atoms/card/Card';

import { BorderCardType, borderCardTypes } from '../../atoms/card/constants';

export const positionsModal = {
  center: 'center',
  right: 'right',
} as const;

export type PositionsModalType = typeof positionsModal[keyof typeof positionsModal];

export interface ModalInterface {
  title?: string;
  isOpen?: boolean;
  border?: BorderCardType;
  position?: PositionsModalType;
  onClose?: () => void;
  children?: ReactNode;
}

export function Modal({
  title,
  isOpen,
  border = borderCardTypes.none,
  position = positionsModal.center,
  onClose,
  children

}: ModalInterface) {
   if (!isOpen) {
    return null;
  }

  const modalWrapperClasses = clsx(
    'fixed inset-0 z-50 transition-all duration-300 ease-in-out flex',
    {
      'items-center justify-center': position === 'center',
      'items-stretch justify-end': position === 'right',
    }
  );

  const modalCardClasses = clsx(
    'transition-all duration-300 ease-in-out', {
    'transform scale-100 opacity-100': isOpen,
    'transform scale-95 opacity-0': !isOpen,
    'w-full max-w-xl mx-4 my-8': position === 'center',
    'rounded-l-lg rounded-r-none w-full md:w-1/3 h-full': position === 'right',
  });

  return (
    <div className={modalWrapperClasses}>
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className={modalCardClasses}>
        <Card
          className={
            position === positionsModal.right 
              ? 'h-full bg-white rounded-l-xl'
              : 'bg-white'
          }
          title={title}
          border={border}
          rounded={position === positionsModal.right ? false : true}
        >
          {children}
        </Card>
      </div>
    </div>
  );
}

export default Modal;
