import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingStore } from '../store/useBookingStore';
import { BOOKING_STATUS } from '../utils/constants';

/** Guard: requires user to be an Admin */
export const RequireAdmin = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user?.is_admin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Route guards: prevent invalid navigation between booking steps.
 * Each guard checks the required store state and redirects if missing.
 */

/** Guard: requires searchParams to be set */
export const RequireSearch = ({ children }) => {
  const searchParams = useBookingStore((s) => s.searchParams);
  if (!searchParams) return <Navigate to="/" replace />;
  return children;
};

/** Guard: requires a selectedBus */
export const RequireBus = ({ children }) => {
  const selectedBus = useBookingStore((s) => s.selectedBus);
  if (!selectedBus) return <Navigate to="/" replace />;
  return children;
};

/** Guard: requires at least one selected seat */
export const RequireSeats = ({ children }) => {
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const selectedBus = useBookingStore((s) => s.selectedBus);
  if (!selectedBus) return <Navigate to="/" replace />;
  if (!selectedSeats.length) return <Navigate to={`/seats/${selectedBus.tripId}`} replace />;
  return children;
};

/** Guard: requires bookingStatus === 'success' */
export const RequireBookingSuccess = ({ children }) => {
  const bookingStatus = useBookingStore((s) => s.bookingStatus);
  const bookingId = useBookingStore((s) => s.bookingId);
  if (bookingStatus !== BOOKING_STATUS.SUCCESS || !bookingId) {
    return <Navigate to="/" replace />;
  }
  return children;
};
