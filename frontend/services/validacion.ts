import { fetchApi } from './api';
import { ValidacionCarnet } from '../types/validacion';

export const validacionService = {
  validarCarnet: async (dni: string): Promise<ValidacionCarnet> => {
    return fetchApi(`/validacion/${dni}`);
  },
};
