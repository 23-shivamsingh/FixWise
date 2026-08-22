import {
  Repairer,
  Quote,
  RepairBooking,
  UserDevice,
  SustainabilityMetrics,
  DiagnosisResult,
  RepairStatus,
  TimelineEvent,
  DeviceCategory,
} from '../types';
import {
  SEEDED_REPAIRERS,
  INITIAL_BOOKINGS,
  INITIAL_USER_DEVICES,
  INITIAL_SUSTAINABILITY,
} from '../data/seedData';

// Map Prisma BookingStatus to Frontend RepairStatus
export function mapPrismaStatusToFrontend(prismaStatus: string): RepairStatus {
  switch (prismaStatus) {
    case 'REQUESTED':
      return 'requested';
    case 'REPAIRER_ACCEPTED':
      return 'repairer_accepted';
    case 'DEVICE_RECEIVED':
      return 'device_received';
    case 'DIAGNOSIS_CONFIRMED':
      return 'diagnosis_confirmed';
    case 'IN_PROGRESS':
      return 'in_progress';
    case 'QUALITY_CHECK':
      return 'quality_check';
    case 'READY_FOR_PICKUP':
      return 'ready_for_pickup';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return (prismaStatus.toLowerCase() as RepairStatus) || 'requested';
  }
}

// Map Frontend RepairStatus to Prisma BookingStatus
export function mapFrontendStatusToPrisma(frontendStatus: RepairStatus): string {
  switch (frontendStatus) {
    case 'requested':
      return 'REQUESTED';
    case 'repairer_accepted':
      return 'REPAIRER_ACCEPTED';
    case 'device_received':
      return 'DEVICE_RECEIVED';
    case 'diagnosis_confirmed':
      return 'DIAGNOSIS_CONFIRMED';
    case 'in_progress':
      return 'IN_PROGRESS';
    case 'quality_check':
      return 'QUALITY_CHECK';
    case 'ready_for_pickup':
      return 'READY_FOR_PICKUP';
    case 'completed':
      return 'COMPLETED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return frontendStatus.toUpperCase().replace(/\s+/g, '_');
  }
}

// Helper to convert backend Repairer record to Frontend Repairer type
export function transformDbRepairerToFrontend(db: any): Repairer {
  // Find seed matching for rich icons/taglines if DB record doesn't have custom ones
  const matchingSeed = SEEDED_REPAIRERS.find(
    (s) => s.name.toLowerCase() === db.name.toLowerCase() || s.id === db.id
  );

  return {
    id: db.id,
    name: db.name,
    tagline: db.description || matchingSeed?.tagline || 'Authorized Component-Level Hardware Specialist',
    logo: db.profileImage || matchingSeed?.logo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80',
    rating: Number(db.rating) || 4.9,
    reviewCount: db._count?.reviews ?? db.reviewCount ?? matchingSeed?.reviewCount ?? 120,
    verified: db.isVerified ?? true,
    distanceKm: db.distanceKm ?? matchingSeed?.distanceKm ?? 1.8,
    lat: db.latitude || matchingSeed?.lat || 12.9716,
    lng: db.longitude || matchingSeed?.lng || 77.5946,
    address: db.address || 'Koramangala 5th Block, Bengaluru',
    city: db.city || 'Bengaluru',
    phone: db.phone || '+91 80 4123 9901',
    yearsInBusiness: matchingSeed?.yearsInBusiness || 8,
    trustScore: matchingSeed?.trustScore || 96,
    trustBreakdown: matchingSeed?.trustBreakdown || {
      verification: 98,
      reviewsScore: 95,
      completionRate: 99,
      quoteAccuracy: 94,
      warrantyPerformance: 97,
    },
    priceRange: `₹${Math.round(db.minPriceINR || 1500).toLocaleString('en-IN')} - ₹${Math.round(db.maxPriceINR || 4500).toLocaleString('en-IN')}`,
    avgTurnaroundDays: db.avgTurnaroundHours ? Math.ceil(db.avgTurnaroundHours / 24) : (matchingSeed?.avgTurnaroundDays || 2),
    warrantyDays: db.warrantyDays || matchingSeed?.warrantyDays || 90,
    specialties: db.services?.map((s: any) => s.name) || matchingSeed?.specialties || [
      'Thermal Overhaul',
      'Logic Board Rework',
      'Micro-Soldering',
    ],
    certifications: matchingSeed?.certifications || ['IPC-7711/7721 Certified', 'ESD-Safe Class 1000'],
    reviews: (db.reviews || []).map((r: any) => ({
      id: r.id,
      userName: r.user?.name || 'Verified Customer',
      userAvatar: r.user?.avatar || undefined,
      rating: r.rating || 5,
      date: new Date(r.createdAt).toISOString().split('T')[0],
      comment: r.comment,
      deviceRepaired: 'Electronics Hardware',
    })).concat(matchingSeed?.reviews || []),
  };
}

