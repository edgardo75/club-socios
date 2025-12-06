import db from '../src/db/index';

const resetDatabase = () => {
  console.log('⚠️  Iniciando limpieza de base de datos...');
  
  try {
    // Disable foreign keys to allow deleting in any order
    db.pragma('foreign_keys = OFF');

    console.log('🗑️  Eliminando pagos...');
    db.exec('DELETE FROM pagos');

    console.log('🗑️  Eliminando socios...');
    db.exec('DELETE FROM socios');

    console.log('🗑️  Eliminando configuración...');
    db.exec('DELETE FROM config');

    // Re-enable foreign keys
    db.pragma('foreign_keys = ON');

    // Vacuum to reclaim space
    db.exec('VACUUM');

    console.log('✅ Base de datos limpiada correctamente.');
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
  }
};

resetDatabase();
