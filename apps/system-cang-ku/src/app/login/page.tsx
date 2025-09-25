'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, Input, Button } from '@xocho-xuan-tang/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // Usamos una ruta relativa que Next.js redirigirá al backend gracias al proxy.
      const res = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al iniciar sesión.');
      }

      // Si el login es exitoso, la cookie ya se estableció desde el backend.
      // Redirigimos al dashboard.
      router.push('/dashboard');
      router.refresh(); // Refresca para que el middleware re-evalúe la ruta

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <Button type="submit" size="full" className="mt-6">
            Ingresar
          </Button>
        </form>
      </Card>
    </main>
  );
}