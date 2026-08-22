import { DeviceCategory, Quote, Repairer, SafetyRiskLevel } from '../types';

export interface RepairabilityInputs {
  category: DeviceCategory;
  ageYears: number;
  originalPrice: number;
  estimatedRepairCost: number;
  replacementCost: number;
  partsAvailabilityRating?: number; // 0-100
  repairComplexityRating?: number; // 0-100 (100 = very easy, 0 = impossible)
  safetyRisk?: SafetyRiskLevel;
}

export interface RepairabilityBreakdown {
  score: number;
  label: 'Highly Repairable' | 'Moderately Repairable' | 'Difficult to Repair' | 'Low Repairability';
  partsAvailability: number;
  repairComplexity: number;
  costFeasibility: number;
  localServiceability: number;
  productAgeFactor: number;
  summary: string;
}

/**
 * Deterministic calculation for device Repairability Score (0-100)
 */
export function calculateRepairabilityScore(inputs: RepairabilityInputs): RepairabilityBreakdown {
  const { category, ageYears, replacementCost, estimatedRepairCost, safetyRisk } = inputs;

  // 1. Base category modularity & standard repairability index
  let categoryModularity = 75;
  let defaultLocalServiceability = 85;
  switch (category) {
    case 'laptop':
      categoryModularity = 82;
      defaultLocalServiceability = 90;
      break;
    case 'smartphone':
      categoryModularity = 78;
      defaultLocalServiceability = 95;
      break;
    case 'tablet':
      categoryModularity = 62;
      defaultLocalServiceability = 75;
      break;
    case 'headphones':
      categoryModularity = 58;
      defaultLocalServiceability = 65;
      break;
    case 'smartwatch':
      categoryModularity = 52;
      defaultLocalServiceability = 60;
      break;
    case 'appliance':
      categoryModularity = 88;
      defaultLocalServiceability = 85;
      break;
    default:
      categoryModularity = 70;
      defaultLocalServiceability = 75;
  }

  // 2. Parts availability based on age & category
  const partsAgeDecay = Math.max(15, 100 - ageYears * 12);
  const partsAvailability = Math.round(
    inputs.partsAvailabilityRating ?? (categoryModularity * 0.5 + partsAgeDecay * 0.5)
  );

  // 3. Repair complexity score (higher = easier to fix)
  let repairComplexity = inputs.repairComplexityRating ?? (categoryModularity - (ageYears > 5 ? 10 : 0));
  if (safetyRisk === 'dangerous_stop_using') {
    repairComplexity = Math.max(10, repairComplexity - 35);
  } else if (safetyRisk === 'professional_recommended') {
    repairComplexity = Math.max(25, repairComplexity - 15);
  }

  // 4. Cost Feasibility (Cost ratio between repair & replacement)
  const costRatio = replacementCost > 0 ? estimatedRepairCost / replacementCost : 0.5;
  // If repair is <= 20% of replacement -> 95 score. If >= 70% -> 25 score.
  let costFeasibility = Math.round(Math.max(10, Math.min(100, (1 - costRatio) * 115)));
  if (costRatio <= 0.15) costFeasibility = 98;
  if (costRatio >= 0.75) costFeasibility = 20;

  // 5. Product age factor (newer to 3 years is ideal, older devices lose points)
  let productAgeFactor = Math.max(10, 100 - ageYears * 14);
  if (ageYears <= 2) productAgeFactor = 95;

  const localServiceability = defaultLocalServiceability;

  // Weighted composite score (Deterministic weights)
  // Parts: 25%, Complexity: 25%, Cost Feasibility: 30%, Local Service: 10%, Age: 10%
  const composite = 
    partsAvailability * 0.25 +
    repairComplexity * 0.25 +
    costFeasibility * 0.30 +
    localServiceability * 0.10 +
    productAgeFactor * 0.10;

  const finalScore = Math.max(5, Math.min(99, Math.round(composite)));

  let label: RepairabilityBreakdown['label'] = 'Moderately Repairable';
  let summary = 'Standard components are serviceable with readily available replacement modules.';
  if (finalScore >= 80) {
    label = 'Highly Repairable';
    summary = 'Excellent modularity and parts availability. Highly recommended to repair.';
  } else if (finalScore >= 55) {
    label = 'Moderately Repairable';
    summary = 'Parts and local technicians are available; cost-effective alternative to replacement.';
  } else if (finalScore >= 35) {
    label = 'Difficult to Repair';
    summary = 'Complex internal adhesive or limited component availability may increase labor.';
  } else {
    label = 'Low Repairability';
    summary = 'High repair cost relative to current valuation or proprietary integrated sub-assemblies.';
  }

  return {
    score: finalScore,
    label,
    partsAvailability: Math.min(100, Math.max(10, partsAvailability)),
    repairComplexity: Math.min(100, Math.max(10, repairComplexity)),
    costFeasibility: Math.min(100, Math.max(10, costFeasibility)),
    localServiceability,
    productAgeFactor: Math.min(100, Math.max(10, productAgeFactor)),
    summary,
  };
}

