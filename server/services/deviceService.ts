import { prisma, hasDatabaseConfigured } from '../lib/prisma';
import { DeviceCategory } from '@prisma/client';
import { INITIAL_USER_DEVICES } from '../../src/data/seedData';

export interface CreateDeviceInput {
  userId?: string;
  brand: string;
  model: string;
  category?: DeviceCategory;
  purchaseDate?: string;
  originalPriceINR?: number;
  batteryHealthPct?: number;
  computeHealthPct?: number;
  chassisCondition?: string;
  repairabilityScore?: number;
  serialNumber?: string;
}

export async function getUserDevices(userId?: string) {
  if (hasDatabaseConfigured) {
    try {
      const whereClause: any = {};
      if (userId) {
        whereClause.userId = userId;
      }

      const devices = await prisma.device.findMany({
        where: whereClause,
        include: {
          repairCases: {
            include: {
              diagnosis: true,
              bookings: {
                include: {
                  repairer: true,
                  warranty: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (devices && devices.length > 0) {
        return devices;
      }
    } catch {
      // Fallback below
    }
  }

  return INITIAL_USER_DEVICES.map((d) => ({
    id: d.id,
    userId: 'usr-consumer-demo',
    brand: d.brand,
    model: d.model,
    category: d.category.toUpperCase(),
    purchaseDate: new Date(d.purchaseDate),
    originalPriceINR: d.purchasePrice,
    batteryHealthPct: d.batteryHealth,
    computeHealthPct: d.performanceScore,
    chassisCondition: `${d.physicalCondition}% Condition`,
    repairabilityScore: d.repairabilityScore,
    serialNumber: `SN-${d.id.toUpperCase()}`,
    createdAt: new Date(d.purchaseDate),
    updatedAt: new Date(),
    repairCases: [],
  }));
}

export async function createDevice(data: CreateDeviceInput) {
  try {
    let userId = data.userId;
    if (!userId) {
      let demoUser = await prisma.user.findFirst({
        where: { email: 'consumer@fixwise.ai' },
      });
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'consumer@fixwise.ai',
            name: 'Priya Sharma',
            role: 'USER',
          },
        });
      }
      userId = demoUser.id;
    }

    return await prisma.device.create({
      data: {
        userId,
        brand: data.brand,
        model: data.model,
        category: data.category || 'LAPTOP',
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
        originalPriceINR: data.originalPriceINR || 50000,
        batteryHealthPct: data.batteryHealthPct || 90,
        computeHealthPct: data.computeHealthPct || 95,
        chassisCondition: data.chassisCondition || 'Good',
        repairabilityScore: data.repairabilityScore || 85,
        serialNumber: data.serialNumber || `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });
  } catch (err) {
    console.warn('[DeviceService] createDevice fallback:', (err as Error).message);
    return {
      id: `dev-${Date.now()}`,
      userId: data.userId || 'usr-consumer-demo',
      brand: data.brand,
      model: data.model,
      category: data.category || 'LAPTOP',
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
      originalPriceINR: data.originalPriceINR || 50000,
      batteryHealthPct: data.batteryHealthPct || 90,
      computeHealthPct: data.computeHealthPct || 95,
      chassisCondition: data.chassisCondition || 'Good',
      repairabilityScore: data.repairabilityScore || 85,
      serialNumber: data.serialNumber || `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
