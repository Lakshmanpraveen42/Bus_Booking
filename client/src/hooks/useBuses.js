import { useState, useEffect, useCallback } from 'react';
import { busService } from '../services/busService';

/**
 * Fetch buses for given search params.
 * Returns { data, loading, error, refetch } — always.
 * Components must never call busService directly.
 */
export const useBuses = (searchParams) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBuses = useCallback(async () => {
    if (!searchParams?.from || !searchParams?.to || !searchParams?.date) return;

    setLoading(true);
    setError(null);

    try {
      const result = await busService.searchBuses(searchParams);
      setData(result);
    } catch (err) {
      setError(err.message ?? 'Failed to fetch buses. Please try again.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams?.from, searchParams?.to, searchParams?.date]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  return { data, loading, error, refetch: fetchBuses };
};
