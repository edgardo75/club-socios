import { fetchApi } from './api';

export interface AppConfig {
  cuotaActivo: number;
  cuotaAdherente: number;
}

export const configService = {
  getConfig: async (): Promise<AppConfig> => {
    return fetchApi('/config');
  },

  updateConfig: async (config: Partial<AppConfig>): Promise<AppConfig> => {
    return fetchApi('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },
};
