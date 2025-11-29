import fs from 'fs';
import path from 'path';
import db from './index';
import { Socio } from '../types/socio';
import { Pago } from '../types/pago';
import { AppConfig } from '../services/config.service';

const DATA_DIR = path.join(process.cwd(), 'data');
const SOCIOS_FILE = path.join(DATA_DIR, 'socios.json');
const PAGOS_FILE = path.join(DATA_DIR, 'pagos.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

export function migrateData() {
  console.log('Starting migration...');

  // Migrate Socios
  try {
    const sociosCount = db.prepare('SELECT COUNT(*) as count FROM socios').get() as { count: number };
    if (sociosCount.count === 0 && fs.existsSync(SOCIOS_FILE)) {
      console.log('Migrating socios...');
      const sociosData = fs.readFileSync(SOCIOS_FILE, 'utf-8');
      const socios: Socio[] = JSON.parse(sociosData);

      const insert = db.prepare(`
        INSERT INTO socios (
          id, dni, nombre, apellido, email, telefono, fechaNacimiento, 
          direccion, fechaIngreso, estado, tipo, numeroSocio, foto, 
          observaciones, ultimaRevisionMedica, proximaRevisionMedica, 
          revisionMedicaVigente, createdAt, updatedAt
        ) VALUES (
          @id, @dni, @nombre, @apellido, @email, @telefono, @fechaNacimiento, 
          @direccion, @fechaIngreso, @estado, @tipo, @numeroSocio, @foto, 
          @observaciones, @ultimaRevisionMedica, @proximaRevisionMedica, 
          @revisionMedicaVigente, @createdAt, @updatedAt
        )
      `);

      const insertMany = db.transaction((socios: Socio[]) => {
        for (const socio of socios) {
          insert.run({
            ...socio,
            revisionMedicaVigente: socio.revisionMedicaVigente ? 1 : 0,
            tipo: socio.tipo || 'activo' // Ensure default
          });
        }
      });

      insertMany(socios);
      console.log(`Migrated ${socios.length} socios.`);
    } else {
      console.log('Socios table not empty or file missing, skipping.');
    }
  } catch (error) {
    console.error('Error migrating socios:', error);
  }

  // Migrate Pagos
  try {
    const pagosCount = db.prepare('SELECT COUNT(*) as count FROM pagos').get() as { count: number };
    if (pagosCount.count === 0 && fs.existsSync(PAGOS_FILE)) {
      console.log('Migrating pagos...');
      const pagosData = fs.readFileSync(PAGOS_FILE, 'utf-8');
      const pagos: Pago[] = JSON.parse(pagosData);

      const insert = db.prepare(`
        INSERT INTO pagos (
          id, socioDni, monto, fecha, mes, concepto, metodoPago, createdAt
        ) VALUES (
          @id, @socioDni, @monto, @fecha, @mes, @concepto, @metodoPago, @createdAt
        )
      `);

      const insertMany = db.transaction((pagos: Pago[]) => {
        for (const pago of pagos) {
          insert.run(pago);
        }
      });

      insertMany(pagos);
      console.log(`Migrated ${pagos.length} pagos.`);
    } else {
      console.log('Pagos table not empty or file missing, skipping.');
    }
  } catch (error) {
    console.error('Error migrating pagos:', error);
  }

  // Migrate Config
  try {
    const configCount = db.prepare('SELECT COUNT(*) as count FROM config').get() as { count: number };
    if (configCount.count === 0 && fs.existsSync(CONFIG_FILE)) {
      console.log('Migrating config...');
      const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const config: AppConfig = JSON.parse(configData);

      const insert = db.prepare('INSERT INTO config (key, value) VALUES (?, ?)');
      
      const insertMany = db.transaction((conf: AppConfig) => {
        insert.run('cuotaActivo', String(conf.cuotaActivo));
        insert.run('cuotaAdherente', String(conf.cuotaAdherente));
      });

      insertMany(config);
      console.log('Config migrated.');
    } else {
      console.log('Config table not empty or file missing, skipping.');
    }
  } catch (error) {
    console.error('Error migrating config:', error);
  }
  
  console.log('Migration completed.');
}
