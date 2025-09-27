'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input, Button, Modal } from '../components/ui';
import { sanitizeInput } from '../../utils/sanitize';
import { apiFetch } from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: { email, password },
      });

      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err:any) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Modal isOpen={true} >
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              variantSize='full'
              label="Username"
              type="text"
              value={email}
              onChange={(e) => setEmail(sanitizeInput(e.target.value))}
              required
            />
            <Input
              variantSize='full'
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(sanitizeInput(e.target.value))}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <Button
            color='danger'
            type="submit"
            size="full"
            className="mt-6"
            isLoading={isLoading}
            disabled={isLoading}>
            Ingresar
          </Button>
        </form>
      </Modal>
    </main>
  )
}

export default Login;
