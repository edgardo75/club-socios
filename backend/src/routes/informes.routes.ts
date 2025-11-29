import { Router, Request, Response } from 'express';
import { InformesService } from '../services/informes.service';

const router = Router();
const informesService = new InformesService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const informe = await informesService.getEstadoSocios();
    res.json(informe);
  } catch (error) {
    console.error('Error al generar informe:', error);
    res.status(500).json({ error: 'Error al generar el informe' });
  }
});

export default router;
