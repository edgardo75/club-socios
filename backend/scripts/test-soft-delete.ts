import { initDatabase } from './db';
import { SociosService } from './services/socios.service';

const run = async () => {
  initDatabase();
  const service = new SociosService();
  const dni = '99999999';

  console.log('--- TEST SOFT DELETE ---');

  // 1. Create
  try {
    await service.delete(dni); // Cleanup just in case
  } catch (e) {}

  console.log('Creating socio...');
  await service.create({
    dni,
    nombre: 'Test',
    apellido: 'Delete',
    fechaIngreso: new Date().toISOString(),
    estado: 'activo',
    tipo: 'activo',
    telefono: '123',
    numeroSocio: 'TEST-001'
  });

  // 2. Verify it exists
  let socios = await service.getAll(undefined, false);
  let found = socios.find(s => s.dni === dni);
  console.log('Exists (Active):', !!found);

  // 3. Delete
  console.log('Deleting socio...');
  await service.delete(dni);

  // 4. Verify it's gone from active
  socios = await service.getAll(undefined, false);
  found = socios.find(s => s.dni === dni);
  console.log('Exists (Active) after delete:', !!found);

  // 5. Verify it's present in all
  socios = await service.getAll(undefined, true);
  found = socios.find(s => s.dni === dni);
  console.log('Exists (All) after delete:', !!found);
  console.log('DeletedAt value:', found?.deletedAt);

  // 6. Restore
  console.log('Restoring socio...');
  await service.restore(dni);

  // 7. Verify it's back
  socios = await service.getAll(undefined, false);
  found = socios.find(s => s.dni === dni);
  console.log('Exists (Active) after restore:', !!found);

  // Cleanup
  // await service.delete(dni); // Leave it for manual check if needed
};

run().catch(console.error);
