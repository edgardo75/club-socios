import { Request, Response } from 'express';
import { SociosService } from '../services/socios.service';
import { CreateSocioDto, UpdateSocioDto } from '../types/socio';
import path from 'path';
import { downloadImage } from '../utils/download';

export class SociosController {
  private sociosService: SociosService;

  constructor() {
    this.sociosService = new SociosService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      const includeDeleted = req.query.includeDeleted === 'true';
      
      if (search && typeof search === 'string') {
        const socios = await this.sociosService.getAll(search, includeDeleted);
        return res.json(socios);
      }
      
      const socios = await this.sociosService.getAll(undefined, includeDeleted);
      res.json(socios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener socios' });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const socio = await this.sociosService.getByDni(req.params.dni);
      res.json(socio);
    } catch (error) {
      res.status(404).json({ error: 'Socio no encontrado' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateSocioDto = req.body;
      
      // Manejo de imagen
      if (req.file) {
        const protocol = req.protocol;
        const host = req.get('host');
        data.foto = `${protocol}://${host}/uploads/${req.file.filename}`;
      } else if (data.foto && data.foto.startsWith('http') && !data.foto.includes(req.get('host') || 'localhost')) {
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
      
      // Nota: La validación manual se ha eliminado en favor de Zod Middleware
      
      const nuevoSocio = await this.sociosService.create(data);
      res.status(201).json(nuevoSocio);
    } catch (error: any) {
      if (error.message.includes('Ya existe')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al crear el socio' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const data: UpdateSocioDto & { numeroSocio?: string } = req.body;
      
      if (req.file) {
        const protocol = req.protocol;
        const host = req.get('host');
        data.foto = `${protocol}://${host}/uploads/${req.file.filename}`;
      } else if (data.foto && data.foto.startsWith('http') && !data.foto.includes(req.get('host') || 'localhost')) {
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

      const socioActualizado = await this.sociosService.update(req.params.dni, data);
      res.json(socioActualizado);
    } catch (error: any) {
      if (error.message === 'Socio no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar el socio' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.sociosService.delete(req.params.dni);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Socio no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al eliminar el socio' });
    }
  };

  checkDeleted = async (req: Request, res: Response) => {
    try {
      const hasDeleted = await this.sociosService.hasDeleted();
      res.json({ hasDeleted });
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar socios eliminados' });
    }
  };

  restore = async (req: Request, res: Response) => {
    try {
      await this.sociosService.restore(req.params.dni);
      res.status(200).json({ message: 'Socio restaurado' });
    } catch (error: any) {
      if (error.message === 'Socio no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al restaurar el socio' });
    }
  };
}
