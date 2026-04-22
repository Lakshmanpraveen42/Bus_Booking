import api from './api';

export const tripService = {
  searchTrips: async (params) => {
    try {
      const response = await api.get('/trips/search', { params });
      return response.data;
    } catch (err) {
      throw err.response?.data?.detail || 'Failed to search trips';
    }
  },

  getTripDetails: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.detail || 'Failed to fetch trip details';
    }
  }
};
