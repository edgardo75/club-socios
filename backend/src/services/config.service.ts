import db from '../db';

export interface AppConfig {
  cuotaActivo: number;
  cuotaAdherente: number;
}

const DEFAULT_CONFIG: AppConfig = {
  cuotaActivo: 1000,
  cuotaAdherente: 500,
};

export class ConfigService {
  getConfig(): AppConfig {
    try {
      const rows = db.prepare('SELECT key, value FROM config').all() as { key: string, value: string }[];
      
      if (rows.length === 0) {
        return { ...DEFAULT_CONFIG };
      }

      const config: any = {};
      rows.forEach(row => {
        config[row.key] = Number(row.value);
      });

      return { ...DEFAULT_CONFIG, ...config };
    } catch (error) {
      console.error('Error getting config:', error);
      return { ...DEFAULT_CONFIG };
    }
  }

  updateConfig(newConfig: Partial<AppConfig>): AppConfig {
    const currentConfig = this.getConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };

    const insert = db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
    
    const updateMany = db.transaction((conf: AppConfig) => {
      insert.run('cuotaActivo', String(conf.cuotaActivo));
      insert.run('cuotaAdherente', String(conf.cuotaAdherente));
    });

    updateMany(updatedConfig);
    return updatedConfig;
  }
}
