import { prisma, hasDatabaseConfigured } from '../lib/prisma';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { INITIAL_BOOKINGS, SEEDED_REPAIRERS } from '../../src/data/seedData';

export interface CreateBookingInput {
  repairCaseId: string;
  quoteId: string;
  repairerId: string;
  userId?: string;
  scheduledDate: string; // ISO date string
  scheduledSlot: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
}

export async function createBooking(data: CreateBookingInput) {
  if (hasDatabaseConfigured) {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id: data.quoteId },
        include: {
          repairCase: {
            include: {
              diagnosis: true,
            },
          },
          repairer: true,
        },
      });

      if (quote) {
        let userId = data.userId;
        if (!userId) {
          let demoUser = await prisma.user.findFirst({
            where: { email: 'consumer@fixwise.ai' },
          });
          if (!demoUser) {
            demoUser = await prisma.user.create({
              data: {
                email: 'consumer@fixwise.ai',
                name: data.customerName,
                phone: data.customerPhone,
                role: 'USER',
              },
            });
          }
          userId = demoUser.id;
        }

        const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
        const scheduledDateObj = new Date(data.scheduledDate);
        const warrantyDays = quote.warrantyDays || 90;
        const warrantyExpiry = new Date();
        warrantyExpiry.setDate(warrantyExpiry.getDate() + warrantyDays);

        const booking = await prisma.repairBooking.create({
          data: {
            repairCaseId: data.repairCaseId,
            quoteId: data.quoteId,
            repairerId: data.repairerId,
            userId,
            trackingCode,
            status: 'REQUESTED',
            scheduledDate: scheduledDateObj,
            scheduledSlot: data.scheduledSlot,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerAddress: data.customerAddress,
            totalAmountINR: quote.totalCostINR,
            paymentStatus: 'PENDING',
            notes: data.notes || null,
            statusHistory: {
              create: {
                status: 'REQUESTED',
                note: `Repair appointment scheduled for ${data.scheduledSlot}. Initial inspection pending.`,
                updatedBy: 'CUSTOMER',
              },
            },
            warranty: {
              create: {
                warrantyCode: `WTY-${Math.floor(100000 + Math.random() * 900000)}`,
                warrantyDays,
                startDate: new Date(),
                expiryDate: warrantyExpiry,
                coverageTerms: `Full ${warrantyDays}-day zero-deductible FixWise guarantee. Includes both parts replacement and workshop bench labor.`,
                isActive: true,
              },
            },
          },
          include: {
            repairCase: {
              include: {
                diagnosis: true,
                images: true,
                repairabilityScore: true,
              },
            },
            repairer: true,
            quote: true,
            statusHistory: true,
            warranty: true,
            review: true,
          },
        });

        // Update repairCase status to BOOKED
        await prisma.repairCase.update({
          where: { id: data.repairCaseId },
          data: { status: 'BOOKED' },
        });

        return booking;
      }
    } catch {
      // Fallback below
    }
  }

  const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
  const rep = SEEDED_REPAIRERS.find((r) => r.id === data.repairerId) || SEEDED_REPAIRERS[0];
  return {
    id: `bk-${Date.now()}`,
    repairCaseId: data.repairCaseId,
    quoteId: data.quoteId,
    repairerId: data.repairerId,
    userId: data.userId || 'usr-consumer-demo',
    trackingCode,
    status: 'REQUESTED',
    scheduledDate: new Date(data.scheduledDate),
    scheduledSlot: data.scheduledSlot,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    totalAmountINR: 4200,
    paymentStatus: 'PENDING',
    notes: data.notes || null,
    repairer: {
      id: rep.id,
      name: rep.name,
      profileImage: rep.logo,
      rating: rep.rating,
      phone: rep.phone,
      address: rep.address,
    },
    quote: {
      id: data.quoteId,
      totalCostINR: 4200,
      partsCostINR: 2400,
      laborCostINR: 1800,
      turnaroundDays: 1,
      warrantyDays: 90,
    },
    statusHistory: [
      {
        id: `sh-${Date.now()}`,
        status: 'REQUESTED',
        note: `Repair appointment scheduled for ${data.scheduledSlot}. Initial inspection pending.`,
        updatedBy: 'CUSTOMER',
        createdAt: new Date(),
      },
    ],
    warranty: {
      warrantyCode: `WTY-${Math.floor(100000 + Math.random() * 900000)}`,
      warrantyDays: 90,
      isActive: true,
      coverageTerms: '90-Day Zero-Deductible FixWise Guarantee',
    },
  };
}

