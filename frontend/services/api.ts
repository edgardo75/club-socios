const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...(!isFormData && options.headers === undefined ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Error en la petición');
  }

  if (res.status === 204) return null;
  
  return res.json();
}
