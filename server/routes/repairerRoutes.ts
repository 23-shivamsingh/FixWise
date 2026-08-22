import { Router } from 'express';
import { getRepairers, getRepairerById } from '../controllers/repairerController';

const router = Router();

router.get('/repairers', getRepairers);
router.get('/repairers/:id', getRepairerById);

export default router;
