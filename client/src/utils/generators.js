import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a booking ID in the format: BG-XXXXXXXX (uppercase hex).
 */
export const generateBookingId = () => {
  const raw = uuidv4().replace(/-/g, '').toUpperCase().slice(0, 8);
  return `BG-${raw}`;
};

/**
 * Build a QR code payload string from booking data.
 */
export const buildQRPayload = ({ bookingId, from, to, date, seats }) => {
  return JSON.stringify({ bookingId, from, to, date, seats });
};

/**
 * Generate a unique message ID for chat messages.
 */
export const generateMsgId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Generate a unique session ID for chat sessions.
 */
export const generateSessionId = () => {
  const chars = Math.random().toString(36).slice(2, 5).toUpperCase();
  const suffix = Date.now().toString().slice(-3);
  return `CONV_${chars}_${suffix}`;
};

/**
 * Simulate an async delay (for mock service realism).
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
