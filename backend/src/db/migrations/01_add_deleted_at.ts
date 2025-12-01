import db from '../index';

export function run() {
  console.log('Running migration: 01_add_deleted_at');
  try {
    db.exec('ALTER TABLE socios ADD COLUMN deletedAt TEXT');
    console.log('Migration successful: deletedAt column added');
  } catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('Migration skipped: deletedAt column already exists');
    } else {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

run();
