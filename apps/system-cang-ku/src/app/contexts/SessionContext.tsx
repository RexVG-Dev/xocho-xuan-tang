'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { parseJwt } from '@/utils/jwt'; // Usamos parseJwt para obtener 'exp' directamente
import { SessionModal } from '@/app/components/ui/organisms'; 
import { apiFetch } from '@/app/api';

interface SessionContextType {
  checkSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // OPTIMIZACIÓN: Usamos una referencia para guardar el timestamp de expiración
  // Esto evita leer localStorage y decodificar el token cada segundo.
  const expirationTimeRef = useRef<number | null>(null);

  // 1. Efecto para leer el token y guardar la fecha de expiración
  // Se ejecuta solo al montar, al cambiar de ruta o al cerrar el modal (posible renovación)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp) {
        expirationTimeRef.current = decoded.exp; // Guardamos el tiempo absoluto (ej. 1725000000)
      }
    } else {
      expirationTimeRef.current = null;
    }
  }, [pathname, showModal]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setShowModal(false);
    router.push('/login');
  };

  // Función para extender sesión
  const handleExtend = async () => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      // Asegúrate de que esta ruta coincida con tu backend
      const data: any = await apiFetch('/auth/refresh-token', { 
        method: 'POST', 
        body: { token: currentToken },
        requiresAuth: false
      });
      
      localStorage.setItem('auth_token', data.token);
      
      // Actualizamos la referencia inmediatamente con el nuevo token
      const decoded = parseJwt(data.token);
      if (decoded && decoded.exp) {
        expirationTimeRef.current = decoded.exp;
      }

      setShowModal(false);
    } catch (error) {
      console.error("No se pudo extender la sesión", error);
      handleLogout();
    }
  };

  // 2. Efecto del temporizador (Optimizado: Solo hace matemáticas)
  useEffect(() => {
    if (pathname === '/login') return;

    const interval = setInterval(() => {
      // Si no tenemos la referencia, intentamos recuperarla (fallback) o no hacemos nada
      if (!expirationTimeRef.current) {
         const token = localStorage.getItem('auth_token');
         if (!token) {
             if (pathname !== '/login') router.push('/login');
             return;
         }
         // Intentar setear la referencia si existe el token pero no la ref
         const decoded = parseJwt(token);
         if (decoded?.exp) expirationTimeRef.current = decoded.exp;
         return;
      }

      // Cálculo ligero: Tiempo expiración - Tiempo actual
      const currentTime = Math.floor(Date.now() / 1000);
      const seconds = expirationTimeRef.current - currentTime;
      
      setTimeLeft(seconds);
      
      // Solo para debug, puedes quitarlo en producción
      // console.log('Segundos restantes de sesión:', seconds);

      // Si el token ya expiró
      if (seconds <= 0) {
        handleLogout();
        return;
      }

      // Si falta menos de 60 segundos
      if (seconds < 60 && !showModal) {
        setShowModal(true);
      }
      
      // Si el usuario extendió la sesión en otra pestaña (la ref cambió)
      if (seconds > 60 && showModal) {
        setShowModal(false);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [pathname, showModal, router]);

  return (
    <SessionContext.Provider value={{ checkSession: () => { /* empty */ } }}>
      {children}
      {showModal && (
        <SessionModal 
          isOpen={showModal} 
          onExtend={handleExtend} 
          onLogout={handleLogout} 
          timeLeft={timeLeft} 
        />
      )}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};