// components/Date.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarTimeSlot from "./CalendarTimeSlot";
import { convertTimeToMinutes } from "../utils/timeHelpers";
import { Booking } from "../types";

interface DateAndNavigationProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DateAndNavigation: React.FC<DateAndNavigationProps> = ({ 
  selectedDate, 
  onDateChange 
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /**
   * Changes the date by a specified number of days
   */
  const changeDate = (days: number): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate.toISOString().slice(0, 10));
    setSelectedTime(null); // Reset selection on date change
  };

  /**
   * Handles direct date input
   */
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onDateChange(e.target.value);
    setSelectedTime(null);
  };

  /**
   * Clears selected time if it becomes booked
   */
  const handleBookingUpdate = (bookings: Booking[]): void => {
    if (selectedTime && isTimeBooked(selectedTime, bookings)) {
      setSelectedTime(null);
    }
  };

  /**
   * Checks if a time slot is booked
   */
  const isTimeBooked = (timeSlot: string, bookings: Booking[]): boolean => {
    const slotMinutes = convertTimeToMinutes(timeSlot);
    return bookings.some(booking => {
      const startMinutes = convertTimeToMinutes(booking.startTime);
      const endMinutes = startMinutes + booking.callDuration;
      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    });
  };

  return (
    <div className="w-full">
      {/* Date Navigation */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-gray-200 transition"
            onClick={() => changeDate(-1)}
          >
            <ChevronLeft size={20} />
          </button>

          <input
            type="date"
            className="border px-4 py-1 rounded-md text-sm text-center"
            value={selectedDate}
            onChange={handleDateInput}
          />

          <button
            className="p-2 rounded hover:bg-gray-200 transition"
            onClick={() => changeDate(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <CalendarTimeSlot 
        date={selectedDate} 
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        onBookingUpdate={handleBookingUpdate}
      />
    </div>
  );
};