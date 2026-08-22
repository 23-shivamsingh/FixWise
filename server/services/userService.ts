import { prisma, hasDatabaseConfigured } from '../lib/prisma';
import { UserRole } from '@prisma/client';

export interface SyncClerkUserInput {
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role?: 'USER' | 'REPAIRER' | 'ADMIN';
}

export async function syncClerkUser(input: SyncClerkUserInput) {
  const { clerkId, email, name, phone, avatar, role } = input;

  if (hasDatabaseConfigured) {
    try {
      // 1. Try to find user by clerkId
      let user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            avatar: avatar || user.avatar,
            phone: phone || user.phone,
            email: email || user.email,
            role: role ? (role as UserRole) : user.role,
          },
        });
        return user;
      }

      // 2. If no user by clerkId, check if existing user exists by email
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            clerkId,
            name: name || existingByEmail.name,
            avatar: avatar || existingByEmail.avatar,
            phone: phone || existingByEmail.phone,
            role: role ? (role as UserRole) : existingByEmail.role,
          },
        });
        return user;
      }

      // 3. Create new user
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name: name || 'FixWise User',
          phone: phone || null,
          avatar: avatar || null,
          role: role ? (role as UserRole) : UserRole.USER,
        },
      });

      return user;
    } catch {
      // Fallback below
    }
  }

  return {
    id: `usr-${clerkId || 'consumer-demo'}`,
    clerkId: clerkId || 'user_demo_123',
    email: email || 'consumer@fixwise.ai',
    name: name || 'Priya Sharma',
    phone: phone || '+91 98450 12345',
    avatar: avatar || null,
    role: (role as UserRole) || 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getUserByClerkId(clerkId: string) {
  if (hasDatabaseConfigured) {
    try {
      return await prisma.user.findUnique({
        where: { clerkId },
        include: {
          devices: true,
          repairCases: {
            include: {
              diagnosis: true,
              repairabilityScore: true,
            },
          },
          bookings: {
            include: {
              repairer: true,
              warranty: true,
              statusHistory: true,
            },
          },
        },
      });
    } catch {
      // Fallback below
    }
  }

  return {
    id: `usr-${clerkId}`,
    clerkId,
    email: 'consumer@fixwise.ai',
    name: 'Priya Sharma',
    phone: '+91 98450 12345',
    role: 'USER',
    devices: [],
    repairCases: [],
    bookings: [],
  };
}
