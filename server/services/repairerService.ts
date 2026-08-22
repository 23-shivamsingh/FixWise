import { prisma, hasDatabaseConfigured } from '../lib/prisma';
import { SEEDED_REPAIRERS } from '../../src/data/seedData';

export interface RepairerFilterOptions {
  city?: string;
  category?: string;
  isVerified?: boolean;
  minRating?: number;
  maxDistanceKm?: number;
  userLat?: number;
  userLng?: number;
}

export async function getAllRepairers(filter?: RepairerFilterOptions) {
  if (hasDatabaseConfigured) {
    try {
      const whereClause: any = {};

      if (filter?.city) {
        whereClause.city = { contains: filter.city, mode: 'insensitive' };
      }
      if (filter?.isVerified !== undefined) {
        whereClause.isVerified = filter.isVerified;
      }
      if (filter?.minRating) {
        whereClause.rating = { gte: filter.minRating };
      }

      const repairers = await prisma.repairer.findMany({
        where: whereClause,
        include: {
          services: true,
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
      });

      if (repairers && repairers.length > 0) {
        // Calculate distance if user lat/lng provided
        if (filter?.userLat && filter?.userLng) {
          return repairers.map((r) => {
            const distanceKm = calculateHaversineDistance(
              filter.userLat!,
              filter.userLng!,
              r.latitude,
              r.longitude
            );
            return {
              ...r,
              distanceKm: Math.round(distanceKm * 10) / 10,
            };
          });
        }
        return repairers;
      }
    } catch {
      // Fallback below
    }
  }

  // Graceful fallback to seeded repairers
  return SEEDED_REPAIRERS.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.tagline,
    profileImage: s.logo,
    rating: s.rating,
    reviewCount: s.reviewCount,
    isVerified: s.verified,
    distanceKm: s.distanceKm,
    latitude: s.lat,
    longitude: s.lng,
    address: s.address,
    city: s.city,
    phone: s.phone,
    minPriceINR: 1500,
    maxPriceINR: 4500,
    avgTurnaroundHours: s.avgTurnaroundDays * 24,
    warrantyDays: s.warrantyDays,
    services: s.specialties.map((spec) => ({ id: `svc-${spec}`, name: spec, isFeatured: true })),
    reviews: s.reviews,
  }));
}

export async function getRepairerById(id: string) {
  if (hasDatabaseConfigured) {
    try {
      const repairer = await prisma.repairer.findUnique({
        where: { id },
        include: {
          services: true,
          reviews: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (repairer) return repairer;
    } catch {
      // Fallback below
    }
  }

  const s = SEEDED_REPAIRERS.find((r) => r.id === id) || SEEDED_REPAIRERS[0];
  return {
    id: s.id,
    name: s.name,
    description: s.tagline,
    profileImage: s.logo,
    rating: s.rating,
    reviewCount: s.reviewCount,
    isVerified: s.verified,
    distanceKm: s.distanceKm,
    latitude: s.lat,
    longitude: s.lng,
    address: s.address,
    city: s.city,
    phone: s.phone,
    minPriceINR: 1500,
    maxPriceINR: 4500,
    avgTurnaroundHours: s.avgTurnaroundDays * 24,
    warrantyDays: s.warrantyDays,
    services: s.specialties.map((spec) => ({ id: `svc-${spec}`, name: spec, isFeatured: true })),
    reviews: s.reviews,
  };
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
