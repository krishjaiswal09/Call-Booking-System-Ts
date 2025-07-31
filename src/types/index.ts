// types/index.ts

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  callType: CallType;
  callDuration: number;
  isRecurring: boolean;
  createdAt?: any; // Firebase timestamp
}

export type CallType = 'Onboarding' | 'Follow-up';

export interface BookingData {
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  callType: CallType;
  isRecurring: boolean;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: Booking;
}

export interface TimeSlotInfo {
  isBooked: boolean;
  booking?: Booking;
}