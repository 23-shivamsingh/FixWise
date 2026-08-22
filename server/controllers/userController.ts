import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export async function syncUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { clerkId, email, name, phone, avatar, role } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: clerkId and email are required',
      });
    }

    const user = await userService.syncClerkUser({
      clerkId,
      email,
      name: name || 'FixWise User',
      phone,
      avatar,
      role,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const clerkId = req.headers['x-clerk-user-id'] as string;
    const email = req.headers['x-clerk-user-email'] as string;

    if (!clerkId && !email) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No user identifier provided in headers',
      });
    }

    let user = clerkId ? await userService.getUserByClerkId(clerkId) : null;

    if (!user && email) {
      // Fallback lookup by email
      user = await userService.syncClerkUser({
        clerkId: clerkId || `clerk_${Date.now()}`,
        email,
        name: 'User',
      }) as any;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
