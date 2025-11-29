import db from './src/db';

try {
  const socios = db.prepare('SELECT * FROM socios WHERE estado = "activo" ORDER BY apellido ASC, nombre ASC').all();
  console.log('Socios query success:', socios.length);
} catch (e) {
  console.error('Socios query failed:', e);
}

try {
  const pagos = db.prepare('SELECT * FROM pagos ORDER BY fecha DESC').all();
  console.log('Pagos query success:', pagos.length);
} catch (e) {
  console.error('Pagos query failed:', e);
}

try {
  const config = db.prepare('SELECT key, value FROM config').all();
  console.log('Config query success:', config.length);
} catch (e) {
  console.error('Config query failed:', e);
}
