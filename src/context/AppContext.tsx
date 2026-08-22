import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DiagnosisResult,
  Repairer,
  Quote,
  RepairBooking,
  UserDevice,
  SustainabilityMetrics,
  CopilotMessage,
  QuoteScanResult,
  RepairStatus,
} from '../types';
import {
  DEMO_PRESET_CASES,
  SEEDED_REPAIRERS,
  INITIAL_USER_DEVICES,
  INITIAL_BOOKINGS,
  INITIAL_SUSTAINABILITY,
} from '../data/seedData';
import { rankAndScoreQuotes } from '../lib/scoring';
import { chatWithRepairCopilot } from '../lib/gemini';
import { useFixWiseAuth } from './AuthContext';
import {
  fetchApiRepairers,
  fetchApiQuotesForCase,
  fetchApiBookings,
  createApiBooking,
  updateApiBookingStatus,
  addApiBookingReview,
  fetchApiDevices,
  createApiDevice,
  fetchApiImpact,
  saveDiagnosisToBackend,
} from '../lib/api';

export type UserRole = 'user' | 'repairer' | 'admin';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
  linkTab?: string;
}

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Active Diagnosis & Cases
  currentDiagnosis: DiagnosisResult | null;
  setCurrentDiagnosis: (diag: DiagnosisResult | null) => void;
  availableQuotes: Quote[];
  selectedQuote: Quote | null;
  setSelectedQuote: (quote: Quote | null) => void;

  // Repairers & Map
  repairers: Repairer[];
  selectedRepairer: Repairer | null;
  setSelectedRepairer: (rep: Repairer | null) => void;
  userLocation: { lat: number; lng: number; city: string };

  // Bookings & Tracking
  bookings: RepairBooking[];
  activeBooking: RepairBooking | null;
  setActiveBooking: (bk: RepairBooking | null) => void;
  bookRepair: (params: {
    repairer: Repairer;
    quote: Quote;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    preferredDate: string;
    timeSlot: string;
  }) => RepairBooking;
  updateBookingStatus: (bookingId: string, status: RepairStatus, note?: string) => void;
  addReviewToBooking: (bookingId: string, rating: number, review: string) => void;

  // Devices & Passport
  userDevices: UserDevice[];
  addDevice: (device: Partial<UserDevice>) => void;

  // Sustainability Impact
  sustainability: SustainabilityMetrics;

  // AI Copilot
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  sendCopilotMessage: (msg: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning', linkTab?: string) => void;

  // Quote Scanner
  quoteScanResult: QuoteScanResult | null;
  setQuoteScanResult: (res: QuoteScanResult | null) => void;

  // Judge 1-Click Demo Actions
  loadDemoCase: (demoId: string) => void;
  resetAllDemoData: () => void;

  // Backend Sync Status
  backendSynced: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useFixWiseAuth();

  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Load active diagnosis with default laptop demo
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiagnosisResult | null>(
    DEMO_PRESET_CASES[0].diagnosis
  );

  const [repairers, setRepairers] = useState<Repairer[]>(SEEDED_REPAIRERS);
  const [selectedRepairer, setSelectedRepairer] = useState<Repairer | null>(SEEDED_REPAIRERS[0]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // User location (defaults to Bangalore Tech Hub)
  const [userLocation] = useState({ lat: 12.9716, lng: 77.5946, city: 'Bengaluru, KA' });

  // Dynamic realistic quotes for current diagnosis
  const [availableQuotes, setAvailableQuotes] = useState<Quote[]>([]);

  // Bookings state
  const [bookings, setBookings] = useState<RepairBooking[]>(INITIAL_BOOKINGS);
  const [activeBooking, setActiveBooking] = useState<RepairBooking | null>(INITIAL_BOOKINGS[0]);

  // User devices
  const [userDevices, setUserDevices] = useState<UserDevice[]>(INITIAL_USER_DEVICES);

  // Sustainability
  const [sustainability, setSustainability] = useState<SustainabilityMetrics>(INITIAL_SUSTAINABILITY);

  const [backendSynced, setBackendSynced] = useState(false);

  // AI Copilot
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'cp-welcome',
      sender: 'assistant',
      text: 'Hello! I am your FixWise Repair Copilot. I can inspect your hardware diagnosis, explain the Repairability Score, check whether quotes are fair, and advise on safe troubleshooting.',
      timestamp: 'Just now',
      suggestedPrompts: [
        'Can I repair this laptop overheating myself?',
        'What should I ask the technician before booking?',
        'Why is repairing better than replacing?',
      ],
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Active Repair Update',
      message: 'Precision Tech Labs completed ultrasonic heatsink cleaning on Dell XPS 15.',
      time: '10m ago',
      read: false,
      type: 'info',
      linkTab: 'repairs',
    },
    {
      id: 'notif-2',
      title: 'Warranty Badge Minted',
      message: '60-Day Active Warranty confirmed for Sony WH-1000XM4 repair.',
      time: '2h ago',
      read: false,
      type: 'success',
      linkTab: 'history',
    },
  ]);

  // Quote Scanner
  const [quoteScanResult, setQuoteScanResult] = useState<QuoteScanResult | null>(null);

  // 1. Initial / User-scoped Backend Data Fetch
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [apiRep, apiBk, apiDev, apiImp] = await Promise.all([
          fetchApiRepairers(),
          fetchApiBookings(user?.id),
          fetchApiDevices(user?.id),
          fetchApiImpact(user?.id),
        ]);

        if (!isMounted) return;

        if (apiRep && apiRep.length > 0) {
          setRepairers(apiRep);
          setSelectedRepairer(apiRep[0]);
        }

        if (apiBk && apiBk.length > 0) {
          setBookings(apiBk);
          setActiveBooking(apiBk[0]);
        }

        if (apiDev && apiDev.length > 0) {
          setUserDevices(apiDev);
        }

        if (apiImp) {
          setSustainability(apiImp);
        }

        setBackendSynced(true);
      } catch (err) {
        console.warn('Backend sync initialization note:', err);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // 2. Regenerate quotes when diagnosis changes
  useEffect(() => {
    if (!currentDiagnosis) return;

    let isMounted = true;

    async function resolveQuotes() {
      // Check if quotes exist for this repairCaseId in PostgreSQL
      if (currentDiagnosis && currentDiagnosis.id) {
        const dbQuotes = await fetchApiQuotesForCase(currentDiagnosis.id);
        if (isMounted && dbQuotes.length > 0) {
          const ranked = rankAndScoreQuotes(dbQuotes);
          setAvailableQuotes(ranked);
          setSelectedQuote(ranked.find((q) => q.isBestValue) || ranked[0]);
          return;
        }
      }

      // Generate realistic quotes based on active repairers & diagnosis
      const baseMin = currentDiagnosis?.estimatedRepairCostMin || 2500;
      const baseMax = currentDiagnosis?.estimatedRepairCostMax || 4500;
      const avg = (baseMin + baseMax) / 2;

      const activeList = repairers.length >= 4 ? repairers : SEEDED_REPAIRERS;

      const rawQuotes: Quote[] = [
        {
          id: `qt-${currentDiagnosis?.id || 'demo'}-1`,
          repairCaseId: currentDiagnosis?.id || 'case-demo-1',
          repairerId: activeList[0].id,
          repairerName: activeList[0].name,
          repairerLogo: activeList[0].logo,
          repairerRating: activeList[0].rating,
          repairerDistanceKm: activeList[0].distanceKm,
          repairerExperienceYears: activeList[0].yearsInBusiness,
          price: Math.round(avg * 0.95),
          partsCost: Math.round(avg * 0.4),
          laborCost: Math.round(avg * 0.55),
          turnaroundDays: 2,
          warrantyDays: 90,
          notes: 'Includes Arctic MX-6 high-conductivity TIM re-pasting and full ultrasonic fin clean.',
          includedServices: [
            'Diagnostic Bench Verification',
            'Arctic MX-6 Thermal Paste',
            'Ultrasonic Dust Removal',
            '90-Day Repair Guarantee',
          ],
          status: 'pending',
          fairnessScore: 94,
          createdAt: new Date().toISOString(),
        },
        {
          id: `qt-${currentDiagnosis?.id || 'demo'}-2`,
          repairCaseId: currentDiagnosis?.id || 'case-demo-1',
          repairerId: activeList[1].id,
          repairerName: activeList[1].name,
          repairerLogo: activeList[1].logo,
          repairerRating: activeList[1].rating,
          repairerDistanceKm: activeList[1].distanceKm,
          repairerExperienceYears: activeList[1].yearsInBusiness,
          price: Math.round(avg * 1.08),
          partsCost: Math.round(avg * 0.45),
          laborCost: Math.round(avg * 0.63),
          turnaroundDays: 1, // Fastest
          warrantyDays: 60,
          notes: 'Express same-day repair queue with OEM replacement materials.',
          includedServices: [
            'Same-Day Express Bench Rework',
            'OEM Grade Thermal Compounds',
            'Thermal Camera Inspection',
          ],
          status: 'pending',
          fairnessScore: 91,
          createdAt: new Date().toISOString(),
        },
        {
          id: `qt-${currentDiagnosis?.id || 'demo'}-3`,
          repairCaseId: currentDiagnosis?.id || 'case-demo-1',
          repairerId: activeList[2].id,
          repairerName: activeList[2].name,
          repairerLogo: activeList[2].logo,
          repairerRating: activeList[2].rating,
          repairerDistanceKm: activeList[2].distanceKm,
          repairerExperienceYears: activeList[2].yearsInBusiness,
          price: Math.round(avg * 0.78), // Cheapest
          partsCost: Math.round(avg * 0.35),
          laborCost: Math.round(avg * 0.43),
          turnaroundDays: 3,
          warrantyDays: 45,
          notes: 'Eco-tier budget repair utilizing tested OEM spare components.',
          includedServices: [
            'Standard Heatsink Flush',
            'Compound Re-application',
            'Basic 45-Day Warranty',
          ],
          status: 'pending',
          fairnessScore: 89,
          createdAt: new Date().toISOString(),
        },
        {
          id: `qt-${currentDiagnosis?.id || 'demo'}-4`,
          repairCaseId: currentDiagnosis?.id || 'case-demo-1',
          repairerId: activeList[3].id,
          repairerName: activeList[3].name,
          repairerLogo: activeList[3].logo,
          repairerRating: activeList[3].rating,
          repairerDistanceKm: activeList[3].distanceKm,
          repairerExperienceYears: activeList[3].yearsInBusiness,
          price: Math.round(avg * 1.15),
          partsCost: Math.round(avg * 0.5),
          laborCost: Math.round(avg * 0.65),
          turnaroundDays: 2,
          warrantyDays: 120, // Longest warranty
          notes: 'Comprehensive overhaul with 120-day zero-deductible warranty and eco-passport certificate.',
          includedServices: [
            'Master Technician Overhaul',
            'Premium Thermal Pads',
            '120-Day Extended Warranty',
            'Digital E-Passport Minting',
          ],
          status: 'pending',
          fairnessScore: 93,
          createdAt: new Date().toISOString(),
        },
      ];

      if (isMounted) {
        const ranked = rankAndScoreQuotes(rawQuotes);
        setAvailableQuotes(ranked);
        setSelectedQuote(ranked.find((q) => q.isBestValue) || ranked[0]);
      }
    }

    resolveQuotes();

    return () => {
      isMounted = false;
    };
  }, [currentDiagnosis, repairers]);

  // Recalculate sustainability impact dynamically
  useEffect(() => {
    const completed = bookings.filter((b) => b.status === 'completed');
    const totalRepairs = 6 + completed.length;
    let saved = 84500;
    let waste = 3.4;
    let months = 14;

    completed.forEach((b) => {
      saved += b.diagnosis?.estimatedSavings || 25000;
      waste += b.diagnosis?.deviceCategory === 'laptop' ? 2.8 : 0.45;
      months += b.diagnosis?.expectedLifeExtensionMonths || 24;
    });

    setSustainability({
      totalDevicesRepaired: totalRepairs,
      totalWasteAvoidedKg: Number(waste.toFixed(1)),
      totalMoneySavedINR: saved,
      totalMonthsExtended: months,
      sustainabilityImpactScore: Math.min(99, 86 + completed.length * 2),
      carbonEmissionsPreventedKg: Number((waste * 18.5).toFixed(1)),
      waterSavedLiters: Math.round(totalRepairs * 240),
    });
  }, [bookings]);

  // Notification helpers
  const addNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' = 'info',
    linkTab?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
      linkTab,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 1-Click Judge Demo Case Loader
  const loadDemoCase = (demoId: string) => {
    const found = DEMO_PRESET_CASES.find((c) => c.id === demoId) || DEMO_PRESET_CASES[0];
    setCurrentDiagnosis(found.diagnosis);
    setActiveTab('diagnose');
    addNotification(
      `Demo Loaded: ${found.name}`,
      `AI visual diagnosis loaded with ₹${found.diagnosis.estimatedRepairCostMax.toLocaleString('en-IN')} repair cost vs ₹${found.diagnosis.replacementCostEstimate.toLocaleString('en-IN')} replacement.`,
      'success',
      'diagnose'
    );
  };

  // Reset Demo
  const resetAllDemoData = () => {
    setCurrentDiagnosis(DEMO_PRESET_CASES[0].diagnosis);
    setBookings(INITIAL_BOOKINGS);
    setUserDevices(INITIAL_USER_DEVICES);
    setActiveBooking(INITIAL_BOOKINGS[0]);
    addNotification('Demo Data Reset', 'Restored pristine demo states and records.', 'info');
  };

  // Book repair with instant responsive UI + async PostgreSQL backend persistence
  const bookRepair = (params: {
    repairer: Repairer;
    quote: Quote;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    preferredDate: string;
    timeSlot: string;
  }): RepairBooking => {
    if (!currentDiagnosis) throw new Error('No active diagnosis to book.');

    const trackingCode = `FW-${Math.floor(1000 + Math.random() * 9000)}-${currentDiagnosis.deviceCategory.toUpperCase().substring(0, 4)}`;
    const warrantyExpiry = new Date();
    warrantyExpiry.setDate(warrantyExpiry.getDate() + params.quote.warrantyDays);

    const temporaryBookingId = `bk-${Date.now()}`;

    const newBooking: RepairBooking = {
      id: temporaryBookingId,
      caseId: currentDiagnosis.id,
      diagnosis: currentDiagnosis,
      repairer: params.repairer,
      quote: params.quote,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerAddress: params.customerAddress,
      preferredDate: params.preferredDate,
      timeSlot: params.timeSlot,
      status: 'requested',
      trackingCode,
      paymentStatus: 'pending_on_pickup',
      totalAmount: params.quote.price,
      warrantyExpiryDate: warrantyExpiry.toISOString().split('T')[0],
      warrantyDays: params.quote.warrantyDays,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'requested',
          label: 'Repair Requested',
          description: `Quote accepted with ${params.repairer.name} for ₹${params.quote.price.toLocaleString('en-IN')}.`,
          timestamp: 'Just now',
          completed: true,
          current: false,
        },
        {
          status: 'repairer_accepted',
          label: 'Repairer Accepted',
          description: `${params.repairer.name} confirmed technician workbench reservation.`,
          timestamp: 'Pending (Automatic in demo)',
          completed: true,
          current: true,
        },
        {
          status: 'device_received',
          label: 'Device Handover',
          description: `Scheduled pickup on ${params.preferredDate} (${params.timeSlot}).`,
          timestamp: 'Scheduled',
          completed: false,
          current: false,
        },
        {
          status: 'in_progress',
          label: 'Bench Repair & Parts Rework',
          description: params.quote.notes,
          timestamp: 'Estimated +1 Day',
          completed: false,
          current: false,
        },
        {
          status: 'quality_check',
          label: 'Quality & Thermal Check',
          description: 'Pass 100% stress tests and seal warranty sticker.',
          timestamp: 'Estimated +2 Days',
          completed: false,
          current: false,
        },
        {
          status: 'ready_for_pickup',
          label: 'Ready for Pickup / Return',
          description: 'Device packaged with digital passport token.',
          timestamp: 'Estimated +2 Days',
          completed: false,
          current: false,
        },
        {
          status: 'completed',
          label: 'Completed & Warranty Active',
          description: `${params.quote.warrantyDays}-day zero-deductible warranty activated.`,
          timestamp: 'Pending Handover',
          completed: false,
          current: false,
        },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);
    addNotification(
      `Repair Booked: ${trackingCode}`,
      `Your repair with ${params.repairer.name} is booked for ₹${params.quote.price.toLocaleString('en-IN')}.`,
      'success',
      'repairs'
    );

    // Asynchronously synchronize with PostgreSQL backend
    (async () => {
      try {
        let backendCaseId = currentDiagnosis.id;

        // If this is a client or demo ID not matching UUID format, save diagnosis to PostgreSQL first
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          currentDiagnosis.id
        );

        if (!isUUID) {
          const savedCase = await saveDiagnosisToBackend(currentDiagnosis, user?.id);
          if (savedCase) {
            backendCaseId = savedCase.repairCaseId;
          }
        }

        // Persist booking to PostgreSQL
        const persistedBooking = await createApiBooking({
          repairCaseId: backendCaseId,
          quoteId: params.quote.id,
          repairerId: params.repairer.id,
          userId: user?.id,
          scheduledDate: params.preferredDate,
          scheduledSlot: params.timeSlot,
          customerName: params.customerName,
          customerPhone: params.customerPhone,
          customerAddress: params.customerAddress,
          notes: params.quote.notes,
        });

        if (persistedBooking) {
          setBookings((prev) =>
            prev.map((b) => (b.id === temporaryBookingId ? persistedBooking : b))
          );
          if (activeBooking?.id === temporaryBookingId) {
            setActiveBooking(persistedBooking);
          }
        }
      } catch (e) {
        console.warn('Background PostgreSQL booking sync note:', e);
      }
    })();

    return newBooking;
  };

  // Update Booking Status (for timeline and repairer portal)
  const updateBookingStatus = (bookingId: string, status: RepairStatus, note?: string) => {
    const statusOrder: RepairStatus[] = [
      'requested',
      'repairer_accepted',
      'device_received',
      'diagnosis_confirmed',
      'in_progress',
      'quality_check',
      'ready_for_pickup',
      'completed',
    ];

    const targetIdx = statusOrder.indexOf(status);

    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id !== bookingId) return bk;

        const updatedTimeline = bk.timeline.map((event) => {
          const eventIdx = statusOrder.indexOf(event.status);
          const isCompleted = eventIdx <= targetIdx;
          const isCurrent = eventIdx === targetIdx;
          return {
            ...event,
            completed: isCompleted,
            current: isCurrent,
            timestamp: isCurrent ? 'Just updated' : event.timestamp,
            description: isCurrent && note ? note : event.description,
          };
        });

        const updatedBk: RepairBooking = {
          ...bk,
          status,
          updatedAt: new Date().toISOString(),
          timeline: updatedTimeline,
        };

        if (status === 'completed') {
          updatedBk.paymentStatus = 'completed';
        }

        return updatedBk;
      })
    );

    // Update active booking if it is the one being modified
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking((prev) => (prev ? { ...prev, status } : null));
    }

    addNotification(
      `Repair Status: ${status.replace(/_/g, ' ').toUpperCase()}`,
      `Tracking ID ${bookingId} has moved to ${status.replace(/_/g, ' ')}.`,
      'info',
      'repairs'
    );

    // Synchronize status change with PostgreSQL
    (async () => {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          bookingId
        );
        if (isUUID) {
          await updateApiBookingStatus(bookingId, status, note, user?.fullName || 'Technician');
        }
      } catch (err) {
        console.warn('Background status sync note:', err);
      }
    })();
  };

  // Add review
  const addReviewToBooking = (bookingId: string, rating: number, review: string) => {
    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id !== bookingId) return bk;
        return {
          ...bk,
          ratingGiven: rating,
          reviewGiven: review,
        };
      })
    );
    addNotification('Review Submitted', 'Thank you for reviewing your technician!', 'success');

    // Synchronize review to PostgreSQL
    (async () => {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          bookingId
        );
        if (isUUID) {
          await addApiBookingReview(bookingId, rating, review, user?.id);
        }
      } catch (err) {
        console.warn('Background review sync note:', err);
      }
    })();
  };

  // Add device to passport
  const addDevice = (deviceData: Partial<UserDevice>) => {
    const temporaryId = `dev-${Date.now()}`;
    const newDev: UserDevice = {
      id: temporaryId,
      name: deviceData.name || 'New Device',
      category: deviceData.category || 'laptop',
      brand: deviceData.brand || 'Generic',
      model: deviceData.model || 'Standard',
      purchaseDate: deviceData.purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: deviceData.purchasePrice || 50000,
      overallHealthScore: 88,
      batteryHealth: 90,
      physicalCondition: 90,
      performanceScore: 92,
      repairabilityScore: 85,
      repairsCount: 0,
      totalRepairSpend: 0,
      partsReplaced: [],
      activeWarrantyCount: 0,
      carbonAvoidedKg: 0,
      lastDiagnosisDate: new Date().toISOString().split('T')[0],
    };

    setUserDevices((prev) => [newDev, ...prev]);
    addNotification(
      'Device Registered',
      `${newDev.name} added to your Digital Repair Passport.`,
      'success',
      'devices'
    );

    // Synchronize device with PostgreSQL
    (async () => {
      try {
        const created = await createApiDevice({
          userId: user?.id,
          brand: deviceData.brand || 'Generic',
          model: deviceData.model || 'Standard',
          category: (deviceData.category || 'laptop').toUpperCase(),
          purchaseDate: deviceData.purchaseDate,
          originalPriceINR: deviceData.purchasePrice,
          batteryHealthPct: 90,
          computeHealthPct: 95,
          chassisCondition: 'Good',
          repairabilityScore: 85,
        });

        if (created) {
          setUserDevices((prev) =>
            prev.map((d) => (d.id === temporaryId ? created : d))
          );
        }
      } catch (err) {
        console.warn('Background device sync note:', err);
      }
    })();
  };

  // Send message to AI Copilot
  const sendCopilotMessage = async (userText: string) => {
    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };

    setCopilotMessages((prev) => [...prev, userMsg]);

    const historyForAi = copilotMessages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text,
    }));

    try {
      const response = await chatWithRepairCopilot(userText, currentDiagnosis, historyForAi);
      const assistantMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        suggestedPrompts: response.suggestedPrompts,
      };
      setCopilotMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg: CopilotMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'I am ready to assist with your repair questions. Feel free to ask about troubleshooting, price fairness, or technician recommendations.',
        timestamp: 'Just now',
      };
      setCopilotMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        currentDiagnosis,
        setCurrentDiagnosis,
        availableQuotes,
        selectedQuote,
        setSelectedQuote,
        repairers,
        selectedRepairer,
        setSelectedRepairer,
        userLocation,
        bookings,
        activeBooking,
        setActiveBooking,
        bookRepair,
        updateBookingStatus,
        addReviewToBooking,
        userDevices,
        addDevice,
        sustainability,
        copilotOpen,
        setCopilotOpen,
        copilotMessages,
        sendCopilotMessage,
        notifications,
        markNotificationsAsRead,
        addNotification,
        quoteScanResult,
        setQuoteScanResult,
        loadDemoCase,
        resetAllDemoData,
        backendSynced,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
