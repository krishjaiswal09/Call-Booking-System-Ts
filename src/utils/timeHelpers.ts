// utils/timeHelpers.ts

/**
 * Converts time string (e.g., "2:30 PM") to minutes since midnight
 * @param timeStr - Time string in format "H:MM AM/PM"
 * @returns Number of minutes since midnight
 */
export const convertTimeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalHours = hours;
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) totalHours += 12;
  if (period === 'AM' && hours === 12) totalHours = 0;
  
  return totalHours * 60 + minutes;
};