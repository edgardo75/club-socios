import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'club-socios.db');
console.log('>>> DATABASE PATH:', dbPath);
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');
// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize tables
export function initDatabase() {
  // Socios table
  db.exec(`
    CREATE TABLE IF NOT EXISTS socios (
      id TEXT PRIMARY KEY,
      dni TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      email TEXT,
      telefono TEXT,
      fechaNacimiento TEXT,
      direccion TEXT,
      fechaIngreso TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'activo',
      tipo TEXT NOT NULL DEFAULT 'activo',
      numeroSocio TEXT,
      foto TEXT,
      observaciones TEXT,
      ultimaRevisionMedica TEXT,
      proximaRevisionMedica TEXT,
      revisionMedicaVigente INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT
    )
  `);

  // Pagos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pagos (
      id TEXT PRIMARY KEY,
      socioDni TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT NOT NULL,
      mes TEXT NOT NULL,
      concepto TEXT,
      metodoPago TEXT NOT NULL,
      createdAt TEXT,
      FOREIGN KEY (socioDni) REFERENCES socios (dni)
    )
  `);

  // Config table (Key-Value store)
  db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  console.log('Database initialized');
}

export default db;