// Transform DB Quote to Frontend Quote
export function transformDbQuoteToFrontend(db: any): Quote {
  const repairerName = db.repairer?.name || 'Authorized Lab';
  const matchingSeedRepairer = SEEDED_REPAIRERS.find(
    (s) => s.id === db.repairerId || s.name.toLowerCase() === repairerName.toLowerCase()
  );

  return {
    id: db.id,
    repairCaseId: db.repairCaseId,
    repairerId: db.repairerId,
    repairerName,
    repairerLogo: db.repairer?.profileImage || matchingSeedRepairer?.logo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80',
    repairerRating: db.repairer?.rating || matchingSeedRepairer?.rating || 4.9,
    repairerDistanceKm: db.repairer?.distanceKm || matchingSeedRepairer?.distanceKm || 1.8,
    repairerExperienceYears: matchingSeedRepairer?.yearsInBusiness || 8,
    price: Math.round(db.totalCostINR || (db.partsCostINR + db.laborCostINR)),
    partsCost: Math.round(db.partsCostINR || 0),
    laborCost: Math.round(db.laborCostINR || 0),
    turnaroundDays: db.turnaroundDays || 1,
    warrantyDays: db.warrantyDays || 90,
    notes: db.notes || 'OEM Component Replacement with FixWise Zero-Deductible Guarantee.',
    includedServices: [
      'Precision Hardware Bench Inspection',
      'OEM Grade Replacement Components',
      '100% Thermal & Stress Load Testing',
      `${db.warrantyDays || 90}-Day Zero-Deductible Warranty`,
    ],
    isBestValue: db.isBestValue || false,
    isCheapest: db.isLowestPrice || false,
    isFastest: db.isFastest || false,
    fairnessScore: db.fairnessScore || 94,
    status: 'pending',
    createdAt: new Date(db.createdAt || Date.now()).toISOString(),
  };
}

