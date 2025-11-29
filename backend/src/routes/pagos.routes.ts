import { Router, Request, Response } from 'express';
import { PagosService } from '../services/pagos.service';
import { CreatePagoDto } from '../types/pago';

const router = Router();
const pagosService = new PagosService();

/**
 * GET /api/pagos
 * Obtener todos los pagos
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const pagos = await pagosService.getAll();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
});

/**
 * GET /api/pagos/socio/:dni
 * Obtener todos los pagos de un socio
 */
router.get('/socio/:dni', async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const pagos = await pagosService.getBySocioDni(dni);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pagos del socio' });
  }
});

/**
 * POST /api/pagos
 * Crear un nuevo pago
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreatePagoDto = req.body;

    // Validaciones básicas
    if (!data.socioDni || !data.monto || !data.mes) {
      return res.status(400).json({
        error: 'DNI del socio, monto y mes son requeridos',
      });
    }

    const nuevoPago = await pagosService.create(data);
    res.status(201).json(nuevoPago);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear el pago' });
  }
});

/**
 * DELETE /api/pagos/:id
 * Eliminar un pago
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pagosService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al eliminar el pago' });
  }
});

export default router;

