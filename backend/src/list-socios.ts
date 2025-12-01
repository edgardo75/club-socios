import { initDatabase } from './db';
import { SociosService } from './services/socios.service';

const run = async () => {
  initDatabase();
  const service = new SociosService();
  console.log('--- LISTING ALL SOCIOS ---');
  const socios = await service.getAll(undefined, true);
  socios.forEach(s => {
    console.log(`${s.dni} - ${s.nombre} ${s.apellido} - DeletedAt: ${s.deletedAt}`);
  });
};

run().catch(console.error);