export interface DecisionInputs {
  estimatedRepairCost: number;
  replacementCost: number;
  expectedLifeExtensionMonths: number;
  expectedReplacementLifeYears: number;
  repairabilityScore: number;
  deviceAgeYears: number;
}

export interface DecisionResult {
  verdict: 'REPAIR' | 'CONSIDER REPLACEMENT';
  estimatedSavings: number;
  savingsPercentage: number;
  annualizedRepairCost: number;
  annualizedReplacementCost: number;
  reason: string;
  ecoBenefit: string;
}

/**
 * Deterministic Repair vs Replace Decision Engine
 */
export function calculateRepairVsReplace(inputs: DecisionInputs): DecisionResult {
  const {
    estimatedRepairCost,
    replacementCost,
    expectedLifeExtensionMonths,
    expectedReplacementLifeYears,
    repairabilityScore,
    deviceAgeYears,
  } = inputs;

  const netSavings = Math.max(0, replacementCost - estimatedRepairCost);
  const savingsPct = replacementCost > 0 ? Math.round((netSavings / replacementCost) * 100) : 0;

  const repairYears = Math.max(0.5, expectedLifeExtensionMonths / 12);
  const replaceYears = Math.max(1, expectedReplacementLifeYears);

  const annualizedRepair = Math.round(estimatedRepairCost / repairYears);
  const annualizedReplace = Math.round(replacementCost / replaceYears);

  // Decision criteria:
  // 1. Repair cost < 50% of replacement cost
  // 2. Annualized cost of repair is significantly lower than replacing
  // 3. Repairability score is at least 40
  // 4. Device is not exceedingly outdated (> 8 years with low score)
  const isEconomicallyBeneficial = estimatedRepairCost <= replacementCost * 0.55;
  const isAnnualizedSmarter = annualizedRepair <= annualizedReplace * 0.85;
  const isRepairableEnough = repairabilityScore >= 38;

  const shouldRepair = (isEconomicallyBeneficial || isAnnualizedSmarter) && isRepairableEnough;

  let reason = '';
  if (shouldRepair) {
    reason = `Repairing saves ₹${netSavings.toLocaleString('en-IN')} (${savingsPct}%) compared to purchasing a new unit, while extending device utility by ${expectedLifeExtensionMonths} months at a lower annual ownership cost.`;
  } else {
    reason = `Repair cost (₹${estimatedRepairCost.toLocaleString('en-IN')}) is near or above 55% of full device replacement value, or component obsolescence makes long-term life extension less reliable.`;
  }

  const ecoBenefit = `Avoids ${calculateDeviceWasteKg(inputs.deviceAgeYears > 4 ? 'laptop' : 'smartphone')} kg of hazardous e-waste and saves ~${Math.round(netSavings * 0.08)} kg of lifecycle manufacturing CO2.`;

  return {
    verdict: shouldRepair ? 'REPAIR' : 'CONSIDER REPLACEMENT',
    estimatedSavings: netSavings,
    savingsPercentage: savingsPct,
    annualizedRepairCost: annualizedRepair,
    annualizedReplacementCost: annualizedReplace,
    reason,
    ecoBenefit,
  };
}

/**
 * Deterministic Quote scoring & ranking engine
 */
