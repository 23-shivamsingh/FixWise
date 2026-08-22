import { Request, Response, NextFunction } from 'express';
import * as diagnosisService from '../services/diagnosisService';

export async function createDiagnosis(req: Request, res: Response, next: NextFunction) {
  try {
    const input: diagnosisService.CreateDiagnosisInput = req.body;

    if (!input.brand || !input.deviceModel || !input.identifiedIssue) {
      return res.status(400).json({
        success: false,
        error: 'Missing required diagnosis parameters (brand, deviceModel, identifiedIssue)',
      });
    }

    const created = await diagnosisService.createDiagnosisRecord(input);
    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDiagnosis(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const diagnosis = await diagnosisService.getDiagnosisById(id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        error: 'Diagnosis case not found',
      });
    }

    res.json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    next(error);
  }
}
