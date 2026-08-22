import { Router } from 'express';
import { getQuotesForRepairCase, createQuote } from '../controllers/quoteController';

const router = Router();

router.get('/quotes/:repairCaseId', getQuotesForRepairCase);
router.post('/quotes', createQuote);

export default router;
