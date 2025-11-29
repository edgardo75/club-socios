import { Router, Request, Response } from 'express';
import { SociosService } from '../services/socios.service';
import { CreateSocioDto, UpdateSocioDto } from '../types/socio';
import { upload } from '../config/upload';

const router = Router();
const sociosService = new SociosService();

/**
 * GET /api/socios
 * Obtener todos los socios
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    if (search && typeof search === 'string') {
      const socios = await sociosService.getAll(search);
      return res.json(socios);
    }
    
    const socios = await sociosService.getAll();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener socios' });
  }
});

/**
 * GET /api/socios/:dni
 * Obtener un socio por DNI
 */
router.get('/:dni', async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const socio = await sociosService.getByDni(dni);
    
    if (!socio) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    
    res.json(socio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el socio' });
  }
});

/**
 * POST /api/socios
 * Crear un nuevo socio
 */
import path from 'path';
import { downloadImage } from '../utils/download';

// ... imports

router.post('/', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const data: CreateSocioDto = req.body;
    
    // Si se subió un archivo, actualizar la URL de la foto
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      data.foto = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (data.foto && data.foto.startsWith('http') && !data.foto.includes(req.get('host') || 'localhost')) {
      // Si es una URL externa, descargarla
      try {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filename = await downloadImage(data.foto, uploadsDir);
        const protocol = req.protocol;
        const host = req.get('host');
        data.foto = `${protocol}://${host}/uploads/${filename}`;
      } catch (error) {
        console.error('Error descargando imagen:', error);
        // Si falla la descarga, mantenemos la URL original
      }
    }
    
    // Validaciones básicas
    if (!data.dni || !data.nombre || !data.apellido) {
      return res.status(400).json({ 
        error: 'DNI, nombre y apellido son requeridos' 
      });
    }
    
    const nuevoSocio = await sociosService.create(data);
    res.status(201).json(nuevoSocio);
  } catch (error: any) {
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al crear el socio' });
  }
});

/**
 * PUT /api/socios/:dni
 * Actualizar un socio
 */
router.put('/:dni', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const data: UpdateSocioDto = req.body;
    
    // Si se subió un archivo, actualizar la URL de la foto
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      data.foto = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (data.foto && data.foto.startsWith('http') && !data.foto.includes(req.get('host') || 'localhost')) {
      // Si es una URL externa, descargarla
      try {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filename = await downloadImage(data.foto, uploadsDir);
        const protocol = req.protocol;
        const host = req.get('host');
        data.foto = `${protocol}://${host}/uploads/${filename}`;
      } catch (error) {
        console.error('Error descargando imagen:', error);
        // Si falla la descarga, mantenemos la URL original
      }
    }
    
    const socioActualizado = await sociosService.update(dni, data);
    res.json(socioActualizado);
  } catch (error: any) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al actualizar el socio' });
  }
});

/**
 * DELETE /api/socios/:dni
 * Eliminar un socio
 */
router.delete('/:dni', async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    await sociosService.delete(dni);
    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al eliminar el socio' });
  }
});

export default router;

