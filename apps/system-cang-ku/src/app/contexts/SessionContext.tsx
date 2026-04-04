'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { parseJwt } from '@/utils/jwt';
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

  const expirationTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp) {
        expirationTimeRef.current = decoded.exp;
      }
    } else {
      expirationTimeRef.current = null;
    }
  }, [pathname, showModal]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setShowModal(false);
    router.push('/login');
  };

  const handleExtend = async () => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      const data: any = await apiFetch('/auth/refresh-token', { 
        method: 'POST', 
        body: { token: currentToken },
        requiresAuth: false
      });
      
      localStorage.setItem('auth_token', data.token);

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

  useEffect(() => {
    if (pathname === '/login') return;

    const interval = setInterval(() => {
      if (!expirationTimeRef.current) {
         const token = localStorage.getItem('auth_token');
         if (!token) {
             if (pathname !== '/login') router.push('/login');
             return;
         }
         const decoded = parseJwt(token);
         if (decoded?.exp) expirationTimeRef.current = decoded.exp;
         return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const seconds = expirationTimeRef.current - currentTime;
      
      setTimeLeft(seconds);

      if (seconds <= 0) {
        handleLogout();
        return;
      }

      if (seconds < 60 && !showModal) {
        setShowModal(true);
      }

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