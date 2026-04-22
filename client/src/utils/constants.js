/**
 * Application-wide constants and enums.
 * Never use raw string literals for statuses — always import from here.
 */

// ─── Seat Status ────────────────────────────────────
export const SEAT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked',
});

// ─── Booking Status (state machine) ─────────────────
export const BOOKING_STATUS = Object.freeze({
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
});

// ─── Bus Types ───────────────────────────────────────
export const BUS_TYPE = Object.freeze({
  AC: 'AC',
  NON_AC: 'Non-AC',
  SLEEPER: 'Sleeper',
  SEMI_SLEEPER: 'Semi-Sleeper',
});

// ─── Sort Options ────────────────────────────────────
export const SORT_OPTIONS = Object.freeze({
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  DEPARTURE_EARLY: 'departure_early',
  DEPARTURE_LATE: 'departure_late',
  RATING: 'rating',
  DURATION: 'duration',
});

// ─── Departure Time Slots ────────────────────────────
export const DEPARTURE_SLOTS = Object.freeze([
  { id: 'before_6am', label: 'Before 6 AM', range: [0, 6] },
  { id: '6am_to_12pm', label: '6 AM – 12 PM', range: [6, 12] },
  { id: '12pm_to_6pm', label: '12 PM – 6 PM', range: [12, 18] },
  { id: 'after_6pm', label: 'After 6 PM', range: [18, 24] },
]);

// ─── Pricing ─────────────────────────────────────────
export const GST_RATE = 0.05; // 5% GST on bus tickets

// ─── Chat sender roles ────────────────────────────────
export const CHAT_SENDER = Object.freeze({
  USER: 'user',
  BOT: 'bot',
});

// ─── Max seats selectable at once ────────────────────
export const MAX_SEATS_PER_BOOKING = 6;

// ─── Popular routes for Home page chips ──────────────
export const POPULAR_ROUTES = Object.freeze([
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Bangalore', to: 'Chennai' },
  { from: 'Mumbai', to: 'Goa' },
  { from: 'Hyderabad', to: 'Bangalore' },
  { from: 'Delhi', to: 'Agra' },
]);
