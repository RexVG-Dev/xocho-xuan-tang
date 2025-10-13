interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any> | FormData;
  requiresAuth?: boolean;
  isFormData?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiOptions = {}) {
  const { 
    method = 'GET', 
    body, 
    requiresAuth = false, 
    isFormData = false 
  } = options;

  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // TODO redirigir al login si no hay token
      console.warn('Petición requiere autenticación pero no se encontró token.'); 
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || 'Ocurrió un error en la petición.');
  }

  if (response.status === 204) {
    return null;
  }

  /**
   * TODO: Verificar si esto causa problemas con respuestas que no son JSON con Delete
  */
  const data = await response.json();
  return data;
}