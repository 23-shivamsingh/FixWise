export type DeviceCategory = 'smartphone' | 'laptop' | 'tablet' | 'headphones' | 'smartwatch' | 'appliance' | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type SafetyRiskLevel = 'safe' | 'low_risk' | 'professional_recommended' | 'dangerous_stop_using';

export type RepairStatus = 
  | 'requested'
  | 'quote_received'
  | 'repairer_accepted'
  | 'device_received'
  | 'diagnosis_confirmed'
  | 'in_progress'
  | 'quality_check'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  timeEstimate: string;
  riskLevel: 'Low risk' | 'Moderate risk' | 'Caution';
  safeForDIY: boolean;
  instructions: string[];
}

export interface DiagnosisResult {
  id: string;
  deviceCategory: DeviceCategory;
  deviceModel: string;
  brand: string;
  purchaseYear: number;
  originalPrice: number;
  userDescription: string;
  images: string[];
  identifiedIssue: string;
  possibleCauses: string[];
  severity: SeverityLevel;
  confidence: number; // 0 to 1
  safetyRisk: SafetyRiskLevel;
  safetyWarningText?: string;
  hazardType?: 'swollen_battery' | 'liquid_damage' | 'spark_hazard' | 'high_voltage' | 'overheating' | 'none';
  professionalRepairRecommended: boolean;
  estimatedRepairCostMin: number;
  estimatedRepairCostMax: number;
  replacementCostEstimate: number;
  expectedLifeExtensionMonths: number;
  expectedReplacementLifeYears: number;
  repairabilityScore: number; // 0 to 100
  repairabilityBreakdown: {
    partsAvailability: number; // 0 to 100
    repairComplexity: number;  // 0 to 100
    costFeasibility: number;   // 0 to 100
    localServiceability: number; // 0 to 100
    productAgeFactor: number;  // 0 to 100
  };
  repairVsReplaceVerdict: 'REPAIR' | 'CONSIDER REPLACEMENT';
  verdictReason: string;
  estimatedSavings: number;
  troubleshootingSteps: TroubleshootingStep[];
  aiAnalysisNotes?: string;
  timestamp: string;
}

export interface RepairerReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  deviceRepaired: string;
}

export interface Repairer {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  city: string;
  phone: string;
  yearsInBusiness: number;
  trustScore: number; // 0-100
  trustBreakdown: {
    verification: number;
    reviewsScore: number;
    completionRate: number;
    quoteAccuracy: number;
    warrantyPerformance: number;
  };
  priceRange: string;
  avgTurnaroundDays: number;
  warrantyDays: number;
  specialties: string[];
  certifications: string[];
  reviews: RepairerReview[];
}

export interface Quote {
  id: string;
  repairCaseId: string;
  repairerId: string;
  repairerName: string;
  repairerLogo: string;
  repairerRating: number;
  repairerDistanceKm: number;
  repairerExperienceYears: number;
  price: number;
  partsCost: number;
  laborCost: number;
  turnaroundDays: number;
  warrantyDays: number;
  notes: string;
  includedServices: string[];
  isBestValue?: boolean;
  isCheapest?: boolean;
  isFastest?: boolean;
  fairnessScore: number; // 0-100
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface TimelineEvent {
  status: RepairStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  updatedBy?: string;
  proofImageUrl?: string;
}

export interface RepairBooking {
  id: string;
  caseId: string;
  diagnosis: DiagnosisResult;
  repairer: Repairer;
  quote: Quote;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  preferredDate: string;
  timeSlot: string;
  status: RepairStatus;
  timeline: TimelineEvent[];
  warrantyExpiryDate: string;
  warrantyDays: number;
  trackingCode: string;
  paymentStatus: 'pending_on_pickup' | 'paid_advance' | 'completed';
  totalAmount: number;
  ratingGiven?: number;
  reviewGiven?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDevice {
  id: string;
  name: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  purchaseDate: string;
  purchasePrice: number;
  overallHealthScore: number; // 0-100
  batteryHealth: number; // percentage
  physicalCondition: number; // percentage
  performanceScore: number; // percentage
  repairabilityScore: number; // percentage
  repairsCount: number;
  totalRepairSpend: number;
  partsReplaced: string[];
  activeWarrantyCount: number;
  carbonAvoidedKg: number;
  lastDiagnosisDate?: string;
}

export interface SustainabilityMetrics {
  totalDevicesRepaired: number;
  totalWasteAvoidedKg: number;
  totalMoneySavedINR: number;
  totalMonthsExtended: number;
  sustainabilityImpactScore: number;
  carbonEmissionsPreventedKg: number;
  waterSavedLiters: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  actionLink?: {
    label: string;
    targetTab: string;
  };
}

export interface QuoteScanResult {
  shopName: string;
  date: string;
  detectedPartsCost: number;
  detectedLaborCost: number;
  detectedTaxCost: number;
  detectedTotal: number;
  fairnessScore: number;
  partsFairness: 'Reasonable' | 'High' | 'Overpriced';
  laborFairness: 'Normal' | 'Slightly High' | 'Very High';
  serviceFairness: 'Normal' | 'Overcharged';
  totalFairness: 'Fair Deal' | 'Acceptable' | 'Expensive';
  summary: string;
  flaggedItems: string[];
}
