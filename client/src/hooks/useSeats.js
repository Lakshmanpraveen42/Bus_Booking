import { useState, useEffect, useCallback } from 'react';
import { seatService } from '../services/seatService';

/**
 * Fetch seat layout for a given tripId.
 * Seat data is always fetched separately from bus data.
 * Returns { data, loading, error, refetch } — always.
 */
export const useSeats = (tripId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSeats = useCallback(async () => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await seatService.getSeatLayout(tripId);
      setData(result);
    } catch (err) {
      setError(err.message ?? 'Failed to load seat layout. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  return { data, loading, error, refetch: fetchSeats };
};
