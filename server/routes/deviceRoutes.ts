import { Router } from 'express';
import { getDevices, createDevice } from '../controllers/deviceController';

const router = Router();

router.get('/devices', getDevices);
router.post('/devices', createDevice);

export default router;
