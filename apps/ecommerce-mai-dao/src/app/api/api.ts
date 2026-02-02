interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any> | FormData;
  isFormData?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiOptions = {}): Promise<unknown> {
  const { 
    method = 'GET', 
    body, 
    isFormData = false 
  } = options;

  const headers: HeadersInit = {};

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);

  const data = await response.json();
  return data;
}
