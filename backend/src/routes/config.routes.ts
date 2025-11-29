import { Router, Request, Response } from 'express';
import { ConfigService } from '../services/config.service';

const router = Router();
const configService = new ConfigService();

router.get('/', (req: Request, res: Response) => {
  try {
    const config = configService.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error getting config' });
  }
});

router.put('/', (req: Request, res: Response) => {
  try {
    const newConfig = req.body;
    const updatedConfig = configService.updateConfig(newConfig);
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: 'Error updating config' });
  }
});

export default router;
