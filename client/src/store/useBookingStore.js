import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BOOKING_STATUS, GST_RATE, MAX_SEATS_PER_BOOKING } from '../utils/constants';
import { bookingService } from '../services/bookingService';

const computePricing = (selectedSeats, pricePerSeat, insuranceSelected = false) => {
  const baseFare = selectedSeats.length * pricePerSeat;
  const gst = Math.round(baseFare * GST_RATE);
  const insurance = insuranceSelected ? selectedSeats.length * 15 : 0;
  return { baseFare, gst, insurance, total: baseFare + gst + insurance };
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
      pricing: { baseFare: 0, gst: 0, insurance: 0, total: 0 },
      insuranceSelected: false,

      // ─── Booking state machine ────────────────────────
      bookingStatus: BOOKING_STATUS.IDLE,
      bookingId: null,
      bookingError: null,
      bookingData: null, // full normalized booking from service
      
      // ─── Route Points ──────────────────────────────
      boardingPoint: null,
      droppingPoint: null,

      // ══════════════════════════════════════════════════
      // ACTIONS
      // ══════════════════════════════════════════════════

      setSearchParams: (params) =>
        set({ searchParams: params }),

      selectBus: (bus) =>
        set({ 
          selectedBus: bus, 
          selectedSeats: [], 
          insuranceSelected: false,
          pricing: computePricing([], bus.pricePerSeat),
          boardingPoint: null,
          droppingPoint: null
        }),

      toggleSeat: (seatId) => {
        const { selectedSeats, selectedBus, insuranceSelected } = get();
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
          pricing: computePricing(nextSeats, selectedBus.pricePerSeat, insuranceSelected),
        });
      },

      toggleInsurance: (val) => {
        const { selectedSeats, selectedBus } = get();
        if (!selectedBus) return;
        set({
          insuranceSelected: val,
          pricing: computePricing(selectedSeats, selectedBus.pricePerSeat, val),
        });
      },

      setPassengers: (passengers) => set({ passengers }),

      setRoutePoints: (points) => set({ ...points }),

      confirmBooking: async () => {
        const { selectedBus, selectedSeats, pricing, passengers, insuranceSelected } = get();

        set({ bookingStatus: BOOKING_STATUS.PROCESSING, bookingError: null });

        try {
          // Backend expects { trip_id, seat_numbers, total_amount, passengers }
          const result = await bookingService.createBooking({
            tripId: selectedBus.tripId,
            selectedSeats,
            pricing,
            passengers,
            insurance: insuranceSelected,
            boardingPoint: get().boardingPoint,
            droppingPoint: get().droppingPoint,
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
          insuranceSelected: false,
          pricing: { baseFare: 0, gst: 0, insurance: 0, total: 0 },
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
