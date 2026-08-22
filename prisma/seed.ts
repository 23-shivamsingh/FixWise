import {
  PrismaClient,
  DeviceCategory,
  SeverityLevel,
  VerdictType,
  RepairerTier,
  RepairCaseStatus,
  BookingStatus,
  PaymentStatus,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting FixWise AI Database Seed...');

  // 1. Clean existing records (in dependency order)
  try {
    await prisma.impactRecord.deleteMany();
    await prisma.review.deleteMany();
    await prisma.warranty.deleteMany();
    await prisma.repairStatusHistory.deleteMany();
    await prisma.repairBooking.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.repairabilityScore.deleteMany();
    await prisma.diagnosisImage.deleteMany();
    await prisma.diagnosis.deleteMany();
    await prisma.repairCase.deleteMany();
    await prisma.repairerService.deleteMany();
    await prisma.repairer.deleteMany();
    await prisma.device.deleteMany();
    await prisma.user.deleteMany();
  } catch (err) {
    console.log('Note: Clean step skipped or partial (first run)');
  }

  // 2. Create Users
  console.log('👤 Creating Users...');
  const consumerUser = await prisma.user.create({
    data: {
      email: 'consumer@fixwise.ai',
      name: 'Priya Sharma',
      phone: '+91 98450 12345',
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const technicianUser = await prisma.user.create({
    data: {
      email: 'repairer@techfixpro.in',
      name: 'Rajesh Kumar (Lead Tech)',
      phone: '+91 98450 67890',
      role: 'REPAIRER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@fixwise.ai',
      name: 'FixWise Operations',
      phone: '+91 80 4000 9000',
      role: 'ADMIN',
    },
  });

  // 3. Create Registered Devices (Passports)
  console.log('💻 Creating Devices...');
  const devLaptop = await prisma.device.create({
    data: {
      userId: consumerUser.id,
      brand: 'Dell',
      model: 'XPS 15 (9520)',
      category: DeviceCategory.LAPTOP,
      purchaseDate: new Date('2023-04-15'),
      originalPriceINR: 145000,
      batteryHealthPct: 88,
      computeHealthPct: 94,
      chassisCondition: 'Minor bezel micro-scratches',
      repairabilityScore: 82,
      serialNumber: 'DL-XPS-9520-BLR-8921',
    },
  });

  const devPhone = await prisma.device.create({
    data: {
      userId: consumerUser.id,
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      category: DeviceCategory.SMARTPHONE,
      purchaseDate: new Date('2023-09-20'),
      originalPriceINR: 119900,
      batteryHealthPct: 84,
      computeHealthPct: 98,
      chassisCondition: 'Display fractured near bottom-right edge',
      repairabilityScore: 68,
      serialNumber: 'AP-IP14P-IN-90812',
    },
  });

  const devAudio = await prisma.device.create({
    data: {
      userId: consumerUser.id,
      brand: 'Sony',
      model: 'WH-1000XM4 Headphones',
      category: DeviceCategory.AUDIO,
      purchaseDate: new Date('2022-11-10'),
      originalPriceINR: 26990,
      batteryHealthPct: 76,
      computeHealthPct: 92,
      chassisCondition: 'Left ear cushion foam peeling',
      repairabilityScore: 78,
      serialNumber: 'SN-XM4-AUD-4421',
    },
  });

  // 4. Create 6 Verified Repairers in Bengaluru
  console.log('🛠️ Creating 6 Bengaluru Repairers & Services...');
  const repairersData = [
    {
      name: 'TechFix Pro Labs',
      description: 'Master-certified micro-soldering and ultrasonic motherboard restoration lab.',
      address: '100 Feet Road, 12th Main, Indiranagar, Bengaluru, KA 560038',
      city: 'Bengaluru',
      latitude: 12.9784,
      longitude: 77.6408,
      phone: '+91 98450 11223',
      email: 'indiranagar@techfixpro.in',
      rating: 4.9,
      reviewCount: 312,
      isVerified: true,
      tier: RepairerTier.ELITE,
      minPriceINR: 1500,
      maxPriceINR: 12000,
      avgTurnaroundHours: 24,
      warrantyDays: 180,
      profileImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300',
      services: [
        { name: 'Thermal Paste Refurbish & Fan Ultrasonic Clean', category: 'Laptop', estimatedPriceINR: 2200, estimatedHours: 4 },
        { name: 'BGA Reballing & Motherboard Micro-soldering', category: 'Laptop', estimatedPriceINR: 6500, estimatedHours: 24 },
        { name: 'OLED Display & Digitizer Assembly Swap', category: 'Smartphone', estimatedPriceINR: 7800, estimatedHours: 6 },
      ],
    },
    {
      name: 'CircuitCare Solutions',
      description: 'Authorized component rework centre with class-100 clean-room screen refurbishing.',
      address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, KA 560034',
      city: 'Bengaluru',
      latitude: 12.9352,
      longitude: 77.6245,
      phone: '+91 98450 22334',
      email: 'service@circuitcare.in',
      rating: 4.8,
      reviewCount: 245,
      isVerified: true,
      tier: RepairerTier.CERTIFIED,
      minPriceINR: 1200,
      maxPriceINR: 14000,
      avgTurnaroundHours: 24,
      warrantyDays: 120,
      profileImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300',
      services: [
        { name: 'OEM Display Glass Lamination', category: 'Smartphone', estimatedPriceINR: 5500, estimatedHours: 12 },
        { name: 'Battery Replacement with OEM Calibration', category: 'All', estimatedPriceINR: 3200, estimatedHours: 3 },
      ],
    },
    {
      name: 'QuickRevive Electronics',
      description: 'Rapid express repairs for smartphones, laptops, and audio gear.',
      address: '27th Main, Sector 1, HSR Layout, Bengaluru, KA 560102',
      city: 'Bengaluru',
      latitude: 12.9121,
      longitude: 77.6446,
      phone: '+91 98450 33445',
      email: 'hsr@quickrevive.in',
      rating: 4.7,
      reviewCount: 189,
      isVerified: true,
      tier: RepairerTier.VERIFIED,
      minPriceINR: 800,
      maxPriceINR: 9500,
      avgTurnaroundHours: 12,
      warrantyDays: 90,
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300',
      services: [
        { name: 'Same-day Charging Port & Flex Cable Repair', category: 'All', estimatedPriceINR: 1800, estimatedHours: 2 },
        { name: 'Headphone Driver & Battery Replacement', category: 'Audio', estimatedPriceINR: 2400, estimatedHours: 6 },
      ],
    },
    {
      name: 'ElectroHeal Workstation',
      description: 'High-end workstation, gaming laptop, and Apple device restoration specialists.',
      address: 'ITPL Main Road, Whitefield, Bengaluru, KA 560066',
      city: 'Bengaluru',
      latitude: 12.9698,
      longitude: 77.7499,
      phone: '+91 98450 44556',
      email: 'whitefield@electroheal.in',
      rating: 4.9,
      reviewCount: 420,
      isVerified: true,
      tier: RepairerTier.ELITE,
      minPriceINR: 2000,
      maxPriceINR: 18000,
      avgTurnaroundHours: 36,
      warrantyDays: 180,
      profileImage: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300',
      services: [
        { name: 'Thermal Overhaul with Liquid Metal / Phase-Change Paste', category: 'Laptop', estimatedPriceINR: 3500, estimatedHours: 8 },
        { name: 'GPU Power Rail Component Diagnostics', category: 'Laptop', estimatedPriceINR: 8500, estimatedHours: 36 },
      ],
    },
    {
      name: 'Precision BGA Masters',
      description: 'Component-level motherboard repair with infrared rework stations.',
      address: '11th Main, 4th Block, Jayanagar, Bengaluru, KA 560011',
      city: 'Bengaluru',
      latitude: 12.925,
      longitude: 77.5938,
      phone: '+91 98450 55667',
      email: 'jayanagar@precisionbga.in',
      rating: 4.8,
      reviewCount: 164,
      isVerified: true,
      tier: RepairerTier.CERTIFIED,
      minPriceINR: 1800,
      maxPriceINR: 15000,
      avgTurnaroundHours: 24,
      warrantyDays: 120,
      profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300',
      services: [
        { name: 'Short Circuit Line Isolation & Capacitor Replacement', category: 'Laptop', estimatedPriceINR: 4200, estimatedHours: 18 },
      ],
    },
    {
      name: 'MicroTech Fixers',
      description: 'Trusted multi-brand electronics service hub with 15+ years experience.',
      address: 'Margosa Road, Between 15th & 16th Cross, Malleshwaram, Bengaluru, KA 560003',
      city: 'Bengaluru',
      latitude: 13.0031,
      longitude: 77.5643,
      phone: '+91 98450 66778',
      email: 'support@microtechfix.in',
      rating: 4.6,
      reviewCount: 98,
      isVerified: true,
      tier: RepairerTier.STANDARD,
      minPriceINR: 700,
      maxPriceINR: 8000,
      avgTurnaroundHours: 24,
      warrantyDays: 60,
      profileImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300',
      services: [
        { name: 'General Diagnostic & Cleaning Overhaul', category: 'All', estimatedPriceINR: 950, estimatedHours: 4 },
      ],
    },
  ];

  const createdRepairers = [];
  for (const rData of repairersData) {
    const { services, ...rInfo } = rData;
    const r = await prisma.repairer.create({
      data: {
        ...rInfo,
        services: {
          create: services,
        },
      },
    });
    createdRepairers.push(r);
  }

  // 5. Create 4 Demo Diagnosis Cases & Quotes
  console.log('🔍 Creating 4 Preset Demo Diagnosis Cases...');

  // Case 1: Dell XPS Overheating
  const case1 = await prisma.repairCase.create({
    data: {
      userId: consumerUser.id,
      deviceId: devLaptop.id,
      trackingCode: 'FW-892104',
      status: RepairCaseStatus.DIAGNOSED,
      diagnosis: {
        create: {
          brand: 'Dell',
          deviceModel: 'XPS 15 (9520)',
          category: 'Laptop',
          identifiedIssue: 'Severe Thermal Throttling & Dried Thermal Compound',
          issueCategory: 'Thermal / Motherboard Cooling',
          severity: SeverityLevel.MODERATE,
          confidenceScore: 94,
          estimatedMinCostINR: 2200,
          estimatedMaxCostINR: 3500,
          estimatedTurnaroundHours: 24,
          rootCauses: [
            'Factory thermal interface material (TIM) cured and micro-cracked after 2+ years of heat cycling.',
            'Dual vapor chamber exhaust fins occluded with compacted dust felt.',
            'PWM cooling fan bearing friction causing 20% RPM reduction under load.',
          ],
          safetyHazard: false,
          troubleshootingSteps: [
            { stepNumber: 1, title: 'Check Ambient Airflow', description: 'Elevate laptop rear by 1 inch on a hard surface to inspect fan intake draw.', riskLevel: 'safe' },
            { stepNumber: 2, title: 'Monitor Core Temperatures', description: 'Run HWMonitor or CoreTemp to observe delta between idle (55°C) and load (100°C).', riskLevel: 'safe' },
            { stepNumber: 3, title: 'Heatsink Repasting', description: 'Requires ultrasonic cleaning of copper cold-plate and phase-change paste reapplication.', riskLevel: 'pro_only' },
          ],
          recommendedAction: 'Schedule technician heatsink ultrasonic cleaning and thermal interface repasting with Honeywell PTM7950.',
        },
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', mimeType: 'image/jpeg' },
        ],
      },
      repairabilityScore: {
        create: {
          score: 84,
          partsAvailability: 92,
          disassemblyComplexity: 80,
          costFeasibility: 88,
          regionalServiceability: 90,
          ageFactor: 75,
          verdict: VerdictType.REPAIR,
          reason: 'High economic return: repair cost (₹2,500) is only 1.7% of replacement value (₹1,45,000). Extends laptop life by 24+ months.',
          netSavingsINR: 142500,
          breakEvenMonths: 0.5,
        },
      },
    },
  });

  // Quotes for Case 1
  await prisma.quote.createMany({
    data: [
      {
        repairCaseId: case1.id,
        repairerId: createdRepairers[0].id,
        partsCostINR: 800,
        laborCostINR: 1600,
        totalCostINR: 2400,
        turnaroundDays: 1,
        warrantyDays: 180,
        fairnessScore: 98,
        isBestValue: true,
        isLowestPrice: false,
        isFastest: true,
        notes: 'Includes Honeywell PTM7950 phase-change pad + 180-day thermal stability warranty.',
      },
      {
        repairCaseId: case1.id,
        repairerId: createdRepairers[1].id,
        partsCostINR: 600,
        laborCostINR: 1500,
        totalCostINR: 2100,
        turnaroundDays: 1,
        warrantyDays: 120,
        fairnessScore: 95,
        isBestValue: false,
        isLowestPrice: true,
        isFastest: false,
        notes: 'Arctic MX-6 repasting with ultrasonic fin degreasing.',
      },
    ],
  });

  // Case 2: iPhone 14 Pro Cracked Screen
  const case2 = await prisma.repairCase.create({
    data: {
      userId: consumerUser.id,
      deviceId: devPhone.id,
      trackingCode: 'FW-402911',
      status: RepairCaseStatus.DIAGNOSED,
      diagnosis: {
        create: {
          brand: 'Apple',
          deviceModel: 'iPhone 14 Pro',
          category: 'Smartphone',
          identifiedIssue: 'Super Retina XDR OLED Glass Fracture & Touch Matrix Delamination',
          issueCategory: 'Display / Front Glass',
          severity: SeverityLevel.MODERATE,
          confidenceScore: 96,
          estimatedMinCostINR: 7500,
          estimatedMaxCostINR: 11500,
          estimatedTurnaroundHours: 6,
          rootCauses: [
            'Radial impact point at lower-right corner propagated stress fracture through Ceramic Shield.',
            'Digitizer flex cable intact but micro-stress present at display driver IC.',
          ],
          safetyHazard: false,
          troubleshootingSteps: [
            { stepNumber: 1, title: 'Inspect Touch Responsiveness', description: 'Verify if entire touch grid registers gestures without ghost touches.', riskLevel: 'safe' },
            { stepNumber: 2, title: 'Cleanroom Glass Refurbishing', description: 'Requires vacuum heated wire separation and OCA lamination.', riskLevel: 'pro_only' },
          ],
          recommendedAction: 'OEM OLED assembly replacement with TrueTone IC EEPROM programming.',
        },
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600', mimeType: 'image/jpeg' },
        ],
      },
      repairabilityScore: {
        create: {
          score: 72,
          partsAvailability: 85,
          disassemblyComplexity: 65,
          costFeasibility: 75,
          regionalServiceability: 88,
          ageFactor: 70,
          verdict: VerdictType.REPAIR,
          reason: 'Repairing display preserves ₹1,10,000+ in residual device equity vs buying a replacement.',
          netSavingsINR: 110000,
          breakEvenMonths: 1.2,
        },
      },
    },
  });

  // Case 3: Swollen Battery Hazard
  const case3 = await prisma.repairCase.create({
    data: {
      userId: consumerUser.id,
      trackingCode: 'FW-771203',
      status: RepairCaseStatus.DIAGNOSED,
      diagnosis: {
        create: {
          brand: 'Apple',
          deviceModel: 'MacBook Pro 16" (M1 Max)',
          category: 'Laptop',
          identifiedIssue: 'Lithium Pouch Cell Electrolyte Delamination & Swelling (HAZARD)',
          issueCategory: 'Battery / Power Subsystem',
          severity: SeverityLevel.CRITICAL,
          confidenceScore: 98,
          estimatedMinCostINR: 6500,
          estimatedMaxCostINR: 9000,
          estimatedTurnaroundHours: 24,
          rootCauses: [
            'Polymer separator breakdown resulting in gas build-up inside middle battery pouch.',
            'Chassis bottom plate bulging causing trackpad deflection and unlevel desk seating.',
          ],
          safetyHazard: true,
          safetyWarning: 'DO NOT puncture or apply mechanical pressure to the swollen battery pouch. Stop charging immediately to prevent thermal runaway or toxic gas venting.',
          troubleshootingSteps: [
            { stepNumber: 1, title: 'Disconnect MagSafe Charger', description: 'Immediately unplug device from mains power.', riskLevel: 'safe' },
            { stepNumber: 2, title: 'Do NOT Punctures Cell', description: 'Avoid compressing or puncturing the aluminum casing.', riskLevel: 'caution' },
            { stepNumber: 3, title: 'ESD Bench Battery Extraction', description: 'Requires solvent adhesive dissolving and fireproof disposal bin.', riskLevel: 'pro_only' },
          ],
          recommendedAction: 'Professional bench battery replacement and fireproof hazardous e-waste disposal.',
        },
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', mimeType: 'image/jpeg' },
        ],
      },
      repairabilityScore: {
        create: {
          score: 86,
          partsAvailability: 90,
          disassemblyComplexity: 78,
          costFeasibility: 92,
          regionalServiceability: 88,
          ageFactor: 80,
          verdict: VerdictType.REPAIR,
          reason: 'Essential safety repair. Swapping the battery restores full 100% capacity on a high-value ₹2.4L workstation.',
          netSavingsINR: 232000,
          breakEvenMonths: 0.8,
        },
      },
    },
  });

  // Case 4: Sony Headphones ANC Driver Degradation
  const case4 = await prisma.repairCase.create({
    data: {
      userId: consumerUser.id,
      deviceId: devAudio.id,
      trackingCode: 'FW-229831',
      status: RepairCaseStatus.COMPLETED,
      diagnosis: {
        create: {
          brand: 'Sony',
          deviceModel: 'WH-1000XM4',
          category: 'Audio',
          identifiedIssue: 'Left Driver Feedback Microphone Oxide Corrosion & Battery Fade',
          issueCategory: 'Acoustic / Mic Array',
          severity: SeverityLevel.LOW,
          confidenceScore: 91,
          estimatedMinCostINR: 1800,
          estimatedMaxCostINR: 2800,
          estimatedTurnaroundHours: 12,
          rootCauses: [
            'Sweat vapor condensation on internal MEMS feedback microphone element.',
            'Li-Ion pouch cell capacity reduced to 68% after 500 charge cycles.',
          ],
          safetyHazard: false,
          troubleshootingSteps: [
            { stepNumber: 1, title: 'Clean Acoustic Port', description: 'Use dry soft brush to clean microphone pinhole.', riskLevel: 'safe' },
            { stepNumber: 2, title: 'Replace Internal Cell', description: 'Micro-soldering leads to new OEM VDL battery cell.', riskLevel: 'pro_only' },
          ],
          recommendedAction: 'Replace MEMS microphone module and install fresh 1050mAh replacement battery.',
        },
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', mimeType: 'image/jpeg' },
        ],
      },
      repairabilityScore: {
        create: {
          score: 88,
          partsAvailability: 88,
          disassemblyComplexity: 85,
          costFeasibility: 92,
          regionalServiceability: 86,
          ageFactor: 82,
          verdict: VerdictType.REPAIR,
          reason: 'Repairing costs ₹2,200 vs buying new XM5 at ₹29,990. Saves ₹27,790 with 2+ years life extension.',
          netSavingsINR: 27790,
          breakEvenMonths: 1.0,
        },
      },
    },
  });

  // Quotes for Case 4
  const quoteCase4 = await prisma.quote.create({
    data: {
      repairCaseId: case4.id,
      repairerId: createdRepairers[0].id,
      partsCostINR: 900,
      laborCostINR: 1300,
      totalCostINR: 2200,
      turnaroundDays: 1,
      warrantyDays: 180,
      fairnessScore: 99,
      isBestValue: true,
      isLowestPrice: true,
      isFastest: true,
      notes: 'OEM Sony driver & battery replacement completed.',
    },
  });

  // 6. Create Completed Booking for Case 4 with History & Warranty
  console.log('📋 Creating Sample Completed Booking & Warranty Records...');
  const bookingCompleted = await prisma.repairBooking.create({
    data: {
      repairCaseId: case4.id,
      quoteId: quoteCase4.id,
      repairerId: createdRepairers[0].id,
      userId: consumerUser.id,
      trackingCode: 'TRK-881290',
      status: BookingStatus.COMPLETED,
      scheduledDate: new Date('2026-08-10'),
      scheduledSlot: '10:00 AM - 1:00 PM',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98450 12345',
      customerAddress: '42 Palm Meadows, Indiranagar, Bengaluru',
      totalAmountINR: 2200,
      paymentStatus: PaymentStatus.PAID,
      notes: 'Audio test passed. Both ANC active calibration verified on bench.',
      statusHistory: {
        create: [
          { status: BookingStatus.REQUESTED, note: 'Repair appointment requested.', updatedBy: 'CUSTOMER' },
          { status: BookingStatus.REPAIRER_ACCEPTED, note: 'Job accepted by lead technician.', updatedBy: 'TECHNICIAN' },
          { status: BookingStatus.DEVICE_RECEIVED, note: 'Headphones checked into Indiranagar bench.', updatedBy: 'TECHNICIAN' },
          { status: BookingStatus.DIAGNOSIS_CONFIRMED, note: 'Microphone corrosion confirmed under microscope.', updatedBy: 'TECHNICIAN' },
          { status: BookingStatus.IN_PROGRESS, note: 'Replaced MEMS mic array and installed fresh battery.', updatedBy: 'TECHNICIAN' },
          { status: BookingStatus.QUALITY_CHECK, note: 'Frequency sweep (20Hz-20kHz) and ANC test passed.', updatedBy: 'TECHNICIAN' },
          { status: BookingStatus.READY_FOR_PICKUP, note: 'Cleaned, sanitized, and boxed for customer.', updatedBy: 'TECHNICIAN' },
          { status: BookingStatus.COMPLETED, note: 'Picked up by customer. Warranty activated.', updatedBy: 'SYSTEM' },
        ],
      },
      warranty: {
        create: {
          warrantyCode: 'WTY-881290-XM4',
          warrantyDays: 180,
          startDate: new Date('2026-08-10'),
          expiryDate: new Date('2027-02-06'),
          coverageTerms: '180-day comprehensive zero-deductible FixWise guarantee covering replacement battery & acoustic mic driver.',
          isActive: true,
        },
      },
      review: {
        create: {
          userId: consumerUser.id,
          repairerId: createdRepairers[0].id,
          rating: 5,
          comment: 'Incredible experience! The noise cancellation sounds brand new and battery lasts 30+ hours again.',
        },
      },
    },
  });

  // 7. Create Impact Records
  console.log('🌍 Creating Impact Records...');
  await prisma.impactRecord.createMany({
    data: [
      {
        userId: consumerUser.id,
        bookingId: bookingCompleted.id,
        category: DeviceCategory.AUDIO,
        wasteAvoidedKg: 0.35,
        moneySavedINR: 24790,
        co2PreventedKg: 8.4,
        waterSavedLiters: 420,
        monthsExtended: 24,
      },
      {
        userId: consumerUser.id,
        category: DeviceCategory.LAPTOP,
        wasteAvoidedKg: 1.85,
        moneySavedINR: 38000,
        co2PreventedKg: 34.2,
        waterSavedLiters: 2100,
        monthsExtended: 36,
      },
      {
        userId: consumerUser.id,
        category: DeviceCategory.SMARTPHONE,
        wasteAvoidedKg: 0.6,
        moneySavedINR: 18000,
        co2PreventedKg: 12.5,
        waterSavedLiters: 680,
        monthsExtended: 18,
      },
    ],
  });

  console.log('✅ FixWise AI Database Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
