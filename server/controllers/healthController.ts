import { Request, Response } from 'express';
import { isDatabaseConnected } from '../lib/prisma';

export async function checkHealth(_req: Request, res: Response) {
  const dbConnected = await isDatabaseConnected();

  res.status(200).json({
    status: 'ok',
    service: 'FixWise AI Backend',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Neon PostgreSQL (Prisma)',
      connected: dbConnected,
    },
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
    },
  });
}
