import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BOOKING_STATUS, GST_RATE, MAX_SEATS_PER_BOOKING } from '../utils/constants';
import { bookingService } from '../services/bookingService';

const computePricing = (selectedSeats, pricePerSeat) => {
  const baseFare = selectedSeats.length * pricePerSeat;
  const gst = Math.round(baseFare * GST_RATE);
  return { baseFare, gst, total: baseFare + gst };
};

export const useBookingStore = create(
  persist(
    (set, get) => ({
      // ─── Search ──────────────────────────────────────
      searchParams: null, // { from, to, date }

      // ─── Selected bus (normalized via mapBusData) ────
      selectedBus: null,

      // ─── Seat selection ──────────────────────────────
      selectedSeats: [], // array of seat IDs

      // ─── Passenger details (one per seat) ────────────
      passengers: [],

      // ─── Pricing ─────────────────────────────────────
      pricing: { baseFare: 0, gst: 0, total: 0 },

      // ─── Booking state machine ────────────────────────
      bookingStatus: BOOKING_STATUS.IDLE,
      bookingId: null,
      bookingError: null,
      bookingData: null, // full normalized booking from service

      // ══════════════════════════════════════════════════
      // ACTIONS
      // ══════════════════════════════════════════════════

      setSearchParams: (params) =>
        set({ searchParams: params }),

      selectBus: (bus) =>
        set({ selectedBus: bus, selectedSeats: [], pricing: computePricing([], bus.pricePerSeat) }),

      toggleSeat: (seatId) => {
        const { selectedSeats, selectedBus } = get();
        if (!selectedBus) return;

        const isSelected = selectedSeats.includes(seatId);
        let nextSeats;

        if (isSelected) {
          nextSeats = selectedSeats.filter((id) => id !== seatId);
        } else {
          if (selectedSeats.length >= MAX_SEATS_PER_BOOKING) return; // guard
          nextSeats = [...selectedSeats, seatId];
        }

        set({
          selectedSeats: nextSeats,
          pricing: computePricing(nextSeats, selectedBus.pricePerSeat),
        });
      },

      setPassengers: (passengers) => set({ passengers }),

      confirmBooking: async () => {
        const { selectedBus, selectedSeats, pricing } = get();

        set({ bookingStatus: BOOKING_STATUS.PROCESSING, bookingError: null });

        try {
          // Backend expects { trip_id, seat_numbers, total_amount }
          const result = await bookingService.createBooking({
            tripId: selectedBus.tripId,
            selectedSeats,
            pricing,
          });

          set({
            bookingStatus: BOOKING_STATUS.SUCCESS,
            bookingId: result.id,
            bookingData: result,
          });

          return { success: true };
        } catch (err) {
          set({
            bookingStatus: BOOKING_STATUS.FAILED,
            bookingError: err.message ?? 'Payment failed. Please try again.',
          });
          return { success: false };
        }
      },

      retryBooking: () =>
        set({ bookingStatus: BOOKING_STATUS.IDLE, bookingError: null }),

      resetBooking: () =>
        set({
          searchParams: null,
          selectedBus: null,
          selectedSeats: [],
          passengers: [],
          pricing: { baseFare: 0, gst: 0, total: 0 },
          bookingStatus: BOOKING_STATUS.IDLE,
          bookingId: null,
          bookingError: null,
          bookingData: null,
        }),
    }),
    {
      name: 'bus-booking-storage',
      storage: createJSONStorage(() => localStorage),
      // Optional: don't persist transient errors
      onRehydrateStorage: () => (state) => {
        if (state) state.bookingStatus = BOOKING_STATUS.IDLE;
      }
    }
  )
);
