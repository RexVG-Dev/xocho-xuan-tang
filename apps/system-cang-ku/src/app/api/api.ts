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

  headers['Content-Type'] = 'application/json';

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
    config.body = isFormData ? body as FormData : JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);

  /**
   * TODO: Verificar si esto causa problemas con respuestas que no son JSON con Delete
   */
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error en la petición a ${endpoint}`);
  }
  return data;
}