import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';

/**
 * Syncs URL Query Params with Zustand Search Params.
 * Usage: /buses?from=HYD&to=BLR&date=2024-05-20
 */
export const useSearchSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeSearchParams = useBookingStore((s) => s.searchParams);
  const setStoreSearchParams = useBookingStore((s) => s.setSearchParams);

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');

    if (from && to && date) {
      // Avoid infinite loop by checking if state is different
      if (
        storeSearchParams?.from !== from ||
        storeSearchParams?.to !== to ||
        storeSearchParams?.date !== date
      ) {
        setStoreSearchParams({ from, to, date });
      }
    }
  }, [searchParams, setStoreSearchParams]); // Only sync from URL to Store on mount or URL change

  const updateURL = (params) => {
    setSearchParams(params);
  };

  return { updateURL };
};
