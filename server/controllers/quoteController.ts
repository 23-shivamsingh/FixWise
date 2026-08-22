import { Request, Response, NextFunction } from 'express';
import * as quoteService from '../services/quoteService';

export async function getQuotesForRepairCase(req: Request, res: Response, next: NextFunction) {
  try {
    const { repairCaseId } = req.params;
    let quotes = await quoteService.getQuotesForRepairCase(repairCaseId);

    // If no quotes exist yet, auto-generate realistic quotes for this repairCase
    if (!quotes || quotes.length === 0) {
      quotes = await quoteService.generateQuotesForRepairCase(repairCaseId);
    }

    res.json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error) {
    next(error);
  }
}

export async function createQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const { repairCaseId, repairerId, partsCostINR, laborCostINR, turnaroundDays, warrantyDays, notes } = req.body;

    if (!repairCaseId || !repairerId || partsCostINR === undefined || laborCostINR === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required quote fields (repairCaseId, repairerId, partsCostINR, laborCostINR)',
      });
    }

    const newQuote = await quoteService.createManualQuote({
      repairCaseId,
      repairerId,
      partsCostINR: Number(partsCostINR),
      laborCostINR: Number(laborCostINR),
      turnaroundDays: Number(turnaroundDays || 1),
      warrantyDays: Number(warrantyDays || 90),
      notes,
    });

    res.status(201).json({
      success: true,
      data: newQuote,
    });
  } catch (error) {
    next(error);
  }
}
