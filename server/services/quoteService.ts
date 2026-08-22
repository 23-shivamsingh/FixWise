import { prisma, hasDatabaseConfigured } from '../lib/prisma';
import { SEEDED_REPAIRERS } from '../../src/data/seedData';

export interface GenerateQuotesInput {
  repairCaseId: string;
}

export async function getQuotesForRepairCase(repairCaseId: string) {
  if (hasDatabaseConfigured) {
    try {
      const quotes = await prisma.quote.findMany({
        where: { repairCaseId },
        include: {
          repairer: true,
          booking: true,
        },
        orderBy: {
          totalCostINR: 'asc',
        },
      });

      if (quotes && quotes.length > 0) {
        return quotes;
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback quote generation based on seeded repairers
  return SEEDED_REPAIRERS.slice(0, 4).map((r, index) => {
    const partsCostINR = 2400 + index * 350;
    const laborCostINR = 1800 + index * 200;
    return {
      id: `quote-${repairCaseId}-${r.id}`,
      repairCaseId,
      repairerId: r.id,
      partsCostINR,
      laborCostINR,
      totalCostINR: partsCostINR + laborCostINR,
      turnaroundDays: index === 0 ? 1 : 2,
      warrantyDays: r.warrantyDays || 90,
      fairnessScore: 94 - index * 2,
      isBestValue: index === 0,
      isLowestPrice: index === 1,
      isFastest: index === 0,
      notes: `OEM component overhaul with ${r.warrantyDays || 90}-day zero-deductible FixWise guarantee.`,
      repairer: {
        id: r.id,
        name: r.name,
        profileImage: r.logo,
        rating: r.rating,
        distanceKm: r.distanceKm,
        address: r.address,
        phone: r.phone,
      },
    };
  });
}

export async function generateQuotesForRepairCase(repairCaseId: string) {
  if (hasDatabaseConfigured) {
    try {
      const repairCase = await prisma.repairCase.findUnique({
        where: { id: repairCaseId },
        include: {
          diagnosis: true,
        },
      });

      if (repairCase && repairCase.diagnosis) {
        const diagnosis = repairCase.diagnosis;
        const repairers = await prisma.repairer.findMany({
          take: 6,
          orderBy: { rating: 'desc' },
        });

        const avgMin = diagnosis.estimatedMinCostINR;
        const avgMax = diagnosis.estimatedMaxCostINR;
        const baseParts = Math.round((avgMin + avgMax) * 0.35);

        const quotesToCreate = repairers.map((r, index) => {
          const multiplier = 0.88 + index * 0.08;
          const partsCost = Math.round(baseParts * multiplier);
          const laborCost = Math.round(((avgMin + avgMax) * 0.25) * multiplier);
          const totalCost = partsCost + laborCost;
          const turnaroundDays = index === 0 ? 1 : index === 1 ? 1 : 2;
          const warrantyDays = r.warrantyDays || 90;

          return {
            repairCaseId,
            repairerId: r.id,
            partsCostINR: partsCost,
            laborCostINR: laborCost,
            totalCostINR: totalCost,
            turnaroundDays,
            warrantyDays,
            fairnessScore: Math.min(99, 90 + Math.floor(Math.random() * 9)),
            isBestValue: index === 0,
            isLowestPrice: index === 1,
            isFastest: index === 2,
            notes: `Includes OEM-certified replacement parts and ${warrantyDays}-day zero-deductible FixWise coverage.`,
          };
        });

        await prisma.quote.deleteMany({
          where: { repairCaseId },
        });

        await prisma.quote.createMany({
          data: quotesToCreate,
        });

        return getQuotesForRepairCase(repairCaseId);
      }
    } catch {
      // Fallback below
    }
  }

  return getQuotesForRepairCase(repairCaseId);
}

export async function createManualQuote(data: {
  repairCaseId: string;
  repairerId: string;
  partsCostINR: number;
  laborCostINR: number;
  turnaroundDays: number;
  warrantyDays: number;
  notes?: string;
}) {
  const totalCostINR = data.partsCostINR + data.laborCostINR;
  if (hasDatabaseConfigured) {
    try {
      return await prisma.quote.create({
        data: {
          ...data,
          totalCostINR,
          fairnessScore: 95,
        },
        include: {
          repairer: true,
        },
      });
    } catch {
      // Fallback below
    }
  }

  const rep = SEEDED_REPAIRERS.find((r) => r.id === data.repairerId) || SEEDED_REPAIRERS[0];
  return {
    id: `quote-${Date.now()}`,
    ...data,
    totalCostINR,
    fairnessScore: 95,
    repairer: {
      id: rep.id,
      name: rep.name,
      profileImage: rep.logo,
      rating: rep.rating,
    },
  };
}
