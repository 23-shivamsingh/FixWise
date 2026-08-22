import { Request, Response, NextFunction } from 'express';
import * as impactService from '../services/impactService';

export async function getImpact(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.query;
    const impact = await impactService.getAggregatedImpactMetrics(
      typeof userId === 'string' ? userId : undefined
    );

    res.json({
      success: true,
      data: impact,
    });
  } catch (error) {
    next(error);
  }
}
