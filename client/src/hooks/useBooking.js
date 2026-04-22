import { useBookingStore } from '../store/useBookingStore';
import { BOOKING_STATUS } from '../utils/constants';

/**
 * Exposes booking submission logic and status to the Checkout page.
 * Components must never call bookingService directly.
 */
export const useBooking = () => {
  const {
    bookingStatus,
    bookingError,
    bookingId,
    bookingData,
    confirmBooking,
    retryBooking,
  } = useBookingStore();

  const isProcessing = bookingStatus === BOOKING_STATUS.PROCESSING;
  const isSuccess = bookingStatus === BOOKING_STATUS.SUCCESS;
  const isFailed = bookingStatus === BOOKING_STATUS.FAILED;

  return {
    submit: confirmBooking,
    retry: retryBooking,
    status: bookingStatus,
    error: bookingError,
    bookingId,
    bookingData,
    isProcessing,
    isSuccess,
    isFailed,
  };
};
