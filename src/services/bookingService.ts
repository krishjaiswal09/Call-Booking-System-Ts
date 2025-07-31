// services/bookingService.ts
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Booking, BookingData, ConflictCheckResult } from '../types';

const BOOKINGS_COLLECTION = 'bookings';

/**
 * Converts time string to minutes since midnight
 */
const timeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalHours = hours;
  
  if (period === 'PM' && hours !== 12) totalHours += 12;
  if (period === 'AM' && hours === 12) totalHours = 0;
  
  return totalHours * 60 + minutes;
};

/**
 * Checks if two time ranges overlap
 */
const hasOverlap = (start1: number, end1: number, start2: number, end2: number): boolean => {
  return start1 < end2 && start2 < end1;
};

/**
 * Checks for booking conflicts on a given date and time
 */
export const checkBookingConflict = async (
  date: string, 
  startTime: string, 
  callDuration: number
): Promise<ConflictCheckResult> => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + callDuration;
  
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('date', '==', date)
  );
  
  const snapshot = await getDocs(q);
  
  for (const docSnapshot of snapshot.docs) {
    const booking = { id: docSnapshot.id, ...docSnapshot.data() } as Booking;
    const bookingStart = timeToMinutes(booking.startTime);
    const bookingEnd = bookingStart + booking.callDuration;
    
    if (hasOverlap(startMinutes, endMinutes, bookingStart, bookingEnd)) {
      return {
        hasConflict: true,
        conflictingBooking: booking
      };
    }
  }
  
  return { hasConflict: false };
};

/**
 * Creates a new booking
 */
export const createBooking = async (bookingData: BookingData): Promise<string> => {
  const { date, startTime, callType } = bookingData;
  const callDuration = callType === 'Onboarding' ? 40 : 20;
  
  // Check for conflicts first
  const conflictCheck = await checkBookingConflict(date, startTime, callDuration);
  if (conflictCheck.hasConflict) {
    throw new Error('This time slot overlaps with an existing booking.');
  }
  
  // Create the booking
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
    ...bookingData,
    callDuration,
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
};

/**
 * Deletes a booking by ID
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
  await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
};

/**
 * Subscribes to bookings for a specific date
 */
export const subscribeToBookingsByDate = (
  date: string, 
  callback: (bookings: Booking[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('date', '==', date)
  );
  
  return onSnapshot(q, (snapshot) => {
    const bookings: Booking[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
    callback(bookings);
  });
};