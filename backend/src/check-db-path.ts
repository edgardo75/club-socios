import Database from 'better-sqlite3';
import path from 'path';

const run = () => {
  const dbPath = path.join(process.cwd(), 'club-socios.db');
  console.log('CWD:', process.cwd());
  console.log('DB Path:', dbPath);
  
  try {
    const db = new Database(dbPath, { fileMustExist: true });
    const columns = db.prepare('PRAGMA table_info(socios)').all();
    console.log('Columns:', columns.map((c: any) => c.name));
    
    const count = db.prepare('SELECT COUNT(*) as count FROM socios').get() as any;
    console.log('Socio Count:', count.count);
  } catch (e) {
    console.error('Error opening DB:', e);
  }
};

run();