// Generate Timeline for a Booking
function buildTimelineFromHistory(bookingDb: any): TimelineEvent[] {
  const statusHistory = bookingDb.statusHistory || [];
  const currentStatus = mapPrismaStatusToFrontend(bookingDb.status);

  const statusOrder: { status: RepairStatus; label: string; defaultDesc: string }[] = [
    {
      status: 'requested',
      label: 'Repair Requested',
      defaultDesc: `Quote accepted with ${bookingDb.repairer?.name || 'Technician'} for ₹${Math.round(bookingDb.totalAmountINR).toLocaleString('en-IN')}.`,
    },
    {
      status: 'repairer_accepted',
      label: 'Repairer Accepted',
      defaultDesc: `${bookingDb.repairer?.name || 'Technician'} confirmed bench reservation and OEM parts queue.`,
    },
    {
      status: 'device_received',
      label: 'Device Handover',
      defaultDesc: `Device received at lab on scheduled date ${bookingDb.scheduledDate ? new Date(bookingDb.scheduledDate).toLocaleDateString() : ''}.`,
    },
    {
      status: 'diagnosis_confirmed',
      label: 'Diagnosis Confirmed',
      defaultDesc: 'Multimeter & thermal camera verification completed. Fault isolated.',
    },
    {
      status: 'in_progress',
      label: 'Bench Repair & Parts Rework',
      defaultDesc: bookingDb.quote?.notes || 'Ultrasonic heatsink flush and micro-soldering rework active.',
    },
    {
      status: 'quality_check',
      label: 'Quality & Thermal Check',
      defaultDesc: 'Passed 100% hardware bench stress tests and warranty sticker sealed.',
    },
    {
      status: 'ready_for_pickup',
      label: 'Ready for Pickup / Return',
      defaultDesc: 'Device packaged with digital passport token.',
    },
    {
      status: 'completed',
      label: 'Completed & Warranty Active',
      defaultDesc: `${bookingDb.quote?.warrantyDays || 90}-day zero-deductible FixWise warranty activated.`,
    },
  ];

  const currentIdx = statusOrder.findIndex((s) => s.status === currentStatus);

  return statusOrder.map((step, idx) => {
    const isCompleted = idx <= (currentIdx >= 0 ? currentIdx : 0);
    const isCurrent = idx === currentIdx;

    // Check if there is a matching status history record from DB
    const matchingHist = statusHistory.find(
      (h: any) => mapPrismaStatusToFrontend(h.status) === step.status
    );

    return {
      status: step.status,
      label: step.label,
      description: matchingHist?.note || step.defaultDesc,
      timestamp: matchingHist
        ? new Date(matchingHist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : isCurrent
        ? 'Just updated'
        : isCompleted
        ? 'Completed'
        : 'Estimated pending',
      completed: isCompleted,
      current: isCurrent,
      updatedBy: matchingHist?.updatedBy || undefined,
    };
  });
}

// Transform DB Booking to Frontend RepairBooking
export function transformDbBookingToFrontend(db: any): RepairBooking {
  const matchingSeedRep = SEEDED_REPAIRERS.find((s) => s.id === db.repairerId);
  const repairer = db.repairer
    ? transformDbRepairerToFrontend(db.repairer)
    : matchingSeedRep || SEEDED_REPAIRERS[0];

  const quote = db.quote
    ? transformDbQuoteToFrontend(db.quote)
    : {
        id: db.quoteId,
        repairCaseId: db.repairCaseId,
        repairerId: db.repairerId,
        repairerName: repairer.name,
        repairerLogo: repairer.logo,
        repairerRating: repairer.rating,
        repairerDistanceKm: repairer.distanceKm,
        repairerExperienceYears: repairer.yearsInBusiness,
        price: Math.round(db.totalAmountINR),
        partsCost: Math.round(db.totalAmountINR * 0.4),
        laborCost: Math.round(db.totalAmountINR * 0.6),
        turnaroundDays: 2,
        warrantyDays: db.warranty?.warrantyDays || 90,
        notes: db.notes || 'OEM Certified repair with warranty',
        includedServices: ['Bench testing', 'Component rework'],
        fairnessScore: 95,
        status: 'accepted' as const,
        createdAt: new Date(db.createdAt).toISOString(),
      };

  // Reconstruct diagnosis result
  const rawDiag = db.repairCase?.diagnosis;
  const rawScore = db.repairCase?.repairabilityScore;
  const images = (db.repairCase?.images || []).map((img: any) => img.imageUrl);

  const diagnosis: DiagnosisResult = {
    id: db.repairCaseId,
    deviceCategory: (rawDiag?.category?.toLowerCase() || 'laptop') as DeviceCategory,
    deviceModel: rawDiag?.deviceModel || 'Electronics Device',
    brand: rawDiag?.brand || 'Generic',
    purchaseYear: 2022,
    originalPrice: 85000,
    userDescription: rawDiag?.identifiedIssue || 'Hardware repair case',
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'],
    identifiedIssue: rawDiag?.identifiedIssue || 'Hardware Malfunction',
    possibleCauses: Array.isArray(rawDiag?.rootCauses)
      ? rawDiag.rootCauses
      : ['Hardware degradation', 'Thermal paste dry-out'],
    severity: (rawDiag?.severity?.toLowerCase() || 'moderate') as any,
    confidence: (rawDiag?.confidenceScore || 90) / 100,
    safetyRisk: rawDiag?.safetyHazard ? 'dangerous_stop_using' : 'low_risk',
    safetyWarningText: rawDiag?.safetyWarning || undefined,
    hazardType: rawDiag?.safetyHazard ? 'overheating' : 'none',
    professionalRepairRecommended: true,
    estimatedRepairCostMin: rawDiag?.estimatedMinCostINR || Math.round(db.totalAmountINR * 0.85),
    estimatedRepairCostMax: rawDiag?.estimatedMaxCostINR || Math.round(db.totalAmountINR * 1.15),
    replacementCostEstimate: Math.round(db.totalAmountINR * 4),
    expectedLifeExtensionMonths: 24,
    expectedReplacementLifeYears: 4,
    repairabilityScore: rawScore?.score || 82,
    repairabilityBreakdown: {
      partsAvailability: rawScore?.partsAvailability || 85,
      repairComplexity: rawScore?.disassemblyComplexity || 80,
      costFeasibility: rawScore?.costFeasibility || 88,
      localServiceability: rawScore?.regionalServiceability || 90,
      productAgeFactor: rawScore?.ageFactor || 80,
    },
    repairVsReplaceVerdict: (rawScore?.verdict === 'REPLACE' ? 'CONSIDER REPLACEMENT' : 'REPAIR'),
    verdictReason: rawScore?.reason || 'Repair is economically viable and extends device lifecycle significantly.',
    estimatedSavings: Math.round(db.totalAmountINR * 2.5),
    troubleshootingSteps: Array.isArray(rawDiag?.troubleshootingSteps)
      ? rawDiag.troubleshootingSteps.map((step: any, idx: number) => ({
          id: `step-${idx}`,
          title: step.title || `Step ${idx + 1}`,
          description: step.description || '',
          difficulty: 'Medium' as const,
          timeEstimate: '15 mins',
          riskLevel: 'Moderate risk' as const,
          safeForDIY: step.riskLevel === 'safe',
          instructions: [step.description || ''],
        }))
      : [],
    timestamp: new Date(db.createdAt).toISOString(),
  };

  const warrantyDays = db.warranty?.warrantyDays || quote.warrantyDays || 90;
  const warrantyExpiryDate = db.warranty?.expiryDate
    ? new Date(db.warranty.expiryDate).toISOString().split('T')[0]
    : new Date(Date.now() + warrantyDays * 86400000).toISOString().split('T')[0];

  return {
    id: db.id,
    caseId: db.repairCaseId,
    diagnosis,
    repairer,
    quote,
    customerName: db.customerName,
    customerPhone: db.customerPhone,
    customerAddress: db.customerAddress,
    preferredDate: db.scheduledDate ? new Date(db.scheduledDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    timeSlot: db.scheduledSlot || '11:00 AM - 01:00 PM',
    status: mapPrismaStatusToFrontend(db.status),
    timeline: buildTimelineFromHistory(db),
    warrantyExpiryDate,
    warrantyDays,
    trackingCode: db.trackingCode,
    paymentStatus: db.paymentStatus === 'PAID' ? 'completed' : 'pending_on_pickup',
    totalAmount: Math.round(db.totalAmountINR),
    ratingGiven: db.review?.rating || undefined,
    reviewGiven: db.review?.comment || undefined,
    createdAt: new Date(db.createdAt).toISOString(),
    updatedAt: new Date(db.updatedAt).toISOString(),
  };
}

// Transform DB Device to Frontend UserDevice
export function transformDbDeviceToFrontend(db: any): UserDevice {
  return {
    id: db.id,
    name: `${db.brand} ${db.model}`,
    category: (db.category?.toLowerCase() || 'laptop') as DeviceCategory,
    brand: db.brand,
    model: db.model,
    purchaseDate: db.purchaseDate ? new Date(db.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    purchasePrice: db.originalPriceINR || 50000,
    overallHealthScore: Math.round(((db.batteryHealthPct || 90) + (db.computeHealthPct || 95)) / 2),
    batteryHealth: db.batteryHealthPct || 90,
    physicalCondition: db.chassisCondition === 'Pristine' ? 98 : db.chassisCondition === 'Good' ? 90 : 80,
    performanceScore: db.computeHealthPct || 92,
    repairabilityScore: db.repairabilityScore || 85,
    repairsCount: db.repairCases?.length || 0,
    totalRepairSpend: (db.repairCases || []).reduce((acc: number, c: any) => {
      const bookingsTotal = (c.bookings || []).reduce((bAcc: number, b: any) => bAcc + (b.totalAmountINR || 0), 0);
      return acc + bookingsTotal;
    }, 0),
    partsReplaced: ['Thermal Interface Material', 'OEM Battery'],
    activeWarrantyCount: (db.repairCases || []).filter((c: any) =>
      (c.bookings || []).some((b: any) => b.warranty?.isActive)
    ).length,
    carbonAvoidedKg: Math.round(((db.repairCases?.length || 1) * 2.8) * 10) / 10,
    lastDiagnosisDate: db.updatedAt ? new Date(db.updatedAt).toISOString().split('T')[0] : undefined,
  };
}

// ==========================================
// API CLIENT CALLS WITH GRACEFUL FALLBACKS
// ==========================================

export async function fetchApiRepairers(params?: {
  city?: string;
  isVerified?: boolean;
  minRating?: number;
  userLat?: number;
  userLng?: number;
}): Promise<Repairer[]> {
  try {
    const query = new URLSearchParams();
    if (params?.city) query.set('city', params.city);
    if (params?.isVerified !== undefined) query.set('isVerified', String(params.isVerified));
    if (params?.minRating) query.set('minRating', String(params.minRating));
    if (params?.userLat) query.set('userLat', String(params.userLat));
    if (params?.userLng) query.set('userLng', String(params.userLng));

    const res = await fetch(`/api/repairers?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(transformDbRepairerToFrontend);
    }
  } catch (err) {
    console.warn('Backend repairers endpoint not reachable, using seeded marketplace data:', err);
  }
  return SEEDED_REPAIRERS;
}

export async function fetchApiQuotesForCase(repairCaseId: string): Promise<Quote[]> {
  try {
    const res = await fetch(`/api/quotes/${encodeURIComponent(repairCaseId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(transformDbQuoteToFrontend);
    }
  } catch (err) {
    console.warn('Quotes API not reachable for case:', repairCaseId, err);
  }
  return [];
}

export async function fetchApiBookings(userId?: string): Promise<RepairBooking[]> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/bookings${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(transformDbBookingToFrontend);
    }
  } catch (err) {
    console.warn('Backend bookings endpoint not reachable, using fallback demo records:', err);
  }
  return INITIAL_BOOKINGS;
}

export async function saveDiagnosisToBackend(
  diagnosis: DiagnosisResult,
  userId?: string
): Promise<{ repairCaseId: string; trackingCode: string } | null> {
  try {
    const payload = {
      userId,
      brand: diagnosis.brand,
      deviceModel: diagnosis.deviceModel,
      category: diagnosis.deviceCategory.toUpperCase(),
      identifiedIssue: diagnosis.identifiedIssue,
      issueCategory: diagnosis.hazardType || 'HARDWARE',
      severity: diagnosis.severity.toUpperCase() === 'CRITICAL' ? 'CRITICAL' : diagnosis.severity.toUpperCase() === 'LOW' ? 'LOW' : 'MODERATE',
      confidenceScore: Math.round(diagnosis.confidence * 100),
      estimatedMinCostINR: diagnosis.estimatedRepairCostMin,
      estimatedMaxCostINR: diagnosis.estimatedRepairCostMax,
      estimatedTurnaroundHours: 24,
      rootCauses: diagnosis.possibleCauses,
      safetyHazard: diagnosis.safetyRisk === 'dangerous_stop_using' || diagnosis.safetyRisk === 'professional_recommended',
      safetyWarning: diagnosis.safetyWarningText,
      troubleshootingSteps: diagnosis.troubleshootingSteps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title,
        description: s.description,
        riskLevel: s.safeForDIY ? 'safe' : 'caution',
      })),
      recommendedAction: diagnosis.verdictReason,
      images: diagnosis.images,
      repairability: {
        score: diagnosis.repairabilityScore,
        partsAvailability: diagnosis.repairabilityBreakdown.partsAvailability,
        disassemblyComplexity: diagnosis.repairabilityBreakdown.repairComplexity,
        costFeasibility: diagnosis.repairabilityBreakdown.costFeasibility,
        regionalServiceability: diagnosis.repairabilityBreakdown.localServiceability,
        ageFactor: diagnosis.repairabilityBreakdown.productAgeFactor,
        verdict: diagnosis.repairVsReplaceVerdict === 'REPAIR' ? 'REPAIR' : 'REPLACE',
        reason: diagnosis.verdictReason,
        netSavingsINR: diagnosis.estimatedSavings,
        breakEvenMonths: diagnosis.expectedLifeExtensionMonths,
      },
    };

    const res = await fetch('/api/diagnoses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.id) {
        return {
          repairCaseId: json.data.id,
          trackingCode: json.data.trackingCode,
        };
      }
    }
  } catch (err) {
    console.warn('Could not persist diagnosis to backend:', err);
  }
  return null;
}

