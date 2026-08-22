import { Request, Response, NextFunction } from 'express';
import * as repairerService from '../services/repairerService';

export async function getRepairers(req: Request, res: Response, next: NextFunction) {
  try {
    const { city, isVerified, minRating, userLat, userLng } = req.query;

    const filter: repairerService.RepairerFilterOptions = {
      city: typeof city === 'string' ? city : undefined,
      isVerified: isVerified !== undefined ? isVerified === 'true' : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      userLat: userLat ? parseFloat(userLat as string) : undefined,
      userLng: userLng ? parseFloat(userLng as string) : undefined,
    };

    const repairers = await repairerService.getAllRepairers(filter);
    res.json({
      success: true,
      count: repairers.length,
      data: repairers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRepairerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const repairer = await repairerService.getRepairerById(id);

    if (!repairer) {
      return res.status(404).json({
        success: false,
        error: 'Repairer not found',
      });
    }

    res.json({
      success: true,
      data: repairer,
    });
  } catch (error) {
    next(error);
  }
}
