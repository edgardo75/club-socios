import { fetchApi } from './api';
import { Socio, CreateSocioDto, UpdateSocioDto } from '../types/socio';

export const sociosService = {
  getAll: async (search?: string): Promise<Socio[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi(`/socios${query}`);
  },

  getByDni: async (dni: string): Promise<Socio> => {
    return fetchApi(`/socios/${dni}`);
  },

  create: async (data: CreateSocioDto | FormData): Promise<Socio> => {
    const isFormData = data instanceof FormData;
    return fetchApi('/socios', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    });
  },

  update: async (dni: string, data: UpdateSocioDto | FormData): Promise<Socio> => {
    const isFormData = data instanceof FormData;
    return fetchApi(`/socios/${dni}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    });
  },

  delete: async (dni: string): Promise<void> => {
    return fetchApi(`/socios/${dni}`, {
      method: 'DELETE',
    });
  },
};