export async function createApiBooking(data: {
  repairCaseId: string;
  quoteId: string;
  repairerId: string;
  userId?: string;
  scheduledDate: string;
  scheduledSlot: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
}): Promise<RepairBooking | null> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return transformDbBookingToFrontend(json.data);
      }
    }
  } catch (err) {
    console.warn('Booking creation API error:', err);
  }
  return null;
}

export async function updateApiBookingStatus(
  bookingId: string,
  status: RepairStatus,
  note?: string,
  updatedBy: string = 'TECHNICIAN'
): Promise<RepairBooking | null> {
  try {
    const prismaStatus = mapFrontendStatusToPrisma(status);
    const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: prismaStatus,
        note,
        updatedBy,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return transformDbBookingToFrontend(json.data);
      }
    }
  } catch (err) {
    console.warn('Status update API error:', err);
  }
  return null;
}

export async function addApiBookingReview(
  bookingId: string,
  rating: number,
  comment: string,
  userId?: string
): Promise<RepairBooking | null> {
  try {
    const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating,
        comment,
        userId,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return transformDbBookingToFrontend(json.data);
      }
    }
  } catch (err) {
    console.warn('Add review API error:', err);
  }
  return null;
}

export async function fetchApiDevices(userId?: string): Promise<UserDevice[]> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/devices${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(transformDbDeviceToFrontend);
    }
  } catch (err) {
    console.warn('Fetch devices API error, using initial devices:', err);
  }
  return INITIAL_USER_DEVICES;
}

