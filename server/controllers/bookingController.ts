import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/bookingService';
import { BookingStatus } from '@prisma/client';

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const input: bookingService.CreateBookingInput = req.body;

    if (
      !input.repairCaseId ||
      !input.quoteId ||
      !input.repairerId ||
      !input.scheduledDate ||
      !input.scheduledSlot ||
      !input.customerName ||
      !input.customerPhone
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields (repairCaseId, quoteId, repairerId, scheduledDate, scheduledSlot, customerName, customerPhone)',
      });
    }

    const booking = await bookingService.createBooking(input);
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.query;
    const bookings = await bookingService.getAllBookings(typeof userId === 'string' ? userId : undefined);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, note, updatedBy } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const updated = await bookingService.updateBookingStatus(
      id,
      status as BookingStatus,
      note,
      updatedBy || 'TECHNICIAN'
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function addReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { rating, comment, userId } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Rating and comment are required',
      });
    }

    const updated = await bookingService.addBookingReview(
      id,
      Number(rating),
      comment,
      userId
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
