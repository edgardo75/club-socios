import { fetchApi } from './api';
import { Socio, CreateSocioDto, UpdateSocioDto } from '../types/socio';

export const sociosService = {
  getAll: async (search?: string, includeDeleted: boolean = false): Promise<Socio[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (includeDeleted) params.append('includeDeleted', 'true');
    return fetchApi(`/socios?${params.toString()}`);
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

  restore: async (dni: string): Promise<void> => {
    return fetchApi(`/socios/${dni}/restore`, {
      method: 'POST',
    });
  },

  checkHasDeleted: async (): Promise<boolean> => {
    const res = await fetchApi('/socios/check/has-deleted');
    return res.hasDeleted;
  }
};
