import React from 'react';
import { Button } from '../components/ui/atoms/button/Button';
import { Icon } from '../components/ui/atoms/icon';

const steps = [
  'Mi carrito',
  'Datos de envío',
  'Confirma tus datos',
  'Completa tu pago',
  '¡Tu pedido está en camino!'
];

export function CartStepper({ currentStep = 0, onBack }: { currentStep: number; onBack?: () => void }) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-6 flex-1">
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold
                    ${idx <= currentStep ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
                >
                  {idx + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${idx === currentStep ? 'text-red-500' : 'text-gray-400'}`}>{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${idx < currentStep ? 'bg-red-500' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        {onBack && currentStep < steps.length - 1 && (
          <Button
            className="ml-8 flex items-center gap-1 text-gray-600 hover:text-black text-sm font-semibold"
            color="light"
            size="sm"
            rounded="full"
            onClick={onBack}
            icon={<Icon name="arrowleft" size={16} />}
          >
            Volver
          </Button>
        )}
      </div>
    </div>
  );
}