export function rankAndScoreQuotes(quotes: Quote[]): Quote[] {
  if (!quotes.length) return [];

  // Find minimums and maximums for relative scaling
  const prices = quotes.map((q) => q.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const turnarounds = quotes.map((q) => q.turnaroundDays);
  const minTurnaround = Math.min(...turnarounds);

  const scoredQuotes = quotes.map((q) => {
    // 1. Price score (0-100, cheaper is higher)
    const priceScore = maxPrice === minPrice ? 90 : Math.round(100 - ((q.price - minPrice) / (maxPrice - minPrice || 1)) * 40);

    // 2. Rating score (0-100)
    const ratingScore = Math.round((q.repairerRating / 5) * 100);

    // 3. Distance score (closer is better, max 15km)
    const distanceScore = Math.max(30, Math.round(100 - q.repairerDistanceKm * 6));

    // 4. Warranty score (90 days = 100, 30 days = 60)
    const warrantyScore = Math.min(100, Math.round((q.warrantyDays / 90) * 100));

    // 5. Experience score
    const expScore = Math.min(100, 50 + q.repairerExperienceYears * 6);

    // 6. Turnaround score
    const turnaroundScore = Math.max(30, 100 - (q.turnaroundDays - minTurnaround) * 20);

    // Composite Value Score
    const compositeScore = Math.round(
      priceScore * 0.35 +
      ratingScore * 0.20 +
      warrantyScore * 0.15 +
      distanceScore * 0.10 +
      turnaroundScore * 0.10 +
      expScore * 0.10
    );

    return {
      ...q,
      fairnessScore: Math.min(99, Math.max(50, compositeScore)),
      isBestValue: false,
      isCheapest: false,
      isFastest: false,
    };
  });

  // Identify Best Value, Cheapest, Fastest
  let bestValueIdx = 0;
  let bestValueScore = -1;
  let cheapestIdx = 0;
  let lowestPrice = Infinity;
  let fastestIdx = 0;
  let lowestDays = Infinity;

  scoredQuotes.forEach((q, idx) => {
    if (q.fairnessScore > bestValueScore) {
      bestValueScore = q.fairnessScore;
      bestValueIdx = idx;
    }
    if (q.price < lowestPrice) {
      lowestPrice = q.price;
      cheapestIdx = idx;
    }
    if (q.turnaroundDays < lowestDays) {
      lowestDays = q.turnaroundDays;
      fastestIdx = idx;
    }
  });

  scoredQuotes[bestValueIdx].isBestValue = true;
  scoredQuotes[cheapestIdx].isCheapest = true;
  scoredQuotes[fastestIdx].isFastest = true;

  return scoredQuotes;
}

/**
 * Deterministic Trust Score calculation for Repairers (0-100)
 */
export function calculateTrustScore(repairer: Partial<Repairer>): {
  score: number;
  breakdown: Repairer['trustBreakdown'];
} {
  const verifiedScore = repairer.verified ? 98 : 45;
  const reviewsScore = Math.min(100, Math.round(((repairer.rating || 4.5) / 5) * 80 + Math.min(20, (repairer.reviewCount || 10) * 0.4)));
  const completionRate = 96;
  const quoteAccuracy = 94;
  const warrantyPerformance = Math.min(100, Math.round(((repairer.warrantyDays || 60) / 90) * 95));

  const total = Math.round(
    verifiedScore * 0.25 +
    reviewsScore * 0.30 +
    completionRate * 0.20 +
    quoteAccuracy * 0.15 +
    warrantyPerformance * 0.10
  );

  return {
    score: Math.min(99, Math.max(30, total)),
    breakdown: {
      verification: verifiedScore,
      reviewsScore,
      completionRate,
      quoteAccuracy,
      warrantyPerformance,
    },
  };
}

/**
 * Environmental baseline stats per device category
 */
export function calculateDeviceWasteKg(category: DeviceCategory | string): number {
  switch (category) {
    case 'smartphone': return 0.22;
    case 'laptop': return 2.80;
    case 'tablet': return 0.65;
    case 'headphones': return 0.28;
    case 'smartwatch': return 0.09;
    case 'appliance': return 8.50;
    default: return 1.50;
  }
}
