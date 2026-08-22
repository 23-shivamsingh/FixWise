import { prisma, hasDatabaseConfigured } from '../lib/prisma';
import { SeverityLevel, VerdictType } from '@prisma/client';

export interface CreateDiagnosisInput {
  userId?: string;
  deviceId?: string;
  brand: string;
  deviceModel: string;
  category: string;
  identifiedIssue: string;
  issueCategory: string;
  severity: SeverityLevel;
  confidenceScore: number;
  estimatedMinCostINR: number;
  estimatedMaxCostINR: number;
  estimatedTurnaroundHours?: number;
  rootCauses: string[];
  safetyHazard: boolean;
  safetyWarning?: string;
  troubleshootingSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    riskLevel: 'safe' | 'caution' | 'pro_only';
  }>;
  recommendedAction: string;
  images?: string[];
  repairability?: {
    score: number;
    partsAvailability: number;
    disassemblyComplexity: number;
    costFeasibility: number;
    regionalServiceability: number;
    ageFactor: number;
    verdict: VerdictType;
    reason: string;
    netSavingsINR?: number;
    breakEvenMonths?: number;
  };
}

export async function createDiagnosisRecord(data: CreateDiagnosisInput) {
  const trackingCode = `FW-${Math.floor(100000 + Math.random() * 900000)}`;

  if (hasDatabaseConfigured) {
    try {
      // Ensure default demo user if none passed
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
              phone: '+91 98450 12345',
              role: 'USER',
            },
          });
        }
        userId = demoUser.id;
      }

      const repairCase = await prisma.repairCase.create({
        data: {
          userId,
          deviceId: data.deviceId || null,
          trackingCode,
          status: 'DIAGNOSED',
          diagnosis: {
            create: {
              brand: data.brand,
              deviceModel: data.deviceModel,
              category: data.category,
              identifiedIssue: data.identifiedIssue,
              issueCategory: data.issueCategory,
              severity: data.severity,
              confidenceScore: data.confidenceScore,
              estimatedMinCostINR: data.estimatedMinCostINR,
              estimatedMaxCostINR: data.estimatedMaxCostINR,
              estimatedTurnaroundHours: data.estimatedTurnaroundHours || 24,
              rootCauses: data.rootCauses,
              safetyHazard: data.safetyHazard,
              safetyWarning: data.safetyWarning || null,
              troubleshootingSteps: data.troubleshootingSteps,
              recommendedAction: data.recommendedAction,
            },
          },
          images: {
            create: (data.images || []).map((imgUrl) => ({
              imageUrl: imgUrl,
              mimeType: 'image/jpeg',
            })),
          },
          ...(data.repairability
            ? {
                repairabilityScore: {
                  create: {
                    score: data.repairability.score,
                    partsAvailability: data.repairability.partsAvailability,
                    disassemblyComplexity: data.repairability.disassemblyComplexity,
                    costFeasibility: data.repairability.costFeasibility,
                    regionalServiceability: data.repairability.regionalServiceability,
                    ageFactor: data.repairability.ageFactor,
                    verdict: data.repairability.verdict,
                    reason: data.repairability.reason,
                    netSavingsINR: data.repairability.netSavingsINR || 0,
                    breakEvenMonths: data.repairability.breakEvenMonths || 0,
                  },
                },
              }
            : {}),
        },
        include: {
          diagnosis: true,
          images: true,
          repairabilityScore: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return repairCase;
    } catch {
      // Fallback below
    }
  }

  // Memory fallback representation
  return {
    id: `case-${Date.now()}`,
    userId: data.userId || 'usr-consumer-demo',
    deviceId: data.deviceId || null,
    trackingCode,
    status: 'DIAGNOSED',
    createdAt: new Date(),
    diagnosis: {
      id: `diag-${Date.now()}`,
      brand: data.brand,
      deviceModel: data.deviceModel,
      category: data.category,
      identifiedIssue: data.identifiedIssue,
      issueCategory: data.issueCategory,
      severity: data.severity,
      confidenceScore: data.confidenceScore,
      estimatedMinCostINR: data.estimatedMinCostINR,
      estimatedMaxCostINR: data.estimatedMaxCostINR,
      estimatedTurnaroundHours: data.estimatedTurnaroundHours || 24,
      rootCauses: data.rootCauses,
      safetyHazard: data.safetyHazard,
      safetyWarning: data.safetyWarning || null,
      troubleshootingSteps: data.troubleshootingSteps,
      recommendedAction: data.recommendedAction,
    },
    images: (data.images || []).map((url, i) => ({ id: `img-${i}`, imageUrl: url, mimeType: 'image/jpeg' })),
    repairabilityScore: data.repairability ? { ...data.repairability, id: `rep-${Date.now()}` } : null,
    user: { id: 'usr-consumer-demo', name: 'Priya Sharma', email: 'consumer@fixwise.ai' },
  };
}

export async function getDiagnosisById(repairCaseId: string) {
  if (hasDatabaseConfigured) {
    try {
      const repairCase = await prisma.repairCase.findUnique({
        where: { id: repairCaseId },
        include: {
          diagnosis: true,
          images: true,
          repairabilityScore: true,
          quotes: {
            include: {
              repairer: true,
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      if (repairCase) return repairCase;
    } catch {
      // Fallback below
    }
  }

  return null;
}

