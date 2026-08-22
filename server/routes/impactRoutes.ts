import { Router } from 'express';
import { getImpact } from '../controllers/impactController';

const router = Router();

router.get('/impact', getImpact);

export default router;
