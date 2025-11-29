import { fetchApi } from './api';
import { Pago, CreatePagoDto } from '../types/pago';

export const pagosService = {
  getAll: async (): Promise<Pago[]> => {
    return fetchApi('/pagos');
  },

  getBySocioDni: async (dni: string): Promise<Pago[]> => {
    return fetchApi(`/pagos/socio/${dni}`);
  },

  create: async (data: CreatePagoDto): Promise<Pago> => {
    return fetchApi('/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi(`/pagos/${id}`, {
      method: 'DELETE',
    });
  },
};
