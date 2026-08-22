import { Request, Response, NextFunction } from 'express';
import * as deviceService from '../services/deviceService';

export async function getDevices(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.query;
    const devices = await deviceService.getUserDevices(typeof userId === 'string' ? userId : undefined);

    res.json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const input: deviceService.CreateDeviceInput = req.body;

    if (!input.brand || !input.model) {
      return res.status(400).json({
        success: false,
        error: 'Missing required device fields (brand, model)',
      });
    }

    const device = await deviceService.createDevice(input);
    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    next(error);
  }
}
