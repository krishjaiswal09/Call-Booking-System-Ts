// components/BookCall.tsx
import React, { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoIosArrowDropdown } from "react-icons/io";
import { dummyClients } from "../data/client";
import { timeSlots } from "../data/timeSlot";
import { createBooking } from "../services/bookingService";
import { Client, CallType } from "../types";

interface BookCallProps {
  selectedDate: string;
  onBookingCreated?: () => void;
}

export const BookCall: React.FC<BookCallProps> = ({ selectedDate, onBookingCreated }) => {
  // Modal state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Form state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCallType, setSelectedCallType] = useState<CallType>('Onboarding');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  
  // UI state
  const [showClients, setShowClients] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /**
   * Formats date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric"
    });
  };

  /**
   * Resets form to initial state
   */
  const resetForm = (): void => {
    setSelectedClient(null);
    setSelectedTime(null);
    setSelectedCallType('Onboarding');
    setIsRecurring(false);
    setError('');
    setShowClients(false);
  };

  /**
   * Closes modal and resets form
   */
  const closeModal = (): void => {
    resetForm();
    setIsOpen(false);
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (): Promise<void> => {
    // Validation
    if (!selectedClient || !selectedTime) {
      setError('Please select a client and time slot');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const bookingData = {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        date: selectedDate,
        startTime: selectedTime,
        callType: selectedCallType,
        isRecurring: isRecurring
      };

      await createBooking(bookingData);
      onBookingCreated?.();
      closeModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles client selection
   */
  const selectClient = (client: Client): void => {
    setSelectedClient(client);
    setShowClients(false);
  };

  const callTypeOptions = [
    { type: "Onboarding" as CallType, duration: "40min" },
    { type: "Follow-up" as CallType, duration: "20min" }
  ];

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md font-medium"
      >
        + Book Call
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800">Book a Call</h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Client Selection */}
            <label className="mb-1 text-sm font-medium block text-gray-700">Client</label>
            <div className="relative mb-4">
              <div
                onClick={() => setShowClients(!showClients)}
                className="border px-3 py-2 rounded-md cursor-pointer bg-white flex justify-between items-center text-sm text-gray-800 shadow-sm"
              >
                <span>
                  {selectedClient
                    ? `${selectedClient.name} (${selectedClient.phone})`
                    : "Select a client"}
                </span>
                <IoIosArrowDropdown className="text-gray-500 text-lg" />
              </div>

              {showClients && (
                <div className="absolute bg-white border mt-1 w-full rounded-md max-h-60 overflow-y-auto z-10 shadow-md">
                  {dummyClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => selectClient(client)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-gray-800">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Call Type Selection */}
            <div className="mb-2 text-sm font-medium text-gray-700">Call Type</div>
            <div className="flex gap-2 mb-4">
              {callTypeOptions.map(({ type, duration }) => (
                <button
                  key={type}
                  onClick={() => setSelectedCallType(type)}
                  className={`w-1/2 px-3 py-1 transition rounded text-sm border ${
                    selectedCallType === type
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                  }`}
                >
                  {type}
                  <p className="text-xs text-gray-600">{duration}</p>
                </button>
              ))}
            </div>

            {/* Recurring Option */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded"
                />
                Make this a recurring weekly call
              </label>
            </div>

            {/* Date Display */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <CiCalendar size={20} />
                <span className="px-3 py-1 bg-gray-100 rounded">Date</span>
              </div>
              <div className="border rounded-md px-3 py-2 text-sm bg-white text-gray-800 shadow-sm">
                {formatDate(selectedDate)}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <MdOutlineWatchLater size={20} />
                <span className="px-3 py-1 bg-gray-100 rounded">Time</span>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-2 py-1 rounded text-sm transition border ${
                      selectedTime === time
                        ? "bg-blue-100 border-blue-400 font-medium text-blue-700"
                        : "bg-white border-gray-300 text-gray-800 hover:bg-blue-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Time Display */}
            {selectedTime && (
              <div className="text-sm mt-2 text-gray-600">
                Selected Time: <span className="font-medium text-blue-700">{selectedTime}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={closeModal}
                className="w-1/2 px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 bg-white hover:bg-gray-100 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isLoading || !selectedClient || !selectedTime}
                className="w-1/2 px-4 py-2 rounded text-sm text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Booking...' : 'Book Call'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};