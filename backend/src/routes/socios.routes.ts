import { Router, Request, Response } from 'express';
import { SociosService } from '../services/socios.service';
import { CreateSocioDto, UpdateSocioDto } from '../types/socio';
import { upload } from '../config/upload';
import path from 'path';
import { downloadImage } from '../utils/download';

const router = Router();
const sociosService = new SociosService();

/**
 * GET /api/socios
 * Obtener todos los socios
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const includeDeleted = req.query.includeDeleted === 'true';
    
    if (search && typeof search === 'string') {
      const socios = await sociosService.getAll(search, includeDeleted);
      return res.json(socios);
    }
    
    const socios = await sociosService.getAll(undefined, includeDeleted);
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
    const socio = await sociosService.getByDni(req.params.dni);
    res.json(socio);
  } catch (error) {
    res.status(404).json({ error: 'Socio no encontrado' });
  }
});

/**
 * POST /api/socios
 * Crear un nuevo socio
 */
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
    
    // Validaciones estrictas
    const errors: string[] = [];

    // 1. Campos Obligatorios
    if (!data.dni) errors.push('El DNI es obligatorio');
    if (!data.nombre) errors.push('El Nombre es obligatorio');
    if (!data.apellido) errors.push('El Apellido es obligatorio');
    if (!data.telefono) errors.push('El Teléfono es obligatorio');

    // 2. Validar DNI
    if (data.dni && !/^\d{7,8}$/.test(data.dni)) {
      errors.push('El DNI debe contener solo números (7 u 8 dígitos)');
    }

    // 3. Validar Teléfono
    if (data.telefono && !/^[\d\s\-\+]+$/.test(data.telefono)) {
      errors.push('El teléfono contiene caracteres inválidos');
    }

    // 4. Validar Nombre y Apellido
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (data.nombre && !nameRegex.test(data.nombre)) {
      errors.push('El nombre solo puede contener letras');
    }
    if (data.apellido && !nameRegex.test(data.apellido)) {
      errors.push('El apellido solo puede contener letras');
    }

    // 5. Validar Email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('El formato del email no es válido');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('. ') });
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
    const data: UpdateSocioDto & { numeroSocio?: string } = req.body;
    
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
      }
    }

    const socioActualizado = await sociosService.update(req.params.dni, data);
    res.json(socioActualizado);
  } catch (error: any) {
    if (error.message === 'Socio no encontrado') {
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
    await sociosService.delete(req.params.dni);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Socio no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al eliminar el socio' });
  }
});

/**
 * GET /api/socios/check/has-deleted
 * Verificar si hay socios eliminados
 */
router.get('/check/has-deleted', async (req: Request, res: Response) => {
  try {
    const hasDeleted = await sociosService.hasDeleted();
    res.json({ hasDeleted });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar socios eliminados' });
  }
});

router.post('/:dni/restore', async (req: Request, res: Response) => {
  try {
    await sociosService.restore(req.params.dni);
    res.status(200).json({ message: 'Socio restaurado' });
  } catch (error: any) {
    if (error.message === 'Socio no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al restaurar el socio' });
  }
});

export default router;
