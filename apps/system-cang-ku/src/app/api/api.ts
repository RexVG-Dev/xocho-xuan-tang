interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any> | FormData;
  requiresAuth?: boolean;
  isFormData?: boolean;
}

let isRefreshing = false;
let failedQueue: any[] = [];

// Procesa la cola de peticiones fallidas una vez que el token se refresca o falla
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiFetch(endpoint: string, options: ApiOptions = {}): Promise<unknown> {
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

  // Obtenemos el token actual (si existe)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);

  // --- INTERCEPTOR PARA 401 (TOKEN EXPIRADO) ---
  if (response.status === 401 && requiresAuth) {
    console.warn(`[API] ⚠️ Error 401 detectado en ${endpoint}. Evaluando renovación...`);
    if (isRefreshing) {
      // Si ya hay un proceso de refresco, encolamos esta petición
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        // Cuando se resuelva la promesa, reintentamos con el nuevo token
        if (newToken) {
          // Importante: No pasamos el token viejo en headers, apiFetch lo leerá de localStorage
          return apiFetch(endpoint, options);
        } else {
          throw new Error('No se pudo refrescar el token');
        }
      });
    }

    isRefreshing = true;

    try {
      // Intentar renovar el token
      const refreshResponse = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newToken = data.token;

        if (newToken) {
          localStorage.setItem('auth_token', newToken);
          processQueue(null, newToken); // Desbloqueamos la cola
          isRefreshing = false;
          
          // Reintentamos la petición original que falló
          return apiFetch(endpoint, options); 
        }
      }
      
      // Si llegamos aquí, el refresco falló
      throw new Error('Sesión expirada irreversiblemente');

    } catch (refreshError) {
      // Si falla el refresco, rechazamos todo y cerramos sesión
      processQueue(refreshError, null);
      isRefreshing = false;
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      
      // Redirigir al login solo si estamos en el cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw refreshError; // Propagar el error
    }
  }

  // --- MANEJO DE OTROS ERRORES ---
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || 'Ocurrió un error en la petición.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  return data;
}