export async function getAllBookings(userId?: string) {
  if (hasDatabaseConfigured) {
    try {
      const whereClause: any = {};
      if (userId) {
        whereClause.userId = userId;
      }

      const bookings = await prisma.repairBooking.findMany({
        where: whereClause,
        include: {
          repairCase: {
            include: {
              diagnosis: true,
              images: true,
              repairabilityScore: true,
            },
          },
          repairer: true,
          quote: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
          warranty: true,
          review: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (bookings && bookings.length > 0) {
        return bookings;
      }
    } catch {
      // Fallback below
    }
  }

  return INITIAL_BOOKINGS.map((b) => ({
    id: b.id,
    repairCaseId: b.caseId,
    quoteId: b.quote.id,
    repairerId: b.repairer.id,
    userId: 'usr-consumer-demo',
    trackingCode: b.trackingCode,
    status: b.status.toUpperCase(),
    scheduledDate: new Date(b.preferredDate || Date.now()),
    scheduledSlot: b.timeSlot || '10:00 AM - 01:00 PM',
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    customerAddress: b.customerAddress,
    totalAmountINR: b.totalAmount,
    paymentStatus: 'PAID',
    notes: b.diagnosis?.identifiedIssue || 'Repair service',
    createdAt: new Date(b.createdAt),
    updatedAt: new Date(b.updatedAt || b.createdAt),
    repairer: {
      id: b.repairer.id,
      name: b.repairer.name,
      profileImage: b.repairer.logo,
      rating: b.repairer.rating,
      phone: b.repairer.phone,
      address: b.repairer.address,
    },
    quote: {
      id: b.quote.id,
      totalCostINR: b.quote.price,
      partsCostINR: b.quote.partsCost,
      laborCostINR: b.quote.laborCost,
      turnaroundDays: b.quote.turnaroundDays,
      warrantyDays: b.quote.warrantyDays,
      notes: b.quote.notes,
    },
    statusHistory: b.timeline.map((t) => ({
      id: `sh-${t.status}`,
      status: t.status.toUpperCase(),
      note: t.description,
      updatedBy: t.updatedBy || 'SYSTEM',
      createdAt: new Date(t.timestamp || Date.now()),
    })),
    warranty: {
      warrantyCode: `WTY-${b.trackingCode.replace('FIX-', '')}`,
      warrantyDays: b.warrantyDays || 90,
      isActive: true,
      coverageTerms: 'Zero-deductible FixWise Warranty',
    },
  }));
}

export async function getBookingById(id: string) {
  if (hasDatabaseConfigured) {
    try {
      const booking = await prisma.repairBooking.findUnique({
        where: { id },
        include: {
          repairCase: {
            include: {
              diagnosis: true,
              images: true,
              repairabilityScore: true,
            },
          },
          repairer: true,
          quote: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
          warranty: true,
          review: true,
        },
      });
      if (booking) return booking;
    } catch {
      // Fallback below
    }
  }

  const all = await getAllBookings();
  return all.find((b: any) => b.id === id || b.trackingCode === id) || all[0];
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  note?: string,
  updatedBy: string = 'TECHNICIAN'
) {
  if (hasDatabaseConfigured) {
    try {
      const currentBooking = await prisma.repairBooking.findUnique({
        where: { id: bookingId },
        include: { repairCase: { include: { diagnosis: true } } },
      });

      if (currentBooking) {
        const updatedBooking = await prisma.repairBooking.update({
          where: { id: bookingId },
          data: {
            status: newStatus,
            paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : currentBooking.paymentStatus,
            statusHistory: {
              create: {
                status: newStatus,
                note: note || `Workbench status transitioned to ${newStatus.replace(/_/g, ' ')}.`,
                updatedBy,
              },
            },
          },
          include: {
            repairCase: {
              include: {
                diagnosis: true,
                images: true,
                repairabilityScore: true,
              },
            },
            repairer: true,
            quote: true,
            statusHistory: {
              orderBy: { createdAt: 'asc' },
            },
            warranty: true,
            review: true,
          },
        });

        return updatedBooking;
      }
    } catch {
      // Fallback below
    }
  }

  return getBookingById(bookingId);
}

export async function addBookingReview(bookingId: string, rating: number, comment: string, userId?: string) {
  if (hasDatabaseConfigured) {
    try {
      const booking = await prisma.repairBooking.findUnique({
        where: { id: bookingId },
      });

      if (booking) {
        await prisma.review.upsert({
          where: { bookingId },
          update: {
            rating: Math.min(5, Math.max(1, rating)),
            comment,
          },
          create: {
            bookingId,
            userId: userId || booking.userId,
            repairerId: booking.repairerId,
            rating: Math.min(5, Math.max(1, rating)),
            comment,
          },
        });
      }
    } catch {
      // Fallback below
    }
  }

  return getBookingById(bookingId);
}
