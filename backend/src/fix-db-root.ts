import Database from 'better-sqlite3';
import path from 'path';

const run = () => {
  // Point to the DB in the ROOT directory (one level up from backend)
  const dbPath = path.join(__dirname, '../../club-socios.db');
  console.log('Opening DB at:', dbPath);
  
  const db = new Database(dbPath);
  
  try {
    console.log('Adding deletedAt column...');
    db.prepare('ALTER TABLE socios ADD COLUMN deletedAt TEXT').run();
    console.log('Column added successfully.');
  } catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('Column already exists.');
    } else {
      console.error('Error adding column:', error);
    }
  }
  
  // Verify
  const columns = db.prepare('PRAGMA table_info(socios)').all();
  console.log('Columns:', columns.map((c: any) => c.name));
};

run();
