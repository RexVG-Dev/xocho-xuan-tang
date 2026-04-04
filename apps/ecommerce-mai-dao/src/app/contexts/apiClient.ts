const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/long-shang';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
}

export async function apiRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = options;
  let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  if (params) {
    const query = new URLSearchParams(params as any).toString();
    fullUrl += `?${query}`;
  }
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }
  const res = await fetch(fullUrl, fetchOptions);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }
  return res.json();
}
