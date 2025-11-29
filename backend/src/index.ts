import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './db';
import { migrateData } from './db/migrate';
import sociosRoutes from './routes/socios.routes';
import pagosRoutes from './routes/pagos.routes';
import configRoutes from './routes/config.routes';
import validacionRoutes from './routes/validacion.routes';
import informesRoutes from './routes/informes.routes';

// Cargar variables de entorno
dotenv.config();

// Inicializar base de datos y migración
initDatabase();
migrateData();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadsDir));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API Club de Socios',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      socios: '/api/socios',
      pagos: '/api/pagos',
      config: '/api/config',
      validacion: '/api/validacion',
      informes: '/api/informes'
    }
  });
});

// Rutas
app.use('/api/socios', sociosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/config', configRoutes);
app.use('/api/validacion', validacionRoutes);
app.use('/api/informes', informesRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api/socios`);
});
