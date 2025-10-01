'use client';

import { useLoading } from "@/app/contexts/useLoading";
import { Modal } from "../../molecules";

export function GlobalSpinner() {
  const { isLoading, message } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <Modal isOpen={true} zIndex="z-50">
      <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          {message}
        </h2>
  
        <div className="w-16 h-16 border-8 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>

        <p className="text-lg text-gray-500 animate-pulse">Cargando...</p>
      </div>
    </Modal>
  );
}