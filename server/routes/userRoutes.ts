import { Router } from 'express';
import { syncUser, getCurrentUser } from '../controllers/userController';

const router = Router();

router.post('/users/sync', syncUser);
router.get('/users/me', getCurrentUser);

export default router;
