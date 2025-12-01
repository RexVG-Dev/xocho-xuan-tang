'use client';

import { Modal, Button } from '@/app/components/ui';

interface SessionModalProps {
  isOpen: boolean;
  onExtend: () => void;
  onLogout: () => void;
  timeLeft: number; // Segundos restantes
}

export function SessionModal({ isOpen, onExtend, onLogout, timeLeft }: SessionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => { /* empty */ }} position="center">
      <div className="p-6 text-center max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Tu sesión está por expirar</h3>
        <p className="text-gray-600 mb-6">
          Por seguridad, tu sesión se cerrará automáticamente en <span className="font-bold text-red-600">{timeLeft} segundos</span>.
          ¿Deseas continuar trabajando?
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={onLogout} variant="outline" color="secondary">
            Cerrar Sesión
          </Button>
          <Button onClick={onExtend} color="dark">
            Continuar Sesión
          </Button>
        </div>
      </div>
    </Modal>
  );
}
