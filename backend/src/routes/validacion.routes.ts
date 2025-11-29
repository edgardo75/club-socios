import { Router, Request, Response } from 'express';
import { ValidacionService } from '../services/validacion.service';

const router = Router();
const validacionService = new ValidacionService();

/**
 * GET /api/validacion/:dni
 * Validar carnet de un socio
 * Este es el endpoint que usa el portero cuando pasa el carnet por el lector
 */
router.get('/:dni', async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const validacion = await validacionService.validarCarnet(dni);
    res.json(validacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al validar el carnet' });
  }
});

export default router;