export async function createApiDevice(data: {
  userId?: string;
  brand: string;
  model: string;
  category?: string;
  purchaseDate?: string;
  originalPriceINR?: number;
  batteryHealthPct?: number;
  computeHealthPct?: number;
  chassisCondition?: string;
  repairabilityScore?: number;
}): Promise<UserDevice | null> {
  try {
    const res = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        category: (data.category || 'LAPTOP').toUpperCase(),
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return transformDbDeviceToFrontend(json.data);
      }
    }
  } catch (err) {
    console.warn('Create device API error:', err);
  }
  return null;
}

export async function fetchApiImpact(userId?: string): Promise<SustainabilityMetrics> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/impact${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      const d = json.data;
      return {
        totalDevicesRepaired: d.totalDevicesRepaired || 6,
        totalWasteAvoidedKg: d.totalWasteAvoidedKg || 3.4,
        totalMoneySavedINR: d.totalMoneySavedINR || 84500,
        totalMonthsExtended: d.totalMonthsExtended || 72,
        sustainabilityImpactScore: d.sustainabilityImpactScore || 94,
        carbonEmissionsPreventedKg: d.carbonEmissionsPreventedKg || 51.8,
        waterSavedLiters: d.waterSavedLiters || 3200,
      };
    }
  } catch (err) {
    console.warn('Fetch impact API error, using calculated metrics:', err);
  }
  return INITIAL_SUSTAINABILITY;
}
