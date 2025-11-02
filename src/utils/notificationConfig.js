// Centralized notification configuration
export const NOTIFICATION_CONFIG = {
  URGENCY_WINDOW_MINUTES: 20, // Only show urgency for bookings within 20 minutes
};

// Function to calculate minutes until booking starts
export const getMinutesUntilBooking = (scheduledAt) => {
  try {
    const now = new Date();
    const scheduledUTC = new Date(scheduledAt);
    const timeDiff = scheduledUTC.getTime() - now.getTime() - (5.5 * 60 * 60 * 1000); // IST adjustment
    return Math.max(0, Math.round(timeDiff / (1000 * 60)));
  } catch (error) {
    return null;
  }
};

// Function to check if booking needs urgency display
export const shouldShowUrgency = (scheduledAt) => {
  const minutesUntil = getMinutesUntilBooking(scheduledAt);
  return minutesUntil !== null && minutesUntil < NOTIFICATION_CONFIG.URGENCY_WINDOW_MINUTES;
}; 