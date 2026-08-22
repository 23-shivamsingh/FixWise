import { Router } from 'express';
import { createDiagnosis, getDiagnosis } from '../controllers/diagnosisController';

const router = Router();

router.post('/diagnoses', createDiagnosis);
router.get('/diagnoses/:id', getDiagnosis);

export default router;
